import DynamicStaticPage from "./DynamicStaticPage";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FallbackPrivacyContent = () => {
  const [policyType, setPolicyType] = useState("privacy");

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Button
          onClick={() => setPolicyType(policyType === "privacy" ? "cookie" : "privacy")}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          {policyType === "privacy" ? "Switch to Cookie Policy" : "Switch to Privacy Policy"}
        </Button>
      </div>

      {policyType === "privacy" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Our Commitment to Your Privacy</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            This is the privacy policy established for <span className="font-semibold text-foreground">Love & Ring Ltd</span>. We are strongly committed to keeping your personal data safe throughout the lifecycle of your profile and membership.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Cookie Policy</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            We use cookies to deliver essential services, personalize user experience, and analyze site performance.
          </p>
        </div>
      )}
    </div>
  );
};

export default function PrivacyDetails() {
  return (
    <DynamicStaticPage
      forcedSlug="privacy-details"
      fallbackTitle="Privacy Policy & Data Usage"
      fallbackContent={<FallbackPrivacyContent />}
    />
  );
}
