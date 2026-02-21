import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
              <p className="text-sm text-muted-foreground mt-2">
                Before creating your account, please review how we collect and use your information.
              </p>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="h-[50vh] max-h-[400px] px-6 py-4">
              <div className="space-y-6 pr-4">
                <section>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Information We Collect
                  </h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                    {[
                      "Full Name", "Email Address", "Phone Number", "Date of Birth",
                      "Gender", "Location", "Profile Photos", "Preferences and profile details",
                      "Messages within platform", "Device & browser information", "IP address",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    How We Use Your Data
                  </h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                    {[
                      "To create and manage your account",
                      "To match you with compatible profiles",
                      "To improve recommendations",
                      "For fraud prevention and safety",
                      "For customer support",
                      "To comply with legal obligations",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Your Rights
                  </h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                    {[
                      "Access your data",
                      "Request correction",
                      "Request deletion",
                      "Withdraw consent",
                      "Restrict processing",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-border/50 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(val) => setChecked(val === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-snug">
                  I have read and agree to the{" "}
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
