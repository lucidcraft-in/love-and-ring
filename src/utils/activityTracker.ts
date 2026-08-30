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

const PENDING_LOGS_KEY = "pending_activity_logs";

const getPendingLogs = (): ActivityPayload[] => {
  try {
    const raw = localStorage.getItem(PENDING_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const savePendingLogs = (logs: ActivityPayload[]) => {
  try {
    localStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(logs.slice(-20))); // Keep last 20
  } catch (err) {
    console.warn("Failed to save pending activity logs:", err);
  }
};

export const flushPendingActivityLogs = async (): Promise<void> => {
  if (typeof window === "undefined" || !navigator.onLine) return;
  const pending = getPendingLogs();
  if (!pending.length) return;

  localStorage.removeItem(PENDING_LOGS_KEY);
  for (const item of pending) {
    try {
      await Axios.post("/api/activity-logs", item);
    } catch (err) {
      console.warn("Failed to flush queued activity log:", err);
    }
  }
};

/**
 * Sends a non-blocking activity log to the backend server.
 * If offline or request fails, queues log in localStorage for retry when reconnected.
 */
export const trackUserActivity = (payload: ActivityPayload): void => {
  try {
    const dataToSend: ActivityPayload = {
      category: "REGISTRATION",
      status: "INFO",
      ...payload,
    };

    if (typeof window !== "undefined" && !navigator.onLine) {
      const pending = getPendingLogs();
      pending.push(dataToSend);
      savePendingLogs(pending);
      return;
    }

    // Non-blocking async fire & forget
    Axios.post("/api/activity-logs", dataToSend).catch((err) => {
      console.warn("Activity log dispatch soft warning:", err?.message || err);
      const pending = getPendingLogs();
      pending.push(dataToSend);
      savePendingLogs(pending);
    });
  } catch (error) {
    console.warn("Error invoking trackUserActivity:", error);
  }
};

// Listen for network reconnect to flush queued activity logs automatically
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushPendingActivityLogs();
  });
}

