import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface PrivacyConsentModalProps {
  open: boolean;
  onAgree: (timestamp: Date) => void;
  onDecline: () => void;
}

const PrivacyConsentModal = ({ open, onAgree, onDecline }: PrivacyConsentModalProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[650px] bg-card rounded-2xl lg:rounded-3xl shadow-2xl border border-border/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Privacy & Data Usage Consent</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                By registering on this platform, you acknowledge that we collect and process your personal information to create your account, provide matchmaking services, improve user experience, and ensure platform security.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is handled securely and in accordance with applicable privacy laws. You may access, update, or request deletion of your data at any time.
              </p>
              <Link
                to="/privacy-details"
                className="inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View Full Privacy Details →
              </Link>
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-border/50 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(val) => setChecked(val === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-snug">
                  I agree to the{" "}
                  <span className="text-primary font-medium">Privacy Policy</span> and{" "}
                  <span className="text-primary font-medium">Terms of Service</span>.
                </span>
              </label>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onDecline}
                  className="flex-1 h-10 rounded-lg text-sm"
                >
                  Decline
                </Button>
                <Button
                  disabled={!checked}
                  onClick={() => onAgree(new Date())}
                  className={`flex-1 h-10 rounded-lg text-sm ${
                    checked
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  I Agree & Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyConsentModal;
