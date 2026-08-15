import DynamicStaticPage from "./DynamicStaticPage";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Link } from "react-router-dom";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const sections = [
  {
    title: "1. The services we provide",
    paragraph:
      "Our mission is to give individuals the power to find a suitable partner and join their hands to be a Bride and Groom, and to walk a journey of life together. To help advance this mission, weprovide the Products and services described below to you:",
    subSections: [
      {
        title: "1.1 Provide a personalised experience for you : ",
        paragraph: `Love & Ring Ltd. offers you a platform ( www.loveandring.com ) where you can register your profile with information that are relevant and specific to you...`,
      },
      {
        title: "1.2 Connect you with Individuals and organisations:",
        paragraph: `Love & Ring Ltd. help you in finding and connect with individuals, groups, businesses, organisations and others that matter to you...`,
      },
      {
        title: "1.3 Research ways to make our services better:",
        paragraph: `Our Products help you find and connect with people, groups, businesses, organisations and others that are important to you...`,
      },
      {
        title: "1.4 Access to our services from various countries and geographical locations",
        paragraph: `To deliver our services across various geographical locations and jurisdictions and enable you to connect with people around the world...`,
      },
    ],
    items: [],
  },
  {
    title: "2. How our services are funded",
    paragraph: `You (the ‘Client’) can choose to use our Products for free if it is for a baseline profile registration...`,
    items: [],
  },
  {
    title: "3. Refund Policy",
    paragraph: `As our services are delivered across various countries and jurisdictions, our refund policy is anchored to the client’s / registrant’s home country...`,
    items: [],
  },
  {
    title: "4. Account Suspension and / or Termination",
    paragraph: `The intended objectives of Love & Ring Ltd. are to be a platform where individuals feel welcome and safe to join...`,
    items: [],
  },
  {
    title: "5. Limits on liability",
    paragraph: `These Terms are not intended to exclude or limit our liability for death, personal injury or fraudulent misrepresentation...`,
    items: [],
  },
  {
    title: "6. Service Guarantees and Assurances",
    paragraph: `The company, as a facilitator of connecting people (individuals), does not and cannot explicitly assure a guaranteed outcome...`,
    items: [],
  },
  {
    title: "7. Complaints and Legal Disputes",
    paragraph: `In case of a claim or dispute arises out of or relates to your use of services provided by Love & Ring Ltd...`,
    items: [],
  },
  {
    title: "8. User Verification & Safety",
    paragraph: "Love & Ring may verify user profiles through email, phone, or other identity verification methods...",
    items: [],
  },
  {
    title: "9. WhatsApp Communication",
    paragraph: "Love & Ring enables users to initiate communication via WhatsApp for matchmaking purposes...",
    items: [],
  },
];

const FallbackTermsContent = () => {
  const formatTextWithLinks = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(www\.loveandring\.com|Love & Ring Ltd\.)/g);
    return parts.map((part, index) => {
      if (part === "www.loveandring.com") {
        return (
          <Link
            key={index}
            to="https://www.loveandring.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline px-1"
          >
            {part}
          </Link>
        );
      }
      if (part === "Love & Ring Ltd.") {
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
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Overview
        </h2>
        <p className="text-[15px] text-foreground/80 leading-[1.7] mb-8 text-justify">
          This is the Terms of Service established for{" "}
          <span className="font-medium text-foreground px-1">Love & Ring Ltd</span>.
          (collectively referred to as "Love and Ring", "The Company", "we", "us" or "our" in this policy).
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            {section.title}
          </h3>
          <p className="text-[15px] text-foreground/80 leading-[1.7] mb-5">
            {formatTextWithLinks(section.paragraph)}
          </p>
          {section.subSections && section.subSections.length > 0 && (
            <div className="space-y-4 mb-5">
              {section.subSections.map((sub) => (
                <div key={sub.title}>
                  <h4 className="text-[15px] md:text-[16px] font-semibold text-foreground mb-1">
                    {sub.title}
                  </h4>
                  <p className="text-[15px] text-foreground/80 leading-[1.7] text-justify">
                    {formatTextWithLinks(sub.paragraph)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function Terms() {
  return (
    <DynamicStaticPage
      forcedSlug="terms"
      fallbackTitle="Terms of Use"
      fallbackContent={<FallbackTermsContent />}
    />
  );
}
