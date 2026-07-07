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

const RefundPolicy = () => {
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
              Refund
              <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ml-2">
                Policy
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
          <>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {" "}
                Refund & Cancellation Policy
              </h1>

              <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                This Refund & Cancellation Policy is established for{" "}
                <span className="font-medium text-black">Love & Ring Ltd.</span>{" "}
                (collectively referred to as{" "}
                <span className="font-medium text-black">“Love and Ring”</span>,
                “The Company”, “we”, “us” or “our” in this policy), including
                our platform available at
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
                This policy outlines the terms related to payments,
                cancellations, and refunds for services offered through our
                matrimony platform. By purchasing any of our plans or services,
                you agree to the terms described below.
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {" "}
                Payment, Cancellation & Refund Terms
              </h1>

              <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
                All payments made to{" "}
                <span className="font-medium text-black px-1">
                  Love & Ring Ltd
                </span>{" "}
                for subscriptions or services are processed securely. Once a
                user subscribes to a paid plan, the services are considered to
                be activated immediately unless stated otherwise.
                <br />
                <br />
                Payments made for subscription plans are generally
                non-refundable. However, refunds may be considered in
                exceptional cases where there is a technical issue, duplicate
                transaction, or an error caused by the platform. In such cases,
                users must contact our support team within a reasonable time
                frame with relevant details for review.
                <br />
                <br />
                Users may cancel their subscription at any time. Cancellation
                will stop future billing, but it will not result in a refund for
                the current billing period. Users will continue to have access
                to the subscribed services until the end of the active
                subscription period.
                <br />
                <br />
                <span className="font-medium text-black px-1">
                  Love & Ring Ltd
                </span>{" "}
                reserves the right to review refund requests and make decisions
                at its sole discretion, in compliance with applicable laws and
                regulations.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-12"
            >
              {/* {sections.map((section) => (
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
              ))} */}

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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;
