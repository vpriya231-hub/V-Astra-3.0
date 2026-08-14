/**
 * Utility functions for submitting user feedback to Google Apps Script Webhook.
 */

export interface FeedbackPayload {
  status: "Liked" | "Disliked";
  message: string;
  timestamp: string;
}

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzpaMK-teZgWEUct6ZPDSymxI-efkVN1Fl1pVw-VFeB3vtAgOqrVi1GUVk4oSbG5jYGrA/exec";

/**
 * Sends a POST request with feedback payload to the designated Webhook URL.
 */
export async function sendFeedbackToWebhook(payload: FeedbackPayload): Promise<boolean> {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        status: payload.status,
        message: payload.message,
        timestamp: payload.timestamp,
      }),
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    console.error("Error submitting feedback to webhook:", error);
    return false;
  }
}
