import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. Information We Collect",
    paragraph:
      "We collect certain personal information necessary to create and maintain your account, provide matchmaking services, enhance user experience, and ensure the safety and integrity of our platform. This information may be provided directly by you or collected automatically through your interaction with our services.",
    items: [
      "Account details (name, email, phone)",
      "Profile information",
      "Uploaded photos",
      "Preferences",
      "Messages within platform",
      "Device and usage data",
    ],
  },
  {
    title: "2. How We Use Your Information",
    paragraph:
      "The information we collect is used strictly for legitimate business purposes including account management, service personalization, communication, fraud prevention, and compliance with applicable legal obligations. We do not sell your personal data to third parties.",
    items: [
      "Account creation",
      "Matchmaking services",
      "Communication features",
      "Security & fraud prevention",
      "Legal compliance",
    ],
  },
  {
    title: "3. Data Security",
    paragraph:
      "We implement appropriate technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no online system can be guaranteed 100% secure.",
    items: ["Encryption", "Secure servers", "Limited access controls"],
  },
  {
    title: "4. Your Rights",
    paragraph:
      "Depending on your country of residence, you may have specific legal rights regarding your personal information. We are committed to honoring these rights and providing transparent access to your data.",
    items: [
      "Access your data",
      "Correct your data",
      "Delete your account",
      "Withdraw consent",
    ],
  },
];

const PrivacyDetails = () => {
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
      {/* Hero Section - identical to Home */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ marginTop: 0, paddingTop: 0 }}
      >
        {/* Background Image Carousel */}
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

        {/* Dark Gradient Overlay - same as Home */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Floating Brand Logo - same as Home */}
        <FloatingBrandLogo />

        {/* Hero Content */}
        <div className="container mx-auto relative z-10 px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Privacy Policy &{" "}
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Data Usage
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Learn how we collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
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
              <ul className="space-y-2.5 text-foreground/70 text-[15px] leading-[1.7]">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              5. Contact Us
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions, concerns, or requests regarding your privacy or personal data, please contact us using the information below.
            </p>
            <div className="space-y-1.5 text-[15px]">
              <p>
                <a href="mailto:privacy@yourdomain.com" className="text-primary font-medium hover:underline">
                  privacy@yourdomain.com
                </a>
              </p>
              <p>
                <a href="mailto:support@yourdomain.com" className="text-primary font-medium hover:underline">
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyDetails;
