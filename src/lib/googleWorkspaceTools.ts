// Google Workspace Tool Calling & REST API Execution Engine for V-Astra AI
// Supports Gmail, Google Drive, Google Docs, and Google Sheets

export interface GoogleConnectorData {
  connected?: boolean;
  active?: boolean;
  accessToken?: string;
  refreshToken?: string;
  userEmail?: string;
}

export interface GoogleConnectorsPayload {
  gmail?: GoogleConnectorData;
  google_drive?: GoogleConnectorData;
  google_docs?: GoogleConnectorData;
  google_sheets?: GoogleConnectorData;
  clientId?: string;
}

export interface ToolExecutionResult {
  result: any;
  newAccessToken?: {
    service: string;
    token: string;
  };
}

// 1. Tool Declarations for Gemini API Function Calling
export const googleWorkspaceToolDeclarations = [
  {
    name: "list_unread_emails",
    description: "Fetch the user's unread or most recent emails from their connected Gmail inbox, including sender, subject, date, and preview snippet.",
    parameters: {
      type: "OBJECT",
      properties: {
        maxResults: {
          type: "NUMBER",
          description: "Maximum number of emails to retrieve (default is 5, maximum is 15).",
        },
      },
    },
  },
  {
    name: "search_emails",
    description: "Search the user's Gmail inbox for specific messages or threads using search query terms, sender email, subject, or date keywords.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "Search query string, e.g. 'from:colleague', 'subject:meeting', 'invoice', 'flight', 'urgent'.",
        },
        maxResults: {
          type: "NUMBER",
          description: "Maximum number of search results to retrieve (default is 5).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list_drive_files",
    description: "List, browse, or search files and folders in the user's connected Google Drive, including file names, types, IDs, and modified dates.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "Optional search query to filter files by name, type, or Drive query syntax (e.g. 'budget', 'meeting notes', 'resume').",
        },
        pageSize: {
          type: "NUMBER",
          description: "Number of files to return (default is 10, max 25).",
        },
      },
    },
  },
  {
    name: "read_doc_content",
    description: "Read, extract, and return the full text content of a Google Doc from Google Docs API using its document file ID or title.",
    parameters: {
      type: "OBJECT",
      properties: {
        fileId: {
          type: "STRING",
          description: "The Google Drive file ID of the Google Doc to read. If ID is unknown, you can pass the document title or 'latest'.",
        },
      },
      required: ["fileId"],
    },
  },
  {
    name: "read_sheet_data",
    description: "Read and analyze rows, columns, and cell values from a Google Sheets spreadsheet using Google Sheets API.",
    parameters: {
      type: "OBJECT",
      properties: {
        fileId: {
          type: "STRING",
          description: "The Google Drive file ID of the Google Spreadsheet. If ID is unknown, you can pass the spreadsheet title or 'latest'.",
        },
        range: {
          type: "STRING",
          description: "The A1 notation range to read (e.g., 'Sheet1!A1:Z50' or default 'A1:Z50').",
        },
      },
      required: ["fileId"],
    },
  },
];

// Helper: Refresh access token if expired
async function refreshAccessToken(refreshToken: string, clientId?: string): Promise<string | null> {
  try {
    const cid = clientId || process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "101317789836-gnhrtmrq0p09u9rdk8sqqet25595ptvt.apps.googleusercontent.com";
    if (!cid || !refreshToken) return null;

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: cid,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    if (res.ok) {
      const data = await res.json();
      return data.access_token || null;
    }
  } catch (err) {
    console.warn("[Google OAuth] Token refresh attempt failed:", err);
  }
  return null;
}

// Helper: Make authenticated Google API request with automatic 401 refresh
async function fetchWithGoogleAuth(
  url: string,
  token: string,
  connector?: GoogleConnectorData,
  clientId?: string
): Promise<{ response: Response; newAccessToken?: string }> {
  let activeToken = token;
  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${activeToken}`,
      Accept: "application/json",
    },
  });

  // Handle 401 expired token
  if (res.status === 401 && connector?.refreshToken) {
    console.log("[Google OAuth] Token expired (HTTP 401). Attempting refresh flow...");
    const refreshed = await refreshAccessToken(connector.refreshToken, clientId);
    if (refreshed) {
      activeToken = refreshed;
      res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          Accept: "application/json",
        },
      });
      return { response: res, newAccessToken: refreshed };
    }
  }

  return { response: res };
}

// Human-friendly MIME type translator
function formatMimeType(mime?: string): string {
  if (!mime) return "File";
  if (mime.includes("document")) return "Google Doc";
  if (mime.includes("spreadsheet")) return "Google Sheet";
  if (mime.includes("presentation")) return "Google Slides";
  if (mime.includes("folder")) return "Folder";
  if (mime.includes("pdf")) return "PDF Document";
  if (mime.includes("image")) return "Image";
  return mime.split("/").pop() || "File";
}

// 2. Dispatcher Implementation
export async function executeGoogleWorkspaceTool(
  toolName: string,
  args: any,
  connectors?: GoogleConnectorsPayload
): Promise<ToolExecutionResult> {
  const clientId = connectors?.clientId;

  // --- TOOL: list_unread_emails ---
  if (toolName === "list_unread_emails") {
    const gmailConn = connectors?.gmail;
    if (!gmailConn || !gmailConn.connected || gmailConn.active === false || !gmailConn.accessToken) {
      return {
        result: {
          status: "NOT_CONNECTED",
          service: "Gmail",
          message: "Please connect your Gmail in Settings -> Connectors to allow me to access this.",
        },
      };
    }

    const maxResults = Math.min(Math.max(Number(args?.maxResults) || 5, 1), 15);
    try {
      // First try unread emails
      let listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=${maxResults}`;
      let { response: listRes, newAccessToken } = await fetchWithGoogleAuth(
        listUrl,
        gmailConn.accessToken,
        gmailConn,
        clientId
      );

      if (listRes.status === 401) {
        return {
          result: {
            status: "AUTH_EXPIRED",
            service: "Gmail",
            message: "Gmail authorization has expired (HTTP 401). Please reconnect Gmail in Settings -> Connectors to refresh your token.",
          },
        };
      }

      let listData = await listRes.json();
      let messagesList: Array<{ id: string }> = listData.messages || [];
      let isUnread = true;

      // If no unread, fallback to recent messages
      if (messagesList.length === 0) {
        isUnread = false;
        const fallbackUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
        const fallbackRes = await fetchWithGoogleAuth(fallbackUrl, gmailConn.accessToken, gmailConn, clientId);
        if (fallbackRes.response.ok) {
          listData = await fallbackRes.response.json();
          messagesList = listData.messages || [];
        }
      }

      const activeToken = newAccessToken || gmailConn.accessToken;
      const emailDetails: any[] = [];

      for (const item of messagesList.slice(0, maxResults)) {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`, {
            headers: { Authorization: `Bearer ${activeToken}` },
          });
          if (detailRes.ok) {
            const msg = await detailRes.json();
            const headers: Array<{ name: string; value: string }> = msg.payload?.headers || [];
            const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
            const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
            const date = headers.find((h) => h.name.toLowerCase() === "date")?.value || "";
            const labels = msg.labelIds || [];

            emailDetails.push({
              id: msg.id,
              from,
              subject,
              date,
              snippet: msg.snippet || "",
              unread: labels.includes("UNREAD"),
            });
          }
        } catch {
          // ignore single item errors
        }
      }

      return {
        result: {
          status: "SUCCESS",
          isUnreadList: isUnread,
          count: emailDetails.length,
          emails: emailDetails,
        },
        newAccessToken: newAccessToken ? { service: "gmail", token: newAccessToken } : undefined,
      };
    } catch (err: any) {
      return {
        result: {
          status: "ERROR",
          service: "Gmail",
          message: err?.message || "Failed to query Gmail inbox.",
        },
      };
    }
  }

  // --- TOOL: search_emails ---
  if (toolName === "search_emails") {
    const gmailConn = connectors?.gmail;
    if (!gmailConn || !gmailConn.connected || gmailConn.active === false || !gmailConn.accessToken) {
      return {
        result: {
          status: "NOT_CONNECTED",
          service: "Gmail",
          message: "Please connect your Gmail in Settings -> Connectors to allow me to access this.",
        },
      };
    }

    const query = args?.query || "";
    const maxResults = Math.min(Math.max(Number(args?.maxResults) || 5, 1), 15);

    try {
      const searchUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
      const { response: searchRes, newAccessToken } = await fetchWithGoogleAuth(
        searchUrl,
        gmailConn.accessToken,
        gmailConn,
        clientId
      );

      if (searchRes.status === 401) {
        return {
          result: {
            status: "AUTH_EXPIRED",
            service: "Gmail",
            message: "Gmail authorization has expired (HTTP 401). Please reconnect Gmail in Settings -> Connectors to refresh your token.",
          },
        };
      }

      const listData = await searchRes.json();
      const messagesList: Array<{ id: string }> = listData.messages || [];
      const activeToken = newAccessToken || gmailConn.accessToken;
      const emailDetails: any[] = [];

      for (const item of messagesList.slice(0, maxResults)) {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`, {
            headers: { Authorization: `Bearer ${activeToken}` },
          });
          if (detailRes.ok) {
            const msg = await detailRes.json();
            const headers: Array<{ name: string; value: string }> = msg.payload?.headers || [];
            const subject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "(No Subject)";
            const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
            const date = headers.find((h) => h.name.toLowerCase() === "date")?.value || "";

            emailDetails.push({
              id: msg.id,
              from,
              subject,
              date,
              snippet: msg.snippet || "",
            });
          }
        } catch {
          // ignore single item errors
        }
      }

      return {
        result: {
          status: "SUCCESS",
          query,
          count: emailDetails.length,
          emails: emailDetails,
        },
        newAccessToken: newAccessToken ? { service: "gmail", token: newAccessToken } : undefined,
      };
    } catch (err: any) {
      return {
        result: {
          status: "ERROR",
          service: "Gmail",
          message: err?.message || "Failed to search Gmail messages.",
        },
      };
    }
  }

  // --- TOOL: list_drive_files ---
  if (toolName === "list_drive_files") {
    // Check Drive, Docs, or Sheets token
    const driveConn = connectors?.google_drive;
    const docsConn = connectors?.google_docs;
    const sheetsConn = connectors?.google_sheets;
    const token = driveConn?.accessToken || docsConn?.accessToken || sheetsConn?.accessToken;
    const isConnected =
      (driveConn?.connected && driveConn?.active !== false) ||
      (docsConn?.connected && docsConn?.active !== false) ||
      (sheetsConn?.connected && sheetsConn?.active !== false);

    if (!isConnected || !token) {
      return {
        result: {
          status: "NOT_CONNECTED",
          service: "Google Drive",
          message: "Please connect your Google Drive in Settings -> Connectors to allow me to access this.",
        },
      };
    }

    const pageSize = Math.min(Math.max(Number(args?.pageSize) || 10, 1), 25);
    const rawQuery = (args?.query || "").trim();

    try {
      let q = "trashed=false";
      if (rawQuery) {
        const escaped = rawQuery.replace(/'/g, "\\'");
        q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
      }

      const driveUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&pageSize=${pageSize}&orderBy=recency+desc&fields=files(id,name,mimeType,modifiedTime,webViewLink,size)`;
      const { response: driveRes, newAccessToken } = await fetchWithGoogleAuth(
        driveUrl,
        token,
        driveConn || docsConn || sheetsConn,
        clientId
      );

      if (driveRes.status === 401) {
        return {
          result: {
            status: "AUTH_EXPIRED",
            service: "Google Drive",
            message: "Google Drive authorization has expired (HTTP 401). Please reconnect Google Drive in Settings -> Connectors.",
          },
        };
      }

      let driveData = await driveRes.json();
      // If query with fullText failed, fallback to name only or simple trashed=false
      if (!driveRes.ok && rawQuery) {
        const fallbackUrl = `https://www.googleapis.com/drive/v3/files?q=trashed%3Dfalse&pageSize=${pageSize}&orderBy=recency+desc&fields=files(id,name,mimeType,modifiedTime,webViewLink,size)`;
        const fallbackRes = await fetchWithGoogleAuth(fallbackUrl, token, driveConn, clientId);
        if (fallbackRes.response.ok) {
          driveData = await fallbackRes.response.json();
        }
      }

      const files = (driveData.files || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        type: formatMimeType(f.mimeType),
        mimeType: f.mimeType,
        modifiedTime: f.modifiedTime,
        link: f.webViewLink,
      }));

      return {
        result: {
          status: "SUCCESS",
          count: files.length,
          files,
        },
        newAccessToken: newAccessToken ? { service: "google_drive", token: newAccessToken } : undefined,
      };
    } catch (err: any) {
      return {
        result: {
          status: "ERROR",
          service: "Google Drive",
          message: err?.message || "Failed to list Google Drive files.",
        },
      };
    }
  }

  // --- TOOL: read_doc_content ---
  if (toolName === "read_doc_content") {
    const docsConn = connectors?.google_docs;
    const driveConn = connectors?.google_drive;
    const token = docsConn?.accessToken || driveConn?.accessToken;
    const isConnected =
      (docsConn?.connected && docsConn?.active !== false) ||
      (driveConn?.connected && driveConn?.active !== false);

    if (!isConnected || !token) {
      return {
        result: {
          status: "NOT_CONNECTED",
          service: "Google Docs",
          message: "Please connect your Google Docs or Google Drive in Settings -> Connectors to allow me to access this.",
        },
      };
    }

    let fileId = (args?.fileId || "").trim();

    try {
      // If fileId is "latest" or looks like a title rather than a document ID
      if (!fileId || fileId.toLowerCase() === "latest" || fileId.includes(" ")) {
        const searchQ = fileId && fileId.toLowerCase() !== "latest"
          ? `mimeType='application/vnd.google-apps.document' and trashed=false and name contains '${fileId.replace(/'/g, "\\'")}'`
          : `mimeType='application/vnd.google-apps.document' and trashed=false`;

        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQ)}&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)`;
        const { response: searchRes } = await fetchWithGoogleAuth(searchUrl, token, docsConn || driveConn, clientId);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            fileId = searchData.files[0].id;
          }
        }
      }

      if (!fileId) {
        return {
          result: {
            status: "ERROR",
            service: "Google Docs",
            message: "No matching Google Doc found. Please specify a document name or ID.",
          },
        };
      }

      const docUrl = `https://docs.googleapis.com/v1/documents/${fileId}`;
      const { response: docRes, newAccessToken } = await fetchWithGoogleAuth(
        docUrl,
        token,
        docsConn || driveConn,
        clientId
      );

      if (docRes.status === 401) {
        return {
          result: {
            status: "AUTH_EXPIRED",
            service: "Google Docs",
            message: "Google Docs authorization has expired (HTTP 401). Please reconnect Google Docs in Settings -> Connectors.",
          },
        };
      }

      if (!docRes.ok) {
        return {
          result: {
            status: "ERROR",
            service: "Google Docs",
            message: `Failed to fetch document (HTTP ${docRes.status}). Please check document permissions and ID.`,
          },
        };
      }

      const docData = await docRes.json();
      let fullText = "";

      // Extract text content from structural elements
      if (docData.body && docData.body.content) {
        for (const item of docData.body.content) {
          if (item.paragraph && item.paragraph.elements) {
            for (const el of item.paragraph.elements) {
              if (el.textRun && el.textRun.content) {
                fullText += el.textRun.content;
              }
            }
          } else if (item.table && item.table.tableRows) {
            for (const row of item.table.tableRows) {
              if (row.tableCells) {
                for (const cell of row.tableCells) {
                  if (cell.content) {
                    for (const cItem of cell.content) {
                      if (cItem.paragraph && cItem.paragraph.elements) {
                        for (const el of cItem.paragraph.elements) {
                          if (el.textRun && el.textRun.content) {
                            fullText += el.textRun.content + " ";
                          }
                        }
                      }
                    }
                  }
                }
                fullText += "\n";
              }
            }
          }
        }
      }

      return {
        result: {
          status: "SUCCESS",
          title: docData.title || "Untitled Document",
          fileId,
          content: fullText.trim().slice(0, 10000),
          length: fullText.length,
        },
        newAccessToken: newAccessToken ? { service: "google_docs", token: newAccessToken } : undefined,
      };
    } catch (err: any) {
      return {
        result: {
          status: "ERROR",
          service: "Google Docs",
          message: err?.message || "Failed to read Google Doc content.",
        },
      };
    }
  }

  // --- TOOL: read_sheet_data ---
  if (toolName === "read_sheet_data") {
    const sheetsConn = connectors?.google_sheets;
    const driveConn = connectors?.google_drive;
    const token = sheetsConn?.accessToken || driveConn?.accessToken;
    const isConnected =
      (sheetsConn?.connected && sheetsConn?.active !== false) ||
      (driveConn?.connected && driveConn?.active !== false);

    if (!isConnected || !token) {
      return {
        result: {
          status: "NOT_CONNECTED",
          service: "Google Sheets",
          message: "Please connect your Google Sheets or Google Drive in Settings -> Connectors to allow me to access this.",
        },
      };
    }

    let fileId = (args?.fileId || "").trim();
    const range = (args?.range || "A1:Z50").trim();

    try {
      // If fileId is "latest" or looks like a title
      if (!fileId || fileId.toLowerCase() === "latest" || fileId.includes(" ")) {
        const searchQ = fileId && fileId.toLowerCase() !== "latest"
          ? `mimeType='application/vnd.google-apps.spreadsheet' and trashed=false and name contains '${fileId.replace(/'/g, "\\'")}'`
          : `mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQ)}&pageSize=5&orderBy=recency+desc&fields=files(id,name,modifiedTime)`;
        const { response: searchRes } = await fetchWithGoogleAuth(searchUrl, token, sheetsConn || driveConn, clientId);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.files && searchData.files.length > 0) {
            fileId = searchData.files[0].id;
          }
        }
      }

      if (!fileId) {
        return {
          result: {
            status: "ERROR",
            service: "Google Sheets",
            message: "No matching Google Spreadsheet found. Please specify a spreadsheet name or ID.",
          },
        };
      }

      const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}`;
      const { response: sheetRes, newAccessToken } = await fetchWithGoogleAuth(
        sheetUrl,
        token,
        sheetsConn || driveConn,
        clientId
      );

      if (sheetRes.status === 401) {
        return {
          result: {
            status: "AUTH_EXPIRED",
            service: "Google Sheets",
            message: "Google Sheets authorization has expired (HTTP 401). Please reconnect Google Sheets in Settings -> Connectors.",
          },
        };
      }

      if (!sheetRes.ok) {
        return {
          result: {
            status: "ERROR",
            service: "Google Sheets",
            message: `Failed to fetch spreadsheet data (HTTP ${sheetRes.status}). Please check sheet permissions and range.`,
          },
        };
      }

      const sheetData = await sheetRes.json();
      const rows = sheetData.values || [];

      return {
        result: {
          status: "SUCCESS",
          fileId,
          range: sheetData.range || range,
          rowCount: rows.length,
          rows: rows.slice(0, 50), // Send up to 50 rows
        },
        newAccessToken: newAccessToken ? { service: "google_sheets", token: newAccessToken } : undefined,
      };
    } catch (err: any) {
      return {
        result: {
          status: "ERROR",
          service: "Google Sheets",
          message: err?.message || "Failed to read Google Sheet data.",
        },
      };
    }
  }

  return {
    result: {
      status: "UNKNOWN_TOOL",
      message: `Tool '${toolName}' is not recognized.`,
    },
  };
}
