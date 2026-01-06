import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, X, Shield, FileText } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { useEffect } from "react";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const ClientTerms = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload hero images
  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-rotate background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    if (isAgreed) {
      navigate("/client-registration");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Carousel Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide]}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg">
            {/* Brand */}
            <Link to="/" className="inline-block mb-10">
              <span className="text-2xl font-bold">
                Love<span className="text-primary">&</span>Ring
              </span>
            </Link>

            {/* Heading */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Partner With Us
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Terms & Conditions
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Please review our terms and conditions carefully before proceeding 
              with your client registration. Your partnership is built on mutual 
              trust and responsibility.
            </p>

            {/* Info Cards */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Trust & Integrity</h3>
                  <p className="text-white/60 text-xs">We uphold the highest standards of ethical practice</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Clear Guidelines</h3>
                  <p className="text-white/60 text-xs">Transparent policies for all partners</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Terms Card */}
        <div className="flex-1 lg:w-[55%] flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-xl"
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold text-white">
                  Love<span className="text-primary">&</span>Ring
                </span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                Terms & <span className="text-primary">Conditions</span>
              </h1>
            </div>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Terms Card */}
            <Card className="relative mt-10 p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Client Partnership Terms & Conditions
              </h2>

              {/* Scrollable Terms Content */}
              <div className="h-[300px] sm:h-[350px] overflow-y-auto pr-2 mb-6 space-y-4 text-sm text-muted-foreground border border-border/50 rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold text-foreground">1. Introduction</h3>
                <p>
                  These Terms and Conditions govern your registration and participation as a 
                  Matchmaking Partner ("Partner") with Love & Ring ("Platform"). By agreeing 
                  to these terms, you acknowledge and accept all responsibilities and obligations 
                  outlined herein.
                </p>

                <h3 className="font-semibold text-foreground">2. Partner Responsibilities</h3>
                <p>
                  As a Partner, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide accurate and truthful information about potential matches</li>
                  <li>Maintain confidentiality of all client information</li>
                  <li>Act with integrity and professionalism at all times</li>
                  <li>Not engage in any fraudulent or misleading practices</li>
                  <li>Respect the cultural and religious values of all clients</li>
                </ul>

                <h3 className="font-semibold text-foreground">3. Ethical Standards</h3>
                <p>
                  Partners must adhere to the highest ethical standards. Any form of 
                  discrimination, harassment, or unethical behavior will result in 
                  immediate termination of partnership.
                </p>

                <h3 className="font-semibold text-foreground">4. Confidentiality</h3>
                <p>
                  All client information, including personal details, preferences, and 
                  contact information, must be kept strictly confidential. Partners must 
                  not share or sell client data to third parties under any circumstances.
                </p>

                <h3 className="font-semibold text-foreground">5. Service Standards</h3>
                <p>
                  Partners are expected to maintain professional service standards, 
                  respond to inquiries promptly, and facilitate meaningful connections 
                  between families and individuals seeking marriage alliances.
                </p>

                <h3 className="font-semibold text-foreground">6. Termination</h3>
                <p>
                  Love & Ring reserves the right to terminate any partnership that 
                  violates these terms or engages in conduct deemed harmful to the 
                  platform's reputation or clients.
                </p>

                <h3 className="font-semibold text-foreground">7. Liability</h3>
                <p>
                  Partners assume full responsibility for their interactions with clients. 
                  Love & Ring is not liable for any disputes or issues arising from 
                  partner-client relationships.
                </p>

                <h3 className="font-semibold text-foreground">8. Amendments</h3>
                <p>
                  These terms may be updated periodically. Partners will be notified of 
                  any significant changes and continued use of the platform constitutes 
                  acceptance of the updated terms.
                </p>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Checkbox
                  id="agree"
                  checked={isAgreed}
                  onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-foreground cursor-pointer leading-relaxed"
                >
                  I have read and agree to the Terms & Conditions for Client Partnership
                </label>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!isAgreed}
                className={`w-full gap-2 rounded-lg h-11 text-sm ${
                  isAgreed
                    ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                Continue to Registration
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-4 text-xs text-white/60">
              <p>
                Questions about our partnership terms?{" "}
                <Link to="/support?from=client-terms" className="text-primary hover:underline">
                  Get help
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientTerms;
