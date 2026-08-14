import { Message } from "../types";

export interface GeneratePdfOptions {
  messages: Message[];
  title: string;
  userName: string;
}

/**
 * Detects whether the current environment is an Android WebView or In-App Browser (e.g. AppCreator24)
 */
export const isAndroidWebView = (): boolean => {
  if (typeof window === "undefined" || !navigator || !navigator.userAgent) {
    return false;
  }
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  
  // Specific Android WebView signals
  const isWebViewUA = /wv|WebView|AppCreator|Version\/[\d.]+/i.test(ua);
  const isCustomApp = /(FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger)/i.test(ua);
  const hasAndroidBridge = Boolean((window as any).Android || (window as any).AndroidBridge);

  return isAndroid && (isWebViewUA || isCustomApp || hasAndroidBridge);
};

/**
 * Helper to escape HTML characters safely
 */
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Format markdown text into clean HTML elements for printable document
 */
export const formatMarkdownToPrintHtml = (content: string): string => {
  if (!content) return "";

  // Extract code blocks first to protect them
  const codeBlocks: string[] = [];
  let text = content.replace(/```([\s\S]*?)```/g, (_match, code) => {
    const langMatch = code.match(/^(\w+)\n/);
    const lang = langMatch ? langMatch[1] : "";
    const cleanCode = langMatch ? code.replace(/^\w+\n/, "") : code;
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(
      `<div class="code-block-container">
        ${lang ? `<div class="code-lang">${escapeHtml(lang)}</div>` : ""}
        <pre class="code-block"><code>${escapeHtml(cleanCode.trim())}</code></pre>
      </div>`
    );
    return placeholder;
  });

  // Escape HTML in remaining text
  text = escapeHtml(text);

  // Format bold **text**
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Format italic *text*
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Format inline code `code`
  text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Process paragraphs and bullet lists
  const lines = text.split("\n");
  const processedLines: string[] = [];
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const item = trimmed.substring(2);
      if (!inList) {
        inList = true;
        processedLines.push(`<ul class="msg-list"><li>${item}</li>`);
      } else {
        processedLines.push(`<li>${item}</li>`);
      }
    } else if (trimmed.match(/^\d+\.\s+/)) {
      const item = trimmed.replace(/^\d+\.\s+/, "");
      if (!inList) {
        inList = true;
        processedLines.push(`<ol class="msg-list"><li>${item}</li>`);
      } else {
        processedLines.push(`<li>${item}</li>`);
      }
    } else {
      if (inList) {
        inList = false;
        processedLines.push(trimmed.startsWith("<ol") ? "</ol>" : "</ul>");
      }
      if (trimmed.startsWith("___CODE_BLOCK_")) {
        processedLines.push(trimmed);
      } else if (trimmed) {
        processedLines.push(`<p>${line}</p>`);
      }
    }
  });

  if (inList) {
    processedLines.push("</ul>");
  }

  let finalHtml = processedLines.join("\n");

  // Re-insert code blocks
  codeBlocks.forEach((block, index) => {
    finalHtml = finalHtml.replace(`___CODE_BLOCK_${index}___`, block);
  });

  return finalHtml;
};

/**
 * Generates a full, publication-quality printable HTML document
 */
export const generatePrintableHtml = (
  messages: Message[],
  title: string,
  userName: string
): string => {
  const exportDate = new Date().toLocaleString();
  const sessionTitle = escapeHtml(title || "V Astra AI Chat Session");
  const displayUser = escapeHtml(userName || "User");

  const messageItemsHtml = messages
    .map((msg) => {
      const isUser = msg.role === "user";
      const senderName = isUser ? displayUser : "V Astra AI";
      const timestamp = escapeHtml(msg.timestamp || "");
      const formattedBody = formatMarkdownToPrintHtml(msg.content);

      return `
      <div class="message-wrapper ${isUser ? "user" : "assistant"}">
        <div class="sender-label">
          <span class="sender-name">${senderName}</span>
          ${timestamp ? `<span class="timestamp">${timestamp}</span>` : ""}
        </div>
        <div class="bubble">
          ${formattedBody}
        </div>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>V Astra AI - ${sessionTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      padding: 16px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Modern Apple-like Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #6366f1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 800;
      font-size: 18px;
    }
    .brand-title {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: #ffffff;
    }
    .brand-sub {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
    }
    .header-meta {
      text-align: right;
      font-size: 11px;
      color: #cbd5e1;
    }
    .session-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      margin-top: 4px;
      font-weight: 600;
      color: #38bdf8;
    }

    /* Topic Bar */
    .topic-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 16px;
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    /* Chat Conversation Flow */
    .chat-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 88%;
      page-break-inside: avoid;
    }

    .message-wrapper.user {
      align-self: flex-end;
      align-items: flex-end;
      margin-left: auto;
    }

    .message-wrapper.assistant {
      align-self: flex-start;
      align-items: flex-start;
      margin-right: auto;
    }

    .sender-label {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .user .sender-label {
      color: #4f46e5;
    }

    .assistant .sender-label {
      color: #059669;
    }

    .timestamp {
      font-size: 10px;
      font-weight: 400;
      color: #94a3b8;
    }

    .bubble {
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 13px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .user .bubble {
      background: #4f46e5;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }

    .assistant .bubble {
      background: #f1f5f9;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
    }

    /* Content styling inside bubbles */
    .bubble p {
      margin-bottom: 6px;
    }
    .bubble p:last-child {
      margin-bottom: 0;
    }

    .code-block-container {
      margin: 8px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #334155;
    }

    .code-lang {
      background: #1e293b;
      color: #94a3b8;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 10px;
      text-transform: uppercase;
    }

    .code-block {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .user .code-block {
      background: #3730a3;
      color: #ffffff;
    }

    .inline-code {
      background: rgba(0, 0, 0, 0.08);
      padding: 2px 5px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }

    .user .inline-code {
      background: rgba(255, 255, 255, 0.22);
      color: #ffffff;
    }

    .msg-list {
      margin-left: 18px;
      margin-bottom: 6px;
    }
    .msg-list li {
      margin-bottom: 2px;
    }

    /* Publication Footer */
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #94a3b8;
    }

    @media print {
      body { padding: 0; }
      .message-wrapper { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-brand">
      <div class="logo-badge">V</div>
      <div>
        <div class="brand-title">V Astra AI</div>
        <div class="brand-sub">Intelligent Chat Session</div>
      </div>
    </div>
    <div class="header-meta">
      <div>Exported: ${exportDate}</div>
      <div class="session-badge">PDF Export</div>
    </div>
  </div>

  <div class="topic-card">
    Topic: ${sessionTitle} &nbsp;|&nbsp; User: ${displayUser}
  </div>

  <div class="chat-container">
    ${messageItemsHtml}
  </div>

  <div class="footer">
    <div>Generated by V Astra AI Web App</div>
    <div>Page 1</div>
  </div>
</body>
</html>`;
};

/**
 * 100% Crash-Proof Print / Save as PDF function for Android WebView (AppCreator24) and Desktop Browsers.
 * Uses a hidden offscreen iframe to invoke window.print() safely without heavy canvas libraries or file blobs.
 */
export const printChatDocument = (
  messages: Message[],
  title: string,
  userName: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const htmlContent = generatePrintableHtml(messages, title, userName);

      // Create a hidden offscreen iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.setAttribute("title", "V Astra AI Print Document");

      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;

      if (!frameDoc) {
        console.error("Iframe document not accessible for printing.");
        resolve(false);
        return;
      }

      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      // Give styles & elements a moment to settle, then call window.print
      setTimeout(() => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
          resolve(true);
        } catch (printErr) {
          console.error("Iframe print error:", printErr);
          resolve(false);
        } finally {
          // Clean up iframe after print dialog resolves
          setTimeout(() => {
            try {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            } catch {
              // Safe cleanup
            }
          }, 2000);
        }
      }, 300);
    } catch (err) {
      console.error("Failed to generate printable document:", err);
      resolve(false);
    }
  });
};

export const copyChatToClipboard = async (
  messages: Message[],
  title: string,
  userName: string
): Promise<boolean> => {
  if (!messages || messages.length === 0) return false;

  const header = `V ASTRA AI CHAT SESSION\nTopic: ${title || "Untitled Chat"}\nDate: ${new Date().toLocaleString()}\nUser: ${userName || "User"}\n${"=".repeat(50)}\n\n`;

  const body = messages
    .map((msg) => {
      const roleName = msg.role === "user" ? (userName || "User") : "V Astra AI";
      const timestamp = msg.timestamp ? ` [${msg.timestamp}]` : "";
      return `[${roleName}${timestamp}]\n${msg.content}\n`;
    })
    .join("\n" + "-".repeat(40) + "\n\n");

  const fullText = header + body + `\n\n${"=".repeat(50)}\nExported via V Astra AI Web App`;

  try {
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error("Failed to copy chat to clipboard:", err);
    return false;
  }
};

