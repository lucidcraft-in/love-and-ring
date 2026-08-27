import Axios from "@/axios/axios";

export interface ActivityPayload {
  userId?: string | null;
  userEmail?: string;
  userPhone?: string;
  userFullName?: string;
  category?: "REGISTRATION" | "LOGIN" | "PROFILE" | "SYSTEM";
  action: string;
  step?: number | null;
  status?: "SUCCESS" | "ERROR" | "WARNING" | "INFO";
  errorMessage?: string;
  details?: Record<string, any>;
}

/**
 * Sends a non-blocking activity log to the backend server.
 * Errors during logging are caught internally to avoid breaking UI flows.
 */
export const trackUserActivity = (payload: ActivityPayload): void => {
  try {
    const dataToSend = {
      category: "REGISTRATION",
      status: "INFO",
      ...payload,
    };

    // Non-blocking async fire & forget
    Axios.post("/api/activity-logs", dataToSend).catch((err) => {
      console.warn("Activity log dispatch soft warning:", err?.message || err);
    });
  } catch (error) {
    console.warn("Error invoking trackUserActivity:", error);
  }
};
