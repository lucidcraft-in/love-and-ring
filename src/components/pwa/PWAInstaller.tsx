import React, { useEffect, useState } from "react";
import { Download, Smartphone, X, WifiOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed)
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success("Love & Ring app installed successfully! 🎉");
    };

    const handleOffline = () => {
      toast.warning("You are offline. Cached pages will continue to work.", {
        icon: <WifiOff className="w-4 h-4 text-amber-500" />,
        duration: 4000,
      });
    };

    const handleOnline = () => {
      toast.success("Back online! Reconnected to Love & Ring.", {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        duration: 3000,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("PWA install error:", err);
    }
  };

  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-card border border-rose-200 dark:border-rose-900/50 shadow-2xl rounded-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shrink-0">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Install Love & Ring App</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get fast access, push updates & offline matching!
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md font-semibold text-xs h-9 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Install App Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="text-xs h-9 px-3"
        >
          Later
        </Button>
      </div>
    </div>
  );
};
