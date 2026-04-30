import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. Authentic Profiles",
    paragraph: `Users must provide accurate and truthful information. Creating fake or misleading profiles is strictly prohibited. Impersonating another person or using false identity details is not allowed.`,
    items: [],
  },
  {
    title: "2. Respectful Behavior",
    paragraph: `All members must treat each other with respect and dignity. Harassment, abuse, hate speech, or offensive language is not allowed. Sending unwanted or inappropriate messages is strictly prohibited.`,
    items: [],
  },
  {
    title: "3. No Fraud or Scams",
    paragraph: `Users must not engage in fraudulent or deceptive activities. Requesting money, financial help, or any suspicious transactions from other users is strictly prohibited.`,
    items: [],
  },
  {
    title: "4. Communication Safety",
    paragraph: `Users are responsible for their interactions with others. We strongly advise against sharing sensitive personal or financial information. Always communicate cautiously.`,
    items: [],
  },
  {
    title: "5. Reporting & Blocking",
    paragraph: `Users can report or block any member who violates these guidelines. Our team reviews all reports and takes appropriate action, including suspension or permanent ban.`,
    items: [],
  },
  {
    title: "6. Profile Verification",
    paragraph: `Love & Ring may verify user profiles through email, phone, or other verification methods to ensure authenticity and build trust within the platform.`,
    items: [],
  },
  {
    title: "7. Enforcement",
    paragraph: `We reserve the right to remove content, suspend accounts, or permanently ban users who violate these guidelines. Legal action may be taken in serious cases.`,
    items: [],
  },
];

const CommunityGuidelines = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [policyType, setPolicyType] = useState("privacy");

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

  const formatTextWithLinks = (text) => {
    if (!text) return text;

    const parts = text.split(
      /(www\.loveandring\.com|Love\s*&\s*Ring\s*Ltd\.?)/g,
    );

    return parts.map((part, index) => {
      // exact match for website
      if (part === "www.loveandring.com") {
        return (
          <Link
            key={index}
            to="https://www.loveandring.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            {part}
          </Link>
        );
      }

      // exact match for company name ONLY
      if (/^Love\s*&\s*Ring\s*Ltd\.?$/.test(part)) {
        return (
          <span key={index} className="font-medium text-foreground">
            {part}
          </span>
        );
      }

      return part;
    });
  };

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
              Community
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ml-2">
                Guidelines
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Learn how we collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <motion.div
        key={policyType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto px-4 py-12 md:py-16 space-y-12"
        style={{ maxWidth: "1200px" }}
      >
        <motion.div>
          {policyType === "privacy" ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {" "}
                  Safety & Community Guidelines
                </h1>

                <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                  These Community Guidelines are established for{" "}
                  <span className="font-medium text-black">
                    Love & Ring Ltd.
                  </span>{" "}
                  (collectively referred to as{" "}
                  <span className="font-medium text-black">
                    “Love and Ring”
                  </span>
                  , “The Company”, “we”, “us” or “our” in these guidelines),
                  including our platform available at
                  <Link
                    to="https://www.loveandring.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium hover:underline px-1"
                  >
                    www.loveandring.com
                  </Link>{" "}
                  and our associated applications (“our platform”).
                  <br />
                  <br />
                  These guidelines are designed to ensure a safe, respectful,
                  and trustworthy environment for individuals seeking meaningful
                  relationships. By using our services, you agree to follow
                  these standards to promote authentic interactions, prevent
                  misuse, and maintain a secure experience for all members of
                  our community.
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {" "}
                  Our Community Standards
                </h1>

                <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                  At{" "}
                  <span className="font-medium text-black px-1">
                    Love & Ring Ltd
                  </span>
                  , we are committed to maintaining a high standard of integrity
                  and user safety across our platform. Users must provide
                  accurate and truthful information while creating profiles.
                  Fake profiles, impersonation, or any form of misleading
                  identity is strictly prohibited.
                  <br />
                  <br />
                  All users are expected to interact respectfully. Harassment,
                  abusive behavior, hate speech, or inappropriate communication
                  will not be tolerated. Users must not engage in fraudulent
                  activities, including requesting money or financial assistance
                  from other members.
                  <br />
                  <br />
                  We encourage safe communication practices. Users should avoid
                  sharing sensitive personal or financial information and are
                  responsible for their interactions both on and off the
                  platform. We also provide options to report or block users who
                  violate these guidelines.
                  <br />
                  <br />
                  <span className="font-medium text-black px-1">
                    Love & Ring Ltd
                  </span>{" "}
                  may verify user profiles through email, phone, or other
                  verification methods to ensure authenticity and build trust
                  within the community. We reserve the right to remove content,
                  suspend accounts, or permanently ban users who violate these
                  guidelines, and may take legal action where necessary.
                </p>
              </div>
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
                      {formatTextWithLinks(section.paragraph)}
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
                {/* <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              8. Contact Us
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions, concerns, or requests regarding your
              privacy or personal data, please contact us using the information
              below.
            </p>
            <div className="space-y-1.5 text-[15px]">
              <p>
                <a
                  href="mailto:privacy@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  privacy@yourdomain.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div> */}
              </motion.div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Cookie Policy
                </h1>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  Introduction
                </h2>
                <p className="text-[15px] text-foreground/80 leading-[1.7] text-justify">
                  This is the cookie policy for Love & Ring Company PVT. Ltd.
                  (collectively referred to as “The Company”, “Love & Ring
                  Company PVT. Ltd.”, “we”, “us” or “our” in this policy), our
                  site the www.loveandring.com , and our associated apps (“our
                  sites”). Some of our other sites and services may have their
                  own cookie policies, which will be relevant to you when you
                  are using those sites and services.
                </p>
              </div>
              <br />
              <br />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-12"
              >
                {/* Contact Section */}
                {/* <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              8. Contact Us
            </h2>
            <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
              If you have questions, concerns, or requests regarding your
              privacy or personal data, please contact us using the information
              below.
            </p>
            <div className="space-y-1.5 text-[15px]">
              <p>
                <a
                  href="mailto:privacy@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  privacy@yourdomain.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@yourdomain.com"
                  className="text-primary font-medium hover:underline"
                >
                  support@yourdomain.com
                </a>
              </p>
            </div>
          </div> */}
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CommunityGuidelines;
