import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import {
  googleWorkspaceToolDeclarations,
  executeGoogleWorkspaceTool,
  GoogleConnectorsPayload,
} from "./src/lib/googleWorkspaceTools.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads with generous limit for image uploads and multimodal payloads (up to 50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
      const { primary_language, secondary_language, v_astra_language, userName } = req.body;
      if (!primary_language || !secondary_language) {
        res.status(400).json({ error: "Missing required fields: primary_language and secondary_language are required." });
        return;
      }

      const db = getDatabase();
      const key = (typeof userName === "string" && userName.trim()) ? userName.trim() : "default_user";
      
      db[key] = {
        primary_language,
        secondary_language,
        v_astra_language: v_astra_language || "English (India)",
        updatedAt: new Date().toISOString()
      };
      
      saveDatabase(db);
      console.log(`[Database] Saved language preferences for user '${key}': Primary = ${primary_language}, Secondary = ${secondary_language}, V Astra = ${v_astra_language}`);

      res.json({
        success: true,
        primary_language,
        secondary_language,
        v_astra_language: v_astra_language || "English (India)",
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
        secondary_language: "Malayalam (മലയാളം)",
        v_astra_language: "English (India)"
      };

      res.json(settings);
    } catch (error: any) {
      console.error("Error in GET /api/user/settings/language:", error);
      res.status(500).json({ error: error?.message || "Internal server error retrieving language preferences." });
    }
  });

  // API: Notion OAuth Token Exchange Handler
  app.post("/api/auth/notion/token", async (req, res) => {
    try {
      const { code, redirect_uri, custom_client_id, custom_client_secret } = req.body;
      if (!code) {
        res.status(400).json({ error: "Missing required 'code' parameter for Notion OAuth." });
        return;
      }

      const clientId = custom_client_id || process.env.VITE_NOTION_CLIENT_ID || process.env.NOTION_CLIENT_ID || "";
      const clientSecret = custom_client_secret || process.env.NOTION_CLIENT_SECRET || process.env.VITE_NOTION_CLIENT_SECRET || "";

      if (!clientId || !clientSecret) {
        console.warn("[Notion OAuth] Warning: Client ID or Client Secret missing. Attempting token exchange with provided credentials.");
      }

      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${authHeader}`,
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirect_uri || "https://v-astra-ai.ai.studio",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[Notion OAuth Exchange Error]:", data);
        res.status(response.status).json(data);
        return;
      }

      res.json(data);
    } catch (err: any) {
      console.error("Error in /api/auth/notion/token:", err);
      res.status(500).json({ error: err?.message || "Internal server error exchanging Notion token." });
    }
  });

  // API: Notion Search Proxy Endpoint
  app.post("/api/notion/search", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Missing Authorization header for Notion API." });
        return;
      }

      const { query, filter, sort, page_size } = req.body;

      const response = await fetch("https://api.notion.com/v1/search", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          query: query || "",
          sort: sort || { direction: "descending", timestamp: "last_edited_time" },
          ...(filter ? { filter } : {}),
          page_size: page_size || 10,
        }),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Error in /api/notion/search proxy:", err);
      res.status(500).json({ error: err?.message || "Internal server error in Notion search." });
    }
  });

  // API: Notion Pages Creation Proxy Endpoint
  app.post("/api/notion/pages", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Missing Authorization header for Notion API." });
        return;
      }

      const { parent, properties, children } = req.body;

      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent,
          properties,
          ...(children ? { children } : {}),
        }),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Error in /api/notion/pages proxy:", err);
      res.status(500).json({ error: err?.message || "Internal server error in Notion page creation." });
    }
  });

  // API: Notion Block Children Append Proxy Endpoint
  app.patch("/api/notion/blocks/:id/children", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Missing Authorization header for Notion API." });
        return;
      }

      const { id } = req.params;
      const { children } = req.body;

      const response = await fetch(`https://api.notion.com/v1/blocks/${id}/children`, {
        method: "PATCH",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({ children }),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Error in /api/notion/blocks children proxy:", err);
      res.status(500).json({ error: err?.message || "Internal server error appending Notion block children." });
    }
  });

  // API: Notion Page Update Proxy Endpoint
  app.patch("/api/notion/pages/:id", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: "Missing Authorization header for Notion API." });
        return;
      }

      const { id } = req.params;
      const { properties, archived } = req.body;

      const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({ properties, archived }),
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err: any) {
      console.error("Error in /api/notion/pages update proxy:", err);
      res.status(500).json({ error: err?.message || "Internal server error updating Notion page." });
    }
  });

  // API: Live Web Search Endpoint (Tavily API + Free Search Fallback Engine)
  app.post("/api/search", async (req, res) => {
    try {
      const { query, tavilyApiKey } = req.body;
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Search query string is required." });
        return;
      }

      const apiKey = tavilyApiKey || req.headers["x-tavily-key"] || process.env.TAVILY_API_KEY || process.env.VITE_TAVILY_API_KEY;

      if (apiKey) {
        try {
          console.log(`[Web Search API] Executing search via Tavily API for query: "${query}"`);
          const tavilyRes = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: apiKey,
              query: query,
              search_depth: "basic",
              include_answer: true,
              max_results: 6,
            }),
          });

          if (tavilyRes.ok) {
            const tavilyData = await tavilyRes.json();
            res.json({
              query,
              source: "tavily",
              answer: tavilyData.answer || null,
              results: (tavilyData.results || []).map((r: any) => ({
                title: r.title || "Web Result",
                url: r.url || "",
                content: r.content || r.snippet || "",
              })),
            });
            return;
          } else {
            const errJson = await tavilyRes.json().catch(() => ({}));
            console.warn("[Tavily API Notice]: Tavily error, switching to free web search fallback:", errJson);
          }
        } catch (tavilyErr) {
          console.warn("[Tavily API Warning]: Tavily request failed, switching to free web search fallback:", tavilyErr);
        }
      }

      // Free Search Engine Fallback
      console.log(`[Web Search API] Executing free search engine query for: "${query}"`);
      
      // 1. Fetch DuckDuckGo Instant Answer API
      const ddgApiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgApiUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
      }).catch(() => null);

      const searchResults: Array<{ title: string; url: string; content: string }> = [];
      let instantAnswer = "";

      if (ddgRes && ddgRes.ok) {
        const ddgData = await ddgRes.json().catch(() => ({}));
        if (ddgData.AbstractText) {
          instantAnswer = ddgData.AbstractText;
          searchResults.push({
            title: ddgData.Heading || query,
            url: ddgData.AbstractURL || "https://duckduckgo.com",
            content: ddgData.AbstractText,
          });
        }
        if (Array.isArray(ddgData.RelatedTopics)) {
          for (const topic of ddgData.RelatedTopics) {
            if (topic.Text && topic.FirstURL) {
              searchResults.push({
                title: topic.Text.slice(0, 60) + "...",
                url: topic.FirstURL,
                content: topic.Text,
              });
            }
          }
        }
      }

      // 2. Fetch DuckDuckGo HTML for broader results if needed
      if (searchResults.length < 3) {
        try {
          const htmlRes = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "en-US,en;q=0.9",
            },
          });
          if (htmlRes.ok) {
            const htmlText = await htmlRes.text();
            const resultBlocks = htmlText.split(/class="result\s+results_links/g).slice(1);
            for (const block of resultBlocks.slice(0, 5)) {
              const urlMatch = block.match(/href="([^"]+)"/);
              const titleMatch = block.match(/class="result__a"[^>]*>(.*?)<\/a>/s);
              const snippetMatch = block.match(/class="result__snippet"[^>]*>(.*?)<\/a>/s) || block.match(/class="result__snippet"[^>]*>(.*?)<\/td>/s);

              if (urlMatch && titleMatch) {
                let rawUrl = urlMatch[1];
                if (rawUrl.includes("uddg=")) {
                  const param = rawUrl.split("uddg=")[1]?.split("&")[0];
                  if (param) rawUrl = decodeURIComponent(param);
                }
                const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
                const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";

                if (title && rawUrl.startsWith("http")) {
                  searchResults.push({
                    title,
                    url: rawUrl,
                    content: snippet || title,
                  });
                }
              }
            }
          }
        } catch (htmlErr) {
          console.warn("HTML search parse warning:", htmlErr);
        }
      }

      res.json({
        query,
        source: "free_engine",
        answer: instantAnswer || null,
        results: searchResults.slice(0, 6),
      });
    } catch (err: any) {
      console.error("Error in /api/search:", err);
      res.status(500).json({ error: err?.message || "Failed to perform web search." });
    }
  });

  // API: YouTube Video Details Endpoint
  app.get("/api/youtube/video", async (req, res) => {
    try {
      const videoId = req.query.id as string;
      if (!videoId) {
        res.status(400).json({ error: "Missing required query parameter 'id'." });
        return;
      }

      const authHeader = req.headers.authorization;
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.GEMINI_API_KEY1 || process.env.GOOGLE_API_KEY;

      let ytUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${encodeURIComponent(videoId)}`;
      if (apiKey) {
        ytUrl += `&key=${apiKey}`;
      }

      const fetchHeaders: Record<string, string> = { Accept: "application/json" };
      if (authHeader) {
        fetchHeaders.Authorization = authHeader;
      }

      const ytRes = await fetch(ytUrl, { headers: fetchHeaders });
      const data = await ytRes.json();

      if (!ytRes.ok) {
        res.status(ytRes.status).json(data);
        return;
      }

      res.json(data);
    } catch (err: any) {
      console.error("Error in /api/youtube/video:", err);
      res.status(500).json({ error: err?.message || "Failed to fetch YouTube video details." });
    }
  });

  // API: YouTube Video Search Endpoint
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({ error: "Missing required query parameter 'q'." });
        return;
      }

      const authHeader = req.headers.authorization;
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.GEMINI_API_KEY1 || process.env.GOOGLE_API_KEY;

      let ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=5`;
      if (apiKey) {
        ytUrl += `&key=${apiKey}`;
      }

      const fetchHeaders: Record<string, string> = { Accept: "application/json" };
      if (authHeader) {
        fetchHeaders.Authorization = authHeader;
      }

      const ytRes = await fetch(ytUrl, { headers: fetchHeaders });
      const data = await ytRes.json();

      if (!ytRes.ok) {
        res.status(ytRes.status).json(data);
        return;
      }

      res.json(data);
    } catch (err: any) {
      console.error("Error in /api/youtube/search:", err);
      res.status(500).json({ error: err?.message || "Failed to search YouTube videos." });
    }
  });

  // API: Custom Webhook / REST API Execution Endpoint
  app.post("/api/custom-webhook", async (req, res) => {
    try {
      const { url, method = "GET", headers = {}, body, prompt } = req.body;
      if (!url || typeof url !== "string") {
        res.status(400).json({ error: "Missing required field 'url'." });
        return;
      }

      console.log(`[Server] Custom Webhook Request: ${method.toUpperCase()} ${url}`);

      const fetchHeaders: Record<string, string> = {
        "User-Agent": "V-Astra-AI-Companion/1.0",
        "Accept": "application/json, text/plain, */*",
        ...(typeof headers === "object" && headers !== null ? headers : {})
      };

      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: fetchHeaders,
      };

      if (method.toUpperCase() === "POST" && body !== undefined) {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
        if (!fetchHeaders["Content-Type"] && !fetchHeaders["content-type"]) {
          fetchHeaders["Content-Type"] = "application/json";
        }
      }

      const response = await fetch(url, fetchOptions);
      const contentType = response.headers.get("content-type") || "";
      let responseData: any;

      if (contentType.includes("application/json")) {
        responseData = await response.json().catch(() => null);
      } else {
        responseData = await response.text().catch(() => "");
      }

      if (!response.ok) {
        res.status(response.status).json({
          error: `HTTP ${response.status} ${response.statusText}`,
          status: response.status,
          data: responseData
        });
        return;
      }

      res.json({
        status: response.status,
        data: responseData
      });
    } catch (err: any) {
      console.error("Error in /api/custom-webhook:", err);
      res.status(500).json({ error: err?.message || "Failed to execute custom webhook request." });
    }
  });

  // API: Wolfram Alpha Query Proxy
  app.get("/api/wolfram", async (req, res) => {
    try {
      const query = (req.query.q as string) || "";
      if (!query.trim()) {
        res.status(400).json({ error: "Query parameter 'q' is required." });
        return;
      }
      const appId = process.env.VITE_WOLFRAM_APP_ID || process.env.WOLFRAM_APP_ID || "DEMO";
      const url = `https://api.wolframalpha.com/v1/result?appid=${encodeURIComponent(appId)}&i=${encodeURIComponent(query.trim())}`;

      const response = await fetch(url);
      const resultText = await response.text();

      if (!response.ok) {
        res.status(response.status).send(resultText || "Wolfram Alpha computation unavailable.");
        return;
      }

      res.send(resultText);
    } catch (err: any) {
      console.error("Error in /api/wolfram:", err);
      res.status(500).json({ error: err?.message || "Wolfram Alpha request failed." });
    }
  });

  // API: Chat proxy using @google/genai
  app.post("/api/chat", async (req, res) => {
    try {
      const {
        messages,
        systemInstruction,
        webSearchEnabled,
        primary_language,
        secondary_language,
        userName,
        aiMode,
        googleConnectors,
      } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid request. 'messages' array is required." });
        return;
      }

      // 1. Get the API Key from header or fallback to GEMINI_API_KEY1 env variable (BYOK logic)
      const clientApiKeyRaw = req.headers["x-gemini-key"] || req.headers["x-custom-api-key"] || req.headers["x-api-key"];
      const trimmedClientKey = (typeof clientApiKeyRaw === "string") ? clientApiKeyRaw.trim() : "";
      const isCustomKey = trimmedClientKey.length > 0;
      const apiKey = isCustomKey 
        ? trimmedClientKey 
        : process.env.GEMINI_API_KEY1;

      const keySource = isCustomKey ? "BYOK" : "Default";
      console.log(`[API Key Route] Using API Key source: ${keySource}`);

      if (!apiKey) {
        res.status(400).json({ 
          error: "API key is missing. Please enter your Gemini API key in the V-Astra AI settings box (found in the Settings page or sidebar) to start chatting.",
          keySource: "None",
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
      // GenAI format uses roles: "user" and "model". Supports multimodal image attachments.
      const contents: any[] = messages.map((msg: { role: string; content: string; image?: { mimeType: string; data: string } }) => {
        const role = msg.role === "assistant" ? "model" : "user";
        const parts: any[] = [{ text: msg.content || "" }];

        if (msg.image && msg.image.data) {
          let base64Data = msg.image.data;
          if (base64Data.includes("base64,")) {
            base64Data = base64Data.split("base64,")[1];
          }
          parts.push({
            inlineData: {
              mimeType: msg.image.mimeType || "image/jpeg",
              data: base64Data,
            }
          });
        }

        return {
          role,
          parts,
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
      // Order models prioritizing ultra-low latency & intelligence
      let modelCandidates = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];

      if (selectedMode === "thinking") {
        modeDirective = `\n\n[Mode: Thinking Activated]\n- You are operating in Advanced Reasoning, Coding, and Mathematical Thinking mode.\n- Focus on depth, extreme precision, and bulletproof logic. Write clear, detailed, and structured steps.\n- CRITICAL: You must explicitly walk through your reasoning step-by-step under a "### 💭 Analysis & Thought Process" header first, before presenting your clean, optimal final code/math answer.`;
        modelCandidates = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      } else if (selectedMode === "medium") {
        modeDirective = `\n\n[Mode: Medium Activated]\n- You are operating in Balanced All-Rounder Help mode.\n- Deliver beautifully detailed, well-rounded, and comprehensive explanations.\n- Frame complex topics elegantly and cover necessary sub-elements with high contextual nuance.`;
        modelCandidates = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];
      } else {
        // "standard"
        modeDirective = `\n\n[Mode: Standard Activated]\n- You are operating in Standard Companion mode (fast, direct, and conversational).\n- Focus on response speed, directness, and highly refined summaries.\n- Deliver the answers eloquently and directly, without unnecessary preamble.`;
        modelCandidates = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
      }

      // Short, concise response behavior directive by default
      const conciseDirective = `\n\n[CRITICAL CONCISE RESPONSE CONSTRAINT]\n- By default, you MUST give very short, concise, and direct answers based on the image or text query.\n- You should ONLY provide a long, detailed, or elaborate explanation if the user explicitly asks for a "long answer" (or "detailed answer") in their prompt.\n- Otherwise, answer instantly in a few direct sentences, bullet points, or simple clean phrases. No long preambles, no conversational filler.`;

      const languageDirectives = `\n\n[Voice/STT Engine & Multilingual Configuration]\n- Primary/Selected Language: ${primary}\n- Secondary Language: ${secondary}\n- SMART LANGUAGE DETECTION: Even if default/selected language is set, if the user starts speaking or typing in Malayalam, Spanish, French, Hindi, or any other language, you MUST automatically detect it, process the query under that language's context, and reply seamlessly in that SAME language. Deliver highly fluent responses in the script and accent corresponding to the detected language.`;

      // Google Workspace Status & Directives
      const gmailStatus = !!(googleConnectors?.gmail?.connected && googleConnectors?.gmail?.active !== false && googleConnectors?.gmail?.accessToken);
      const driveStatus = !!(googleConnectors?.google_drive?.connected && googleConnectors?.google_drive?.active !== false && googleConnectors?.google_drive?.accessToken);
      const docsStatus = !!(googleConnectors?.google_docs?.connected && googleConnectors?.google_docs?.active !== false && googleConnectors?.google_docs?.accessToken);
      const sheetsStatus = !!(googleConnectors?.google_sheets?.connected && googleConnectors?.google_sheets?.active !== false && googleConnectors?.google_sheets?.accessToken);

      const workspaceDirective = `\n\n[GOOGLE WORKSPACE LIVE TOOLS & DISPATCHER DIRECTIVE]
You are equipped with LIVE Function Calling tools for Google Workspace:
• list_unread_emails({ maxResults }): Fetches unread or recent messages from the user's connected Gmail inbox.
• search_emails({ query, maxResults }): Searches the user's Gmail messages using query keywords, sender, or subject.
• list_drive_files({ query, pageSize }): Lists or searches files and documents in Google Drive.
• read_doc_content({ fileId }): Fetches full text content of a Google Doc using its file ID or title.
• read_sheet_data({ fileId, range }): Fetches cell values and rows from a Google Sheet.

Active Service Status:
- Gmail: ${gmailStatus ? "CONNECTED & ACTIVE" : "NOT CONNECTED"}
- Google Drive: ${driveStatus ? "CONNECTED & ACTIVE" : "NOT CONNECTED"}
- Google Docs: ${docsStatus ? "CONNECTED & ACTIVE" : "NOT CONNECTED"}
- Google Sheets: ${sheetsStatus ? "CONNECTED & ACTIVE" : "NOT CONNECTED"}

CRITICAL RULES:
1. Whenever the user asks to check their emails, look up files on Google Drive, read a doc, or check spreadsheet rows, YOU MUST CALL the corresponding tool.
2. NEVER say "I don't have access to your personal files or Gmail". You have live tool integration.
3. If a service is NOT CONNECTED when the user requests it (or if a tool returns a NOT_CONNECTED status), answer gracefully: "Please connect your [Service Name] in Settings -> Connectors to allow me to access this."`;

      const config: any = {
        systemInstruction: (systemInstruction || "You are V-Astra AI, a highly smart, sophisticated, and polished AI companion. Keep answers clear, eloquent, and helpful.") + modeDirective + conciseDirective + languageDirectives + workspaceDirective,
      };

      // Set low thinking latency for non-thinking modes to eliminate latency overhead
      if (selectedMode !== "thinking") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      // Configure tools: Google Workspace functions + optional Google Search grounding
      const toolsConfig: any[] = [];
      if (webSearchEnabled === true) {
        toolsConfig.push({ googleSearch: {} });
      }
      toolsConfig.push({ functionDeclarations: googleWorkspaceToolDeclarations });
      config.tools = toolsConfig;

      if (webSearchEnabled === true) {
        config.toolConfig = { includeServerSideToolInvocations: true };
      }

      let response = null;
      let lastError: any = null;
      const refreshedTokens: Record<string, string> = {};

      // Robust check for error types (rate limits, quotas, transient service faults, and BYOK auth errors)
      function classifyError(err: any) {
        if (!err) return { isQuota: false, isTransient: false, isAuth: false };
        const status = err.status || err.statusCode || err.response?.status;
        const errStr = (
          (err.message || "") + " " + 
          (status || "") + " " + 
          (err.code || "") + " " + 
          (typeof err === "object" ? JSON.stringify(err) : String(err))
        ).toLowerCase();

        const isAuth = status === 401 || 
                       status === 403 || 
                       errStr.includes("api_key_invalid") || 
                       errStr.includes("api key not valid") || 
                       errStr.includes("api_key_expired") ||
                       (errStr.includes("invalid_argument") && errStr.includes("api key")) ||
                       errStr.includes("consumer_invalid") ||
                       errStr.includes("unauthenticated") ||
                       errStr.includes("permission_denied") ||
                       errStr.includes("permissiondenied");

        const isQuota = errStr.includes("429") || 
                        errStr.includes("quota") || 
                        errStr.includes("exhausted") || 
                        errStr.includes("resource_exhausted") ||
                        errStr.includes("rate");

        const isTransient = errStr.includes("503") || 
                            errStr.includes("500") ||
                            errStr.includes("temporary") || 
                            errStr.includes("unavailable") || 
                            errStr.includes("overloaded") ||
                            errStr.includes("high demand") ||
                            errStr.includes("busy") ||
                            errStr.includes("connect");

        return { isQuota, isTransient, isAuth };
      }

      // Attempt generation across model candidates with automated tool execution loop
      async function attemptGeneration(currentConfig: any) {
        for (const modelName of modelCandidates) {
          try {
            console.log(`[Gemini API] Generating with Model: '${modelName}' (Source: ${keySource})`);
            let currentContents = [...contents];
            let loopCount = 0;
            const maxLoops = 5;

            while (loopCount < maxLoops) {
              loopCount++;
              const resObj = await ai.models.generateContent({
                model: modelName,
                contents: currentContents,
                config: currentConfig,
              });

              const functionCalls = resObj.functionCalls;
              // If model did not request any function calls, check if text was returned
              if (!functionCalls || functionCalls.length === 0) {
                if (resObj && resObj.text) {
                  return resObj;
                }
                break;
              }

              console.log(`[Gemini Tool Execution Loop ${loopCount}] Tool calls requested:`, functionCalls.map((c: any) => c.name));

              // 1. Preserve model turn in contents
              const candidateContent = resObj.candidates?.[0]?.content;
              if (candidateContent) {
                currentContents.push(candidateContent);
              } else {
                currentContents.push({
                  role: "model",
                  parts: functionCalls.map((fc: any) => ({ functionCall: fc })),
                });
              }

              // 2. Execute each tool call against Google Workspace endpoints
              const responseParts: any[] = [];
              for (const call of functionCalls) {
                const { result, newAccessToken } = await executeGoogleWorkspaceTool(
                  call.name,
                  call.args,
                  googleConnectors
                );

                if (newAccessToken) {
                  refreshedTokens[newAccessToken.service] = newAccessToken.token;
                  if (googleConnectors && (googleConnectors as any)[newAccessToken.service]) {
                    (googleConnectors as any)[newAccessToken.service].accessToken = newAccessToken.token;
                  }
                }

                const respItem: any = {
                  name: call.name,
                  response: result,
                };
                if (call.id) {
                  respItem.id = call.id;
                }
                responseParts.push({ functionResponse: respItem });
              }

              // 3. Append tool results as user turn to provide context back to the model
              currentContents.push({
                role: "user",
                parts: responseParts,
              });

              // Loop continues: next iteration sends contents with tool results to Gemini!
            }
          } catch (err: any) {
            lastError = err;
            const errMsg = err?.message || String(err);
            console.warn(`[Gemini API Warning] Model '${modelName}' failed: ${errMsg}.`);
            const { isAuth } = classifyError(err);
            if (isCustomKey && isAuth) {
              console.error(`[Gemini API Auth Failure] Custom BYOK key failed authentication. Stopping model fallback.`);
              break;
            }
            continue;
          }
        }
        return null;
      }

      // Check if custom key failed authentication upfront
      const initialAuthCheck = classifyError(lastError);
      if (isCustomKey && initialAuthCheck.isAuth) {
        res.status(401).json({
          error: "Invalid custom API Key. Please verify your Gemini key.",
          code: "INVALID_CUSTOM_API_KEY",
          isCustomKeyError: true,
          keySource: "BYOK",
        });
        return;
      }

      // First run: attempt with requested config (including Google Workspace tools and Web Search)
      response = await attemptGeneration(config);

      // If custom key had an auth error during first run, return immediately
      if (!response && isCustomKey && classifyError(lastError).isAuth) {
        res.status(401).json({
          error: "Invalid custom API Key. Please verify your Gemini key.",
          code: "INVALID_CUSTOM_API_KEY",
          isCustomKeyError: true,
          keySource: "BYOK",
        });
        return;
      }

      // Second run: If failed and webSearch was enabled, try with Google Workspace tools without Web Search
      if (!response && webSearchEnabled === true) {
        console.warn("[Gemini API Fallback] Generation failed with web search enabled. Retrying with Google Workspace tools only...");
        const fallbackConfig = { ...config };
        fallbackConfig.tools = [{ functionDeclarations: googleWorkspaceToolDeclarations }];
        delete fallbackConfig.toolConfig;
        response = await attemptGeneration(fallbackConfig);
      }

      // If custom key had an auth error, return immediately
      if (!response && isCustomKey && classifyError(lastError).isAuth) {
        res.status(401).json({
          error: "Invalid custom API Key. Please verify your Gemini key.",
          code: "INVALID_CUSTOM_API_KEY",
          isCustomKeyError: true,
          keySource: "BYOK",
        });
        return;
      }

      // Third run: Standard generation without tools if tools configuration had unexpected error
      if (!response) {
        console.warn("[Gemini API Fallback] Generation failed with tools. Retrying standard generation...");
        const standardConfig = { ...config };
        delete standardConfig.tools;
        delete standardConfig.toolConfig;
        response = await attemptGeneration(standardConfig);
      }

      // Check if custom key failed authentication after third run
      if (!response && isCustomKey && classifyError(lastError).isAuth) {
        res.status(401).json({
          error: "Invalid custom API Key. Please verify your Gemini key.",
          code: "INVALID_CUSTOM_API_KEY",
          isCustomKeyError: true,
          keySource: "BYOK",
        });
        return;
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

      res.json({
        text: responseText,
        keySource: isCustomKey ? "BYOK" : "Default",
        refreshedTokens: Object.keys(refreshedTokens).length > 0 ? refreshedTokens : undefined,
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: error?.message || "An unexpected error occurred while communicating with the Gemini model." 
      });
    }
  });

  // API Error handler middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
      console.error("API Middleware Error:", err);
      if (err.type === "entity.too.large" || err.status === 413) {
        res.status(413).json({ error: "Uploaded payload is too large. Please select a smaller image or file." });
        return;
      }
      res.status(err.status || 500).json({ error: err.message || "An unexpected server error occurred." });
      return;
    }
    next();
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
