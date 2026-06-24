import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads
  app.use(express.json());

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Local file-based JSON database path
  const DB_PATH = path.join(process.cwd(), "user_profile_db.json");

  // Helper to read database
  function getDatabase() {
    if (fs.existsSync(DB_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading database file, returning empty object", e);
        return {};
      }
    }
    return {};
  }

  // Helper to save database
  function saveDatabase(data: any) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to database file", e);
    }
  }

  // API: Save user language settings (PUT /api/user/settings/language)
  app.put("/api/user/settings/language", (req, res) => {
    try {
      const { primary_language, secondary_language, userName } = req.body;
      if (!primary_language || !secondary_language) {
        res.status(400).json({ error: "Missing required fields: primary_language and secondary_language are required." });
        return;
      }

      const db = getDatabase();
      const key = (typeof userName === "string" && userName.trim()) ? userName.trim() : "default_user";
      
      db[key] = {
        primary_language,
        secondary_language,
        updatedAt: new Date().toISOString()
      };
      
      saveDatabase(db);
      console.log(`[Database] Saved language preferences for user '${key}': Primary = ${primary_language}, Secondary = ${secondary_language}`);

      res.json({
        success: true,
        primary_language,
        secondary_language,
        message: "Language preferences successfully saved to the database."
      });
    } catch (error: any) {
      console.error("Error in PUT /api/user/settings/language:", error);
      res.status(500).json({ error: error?.message || "Internal server error saving language preferences." });
    }
  });

  // API: Retrieve user language settings (GET /api/user/settings/language)
  app.get("/api/user/settings/language", (req, res) => {
    try {
      const { userName } = req.query;
      const db = getDatabase();
      const key = (typeof userName === "string" && userName.trim()) ? userName.trim() : "default_user";
      
      const settings = db[key] || {
        primary_language: "English (India)",
        secondary_language: "Malayalam (മലയാളം)"
      };

      res.json(settings);
    } catch (error: any) {
      console.error("Error in GET /api/user/settings/language:", error);
      res.status(500).json({ error: error?.message || "Internal server error retrieving language preferences." });
    }
  });

  // API: Chat proxy using @google/genai
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, webSearchEnabled, primary_language, secondary_language, userName } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid request. 'messages' array is required." });
        return;
      }

      // 1. Get the API Key from header or fallback to env variable
      const clientApiKey = req.headers["x-gemini-key"];
      const apiKey = (typeof clientApiKey === "string" && clientApiKey.trim()) 
        ? clientApiKey.trim() 
        : process.env.GEMINI_API_KEY;

      if (!apiKey) {
        res.status(400).json({ 
          error: "API key is missing. Please enter your Gemini API key in the V-Astra AI settings box (found in the Liquid Glass sidebar) to start chatting." 
        });
        return;
      }

      // 2. Initialize Google GenAI on the server side
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // 3. Format messages to the @google/genai contents format
      // GenAI format uses roles: "user" and "model".
      const contents = messages.map((msg: { role: string; content: string }) => {
        const role = msg.role === "assistant" ? "model" : "user";
        return {
          role,
          parts: [{ text: msg.content }],
        };
      });

      // Retrieve language preferences from database if not passed directly in request
      let primary = primary_language;
      let secondary = secondary_language;
      
      if (!primary || !secondary) {
        const db = getDatabase();
        const key = (typeof userName === "string" && userName.trim()) ? userName.trim() : "default_user";
        const userPrefs = db[key];
        if (userPrefs) {
          primary = primary || userPrefs.primary_language;
          secondary = secondary || userPrefs.secondary_language;
        }
      }
      
      primary = primary || "English (India)";
      secondary = secondary || "Malayalam (മലയാളം)";

      // STT Voice / AI engine simulation: configure voice codecs & acoustic models
      console.log(`[STT / Voice AI Engine] Integrating voice capture pipelines. Primary recognition language: '${primary}', Secondary recognition language: '${secondary}'.`);

      // 4. Generate content
      const languageDirectives = `\n\n[Voice/STT Engine Configuration]\n- Primary Recognition & Speech Language: ${primary}\n- Secondary Recognition & Speech Language: ${secondary}\n- Always prioritize recognition, comprehension, and response generation in these chosen languages. If the user greets or replies in native script or accents corresponding to these options, adapt dynamically and deliver highly fluent responses.`;

      const config: any = {
        systemInstruction: (systemInstruction || "You are V-Astra AI, a highly smart, sophisticated, and polished AI companion. Keep answers clear, eloquent, and helpful.") + languageDirectives,
      };

      // Conditionally enable Google Search grounding tool if webSearchEnabled is true
      if (webSearchEnabled === true) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error?.message || "An unexpected error occurred while communicating with the Gemini model." 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
