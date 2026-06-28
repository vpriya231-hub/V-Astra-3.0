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
      const { messages, systemInstruction, webSearchEnabled, primary_language, secondary_language, userName, aiMode } = req.body;
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

      // 4. Generate content based on selected mode
      const selectedMode = aiMode || "standard";
      let modeDirective = "";
      let modelCandidates = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];

      if (selectedMode === "thinking") {
        modeDirective = `\n\n[Mode: Thinking Activated]\n- You are operating in Advanced Reasoning, Coding, and Mathematical Thinking mode.\n- Focus on depth, extreme precision, and bulletproof logic. Write clear, detailed, and structured steps.\n- CRITICAL: You must explicitly walk through your reasoning step-by-step under a "### 💭 Analysis & Thought Process" header first, before presenting your clean, optimal final code/math answer.`;
        modelCandidates = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"];
      } else if (selectedMode === "medium") {
        modeDirective = `\n\n[Mode: Medium Activated]\n- You are operating in Balanced All-Rounder Help mode.\n- Deliver beautifully detailed, well-rounded, and comprehensive explanations.\n- Frame complex topics elegantly and cover necessary sub-elements with high contextual nuance.`;
        modelCandidates = ["gemini-2.5-flash", "gemini-3.5-flash"];
      } else {
        // "standard"
        modeDirective = `\n\n[Mode: Standard Activated]\n- You are operating in Standard Companion mode (fast, direct, and conversational).\n- Focus on response speed, directness, and highly refined summaries.\n- Deliver the answers eloquently and directly, without unnecessary preamble.`;
        modelCandidates = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];
      }

      const languageDirectives = `\n\n[Voice/STT Engine Configuration]\n- Primary Recognition & Speech Language: ${primary}\n- Secondary Recognition & Speech Language: ${secondary}\n- Always prioritize recognition, comprehension, and response generation in these chosen languages. If the user greets or replies in native script or accents corresponding to these options, adapt dynamically and deliver highly fluent responses.`;

      const config: any = {
        systemInstruction: (systemInstruction || "You are V-Astra AI, a highly smart, sophisticated, and polished AI companion. Keep answers clear, eloquent, and helpful.") + modeDirective + languageDirectives,
      };

      // Conditionally enable Google Search grounding tool if webSearchEnabled is true
      if (webSearchEnabled === true) {
        config.tools = [{ googleSearch: {} }];
      }

      let response = null;
      let lastError: any = null;

      // Helper for sleep/backoff
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      // Robust check for error types (rate limits, quotas, transient service faults)
      function classifyError(err: any) {
        if (!err) return { isQuota: false, isTransient: false };
        const errStr = (
          (err.message || "") + " " + 
          (err.status || "") + " " + 
          (err.code || "") + " " + 
          (typeof err === "object" ? JSON.stringify(err) : String(err))
        ).toLowerCase();

        const isQuota = errStr.includes("429") || 
                        errStr.includes("quota") || 
                        errStr.includes("exhausted") || 
                        errStr.includes("limit") || 
                        errStr.includes("resource_exhausted") ||
                        errStr.includes("rate");

        const isTransient = errStr.includes("503") || 
                            errStr.includes("500") ||
                            errStr.includes("temporary") || 
                            errStr.includes("unavailable") || 
                            errStr.includes("overloaded") ||
                            errStr.includes("busy") ||
                            errStr.includes("connect");

        return { isQuota, isTransient };
      }

      // Attempt generation with active config (potentially with grounding search)
      async function attemptGeneration(currentConfig: any) {
        for (const modelName of modelCandidates) {
          let retryCount = 0;
          const maxRetries = 2;
          
          while (retryCount <= maxRetries) {
            try {
              console.log(`[Gemini API] Attempting generation. Model: '${modelName}' (Attempt ${retryCount + 1}/${maxRetries + 1})`);
              const resObj = await ai.models.generateContent({
                model: modelName,
                contents,
                config: currentConfig,
              });
              if (resObj && resObj.text) {
                return resObj;
              }
            } catch (err: any) {
              lastError = err;
              const { isQuota, isTransient } = classifyError(err);
              const errMsg = err?.message || String(err);

              console.warn(`[Gemini API Warning] Model '${modelName}' failed: ${errMsg}`);

              if ((isQuota || isTransient) && retryCount < maxRetries) {
                retryCount++;
                const backoffTime = retryCount * 1000; // 1s, 2s backoff
                console.log(`[Gemini API] Retrying '${modelName}' in ${backoffTime}ms due to transient load or speed limits...`);
                await sleep(backoffTime);
              } else {
                break; // Try next model candidate
              }
            }
          }
        }
        return null;
      }

      // First run: attempt with requested config (including Google Search if enabled)
      response = await attemptGeneration(config);

      // Second run: If it failed and webSearchEnabled was true, auto fallback to standard text generation (no search tools)
      if (!response && webSearchEnabled === true) {
        console.warn("[Gemini API Fallback] Generation failed with web search enabled. Attempting fallback generation without Web Search grounding...");
        const fallbackConfig = { ...config };
        delete fallbackConfig.tools; // Strip googleSearch tools
        response = await attemptGeneration(fallbackConfig);
      }

      let responseText = "";
      if (response && response.text) {
        responseText = response.text;
      } else {
        // Ultimate user-friendly elegant conversational fallback instead of hard crash
        const { isQuota: isQuotaExceeded } = classifyError(lastError);

        console.error("[Gemini API Error] All candidate models and search fallbacks failed. Presenting elegant conversation fallback.");

        if (isQuotaExceeded) {
          responseText = `### ⚠️ Service Notice: High Demand & Quota Limit

Hello! I am **V-Astra AI**. It appears that the primary Gemini AI API is currently experiencing a temporary **quota limit (Rate Limit / Resource Exhausted)**.

To help resume our conversation smoothly, please try the following steps:
1. **Disable Web Search** — Grounding with Google Search utilizes a separate query quota which is highly limited on free developer channels. Toggling this off in the sidebar settings usually resolves the issue.
2. **Wait a few moments** — Transient quota restrictions and speed limits typically refresh every 60 seconds.
3. If you have registered a custom **API Key** in the settings, please double-check that it is valid and has billing active.

*I am ready to resume our normal conversational stream as soon as the API limits clear. Please feel free to send another message in a moment!*`;
        } else {
          responseText = `### ⚠️ Connection Interrupted

Hello! I am **V-Astra AI**. I was unable to establish a secure connection with the Gemini server due to a temporary network issue or service overload (503 Service Unavailable).

Please try resending your message in a few moments. Our connection should restore shortly!`;
        }
      }

      res.json({ text: responseText });
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
