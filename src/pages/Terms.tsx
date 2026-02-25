import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. Acceptance of Terms",
    paragraph:
      "By accessing or using Love & Ring, you agree to be legally bound by these Terms of Use. If you do not agree with any part of these terms, you must not use our services. Love & Ring provides matchmaking services intended for individuals seeking meaningful and serious relationships.",
    items: [],
  },
  {
    title: "2. Eligibility",
    paragraph:
      "You must meet the following requirements to use our platform. We reserve the right to suspend or terminate accounts that violate these terms.",
    items: [
      "Be at least 18 years old",
      "Provide accurate and truthful information",
      "Use the platform for lawful purposes only",
    ],
  },
  {
    title: "3. User Responsibilities",
    paragraph:
      "As a registered user, you agree to the following. You are solely responsible for interactions with other users.",
    items: [
      "Maintain confidentiality of your login credentials",
      "Not impersonate another person",
      "Not upload false, misleading, or inappropriate content",
      "Respect other members",
    ],
  },
  {
    title: "4. Account Suspension & Termination",
    paragraph:
      "We reserve the right to take the following actions, especially in cases involving fraud, harassment, or misuse.",
    items: [
      "Remove content",
      "Suspend accounts",
      "Permanently ban users",
      "Take legal action if necessary",
    ],
  },
  {
    title: "5. Privacy",
    paragraph:
      "Your use of this platform is also governed by our Privacy Policy. We collect and use data as described in our Privacy Policy.",
    items: [],
  },
  {
    title: "6. Intellectual Property",
    paragraph:
      "All content, branding, logos, design, and platform features are the property of Love & Ring. You may not copy, distribute, or reproduce content without permission.",
    items: [],
  },
  {
    title: "7. Limitation of Liability",
    paragraph:
      "Love & Ring is not responsible for the following. Use the platform at your own discretion.",
    items: [
      "User-generated content",
      "Offline interactions",
      "Damages resulting from misuse of the platform",
    ],
  },
  {
    title: "8. Changes to Terms",
    paragraph:
      "We may update these terms at any time. Users will be notified of significant changes. Continued use of the platform means acceptance of updated terms.",
    items: [],
  },
];

const Terms = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <FloatingBrandLogo />

        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Terms of{" "}
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Use
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto px-4 py-12 md:py-16" style={{ maxWidth: "900px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-12"
        >
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                {section.title}
              </h2>
              <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
                {section.paragraph}
              </p>
              {section.items.length > 0 && (
                <ul className="space-y-2.5 text-foreground/70 text-[15px] leading-[1.7]">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              9. Contact Information
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions regarding these Terms of Use, please contact:
            </p>
            <p className="text-[15px]">
              <a href="mailto:support@loveandring.com" className="text-primary font-medium hover:underline">
                support@loveandring.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
