import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

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

  // API: Chat proxy using @google/genai
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemInstruction, webSearchEnabled } = req.body;
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

      // 4. Generate content
      const config: any = {
        systemInstruction: systemInstruction || "You are V-Astra AI, a highly smart, sophisticated, and polished AI companion. Keep answers clear, eloquent, and helpful.",
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
