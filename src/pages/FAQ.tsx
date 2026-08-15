import DynamicStaticPage from "./DynamicStaticPage";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { id: "registration", label: "Registration" },
  { id: "free-membership", label: "Free Membership" },
  { id: "paid-membership", label: "Paid Membership" },
  { id: "login-issues", label: "Login Issues" },
  { id: "search-matches", label: "Search & Matches" },
  { id: "contacting-members", label: "Contacting Members" },
  { id: "profile-photo", label: "Profile & Photo Updates" },
  { id: "payments", label: "Payments" },
  { id: "general", label: "General Info" },
];

const faqData: Record<string, { question: string; answer: string }[]> = {
  registration: [
    {
      question: "How do I register on Love & Ring?",
      answer:
        "To register, click on the 'Register Free' button on our homepage. Fill in your basic details including name, email, phone number, and create a password.",
    },
    {
      question: "Is registration free?",
      answer: "Yes, registration on Love & Ring is completely free.",
    },
  ],
  "free-membership": [
    {
      question: "What features are available with free membership?",
      answer:
        "Free members can create a detailed profile, upload photos, browse profiles, and receive match suggestions.",
    },
  ],
  "paid-membership": [
    {
      question: "What are the benefits of paid membership?",
      answer:
        "Paid members enjoy unlimited contact views, personalized matchmaking, priority customer support, and advanced search filters.",
    },
  ],
};

const FallbackFAQContent = () => {
  const [activeCategory, setActiveCategory] = useState("registration");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:hidden">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <motion.aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-white font-medium shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.aside>

        <div className="flex-1 bg-card rounded-2xl shadow-sm border p-6">
          <h3 className="text-2xl font-bold mb-6">
            {categories.find((c) => c.id === activeCategory)?.label}
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {(faqData[activeCategory] || faqData["registration"]).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-semibold py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <DynamicStaticPage
      forcedSlug="faq"
      fallbackTitle="Frequently Asked Questions"
      fallbackContent={<FallbackFAQContent />}
    />
  );
}
