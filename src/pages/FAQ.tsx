import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
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

const FAQ = () => {
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
          "To register, click on the 'Register Free' button on our homepage. Fill in your basic details including name, email, phone number, and create a password. You'll receive a verification email to activate your account.",
      },
      {
        question: "Is registration free?",
        answer:
          "Yes, registration on Love & Ring is completely free. You can create your profile, add photos, and browse other profiles without any charges.",
      },
      {
        question: "What information do I need to provide during registration?",
        answer:
          "During registration, you'll need to provide your name, email address, phone number, date of birth, gender, and basic profile information. More details can be added later to complete your profile.",
      },
      {
        question: "Can I register on behalf of someone else?",
        answer:
          "Yes, family members can create profiles on behalf of their relatives. Simply select the appropriate option during registration and provide accurate information about the person seeking a match.",
      },
    ],
    "free-membership": [
      {
        question: "What features are available with free membership?",
        answer:
          "Free members can create a detailed profile, upload photos, browse profiles, use basic search filters, and receive match suggestions. You can also express interest in profiles you like.",
      },
      {
        question: "Can I contact other members with a free account?",
        answer:
          "Free members have limited contact options. To view contact details and send personalized messages, you'll need to upgrade to a paid membership plan.",
      },
      {
        question: "How long does free membership last?",
        answer:
          "Free membership is available indefinitely. You can use the basic features as long as you want, and upgrade to premium whenever you're ready for more features.",
      },
    ],
    "paid-membership": [
      {
        question: "What are the benefits of paid membership?",
        answer:
          "Paid members enjoy unlimited contact views, personalized matchmaking, priority customer support, advanced search filters, profile highlighting, and access to verified contact information of other members.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. All payments are processed through secure payment gateways.",
      },
      {
        question: "Can I cancel my paid membership?",
        answer:
          "Yes, you can cancel your paid membership at any time. However, refunds are subject to our refund policy. Please contact our support team for cancellation requests.",
      },
      {
        question: "Are there different membership tiers?",
        answer:
          "Yes, we offer multiple membership tiers including Silver, Gold, and Platinum plans. Each tier offers different features and contact limits. Visit our Pricing page for detailed comparison.",
      },
    ],
    "login-issues": [
      {
        question: "I forgot my password. How can I reset it?",
        answer:
          "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
      },
      {
        question: "Why can't I log in to my account?",
        answer:
          "Login issues can occur due to incorrect credentials, account suspension, or technical issues. Ensure you're using the correct email and password. If problems persist, contact our support team.",
      },
      {
        question: "How do I change my password?",
        answer:
          "Log in to your account, go to Settings > Security, and click on 'Change Password'. Enter your current password and your new password twice to confirm the change.",
      },
    ],
    "search-matches": [
      {
        question: "How does the matching algorithm work?",
        answer:
          "Our matching algorithm considers your preferences, profile details, partner preferences, and compatibility factors to suggest the most suitable matches. The more complete your profile, the better your matches.",
      },
      {
        question: "Can I filter searches by specific criteria?",
        answer:
          "Yes, you can filter searches by age, location, education, profession, religion, caste, and many other criteria. Premium members have access to advanced filters for more refined searches.",
      },
      {
        question: "Why am I not getting good matches?",
        answer:
          "Ensure your profile is complete with accurate information and clear photos. Review your partner preferences - overly restrictive criteria may limit your matches. Consider broadening your search parameters.",
      },
    ],
    "contacting-members": [
      {
        question: "How can I contact a member I'm interested in?",
        answer:
          "You can express interest by clicking the 'Send Interest' button on their profile. If they accept your interest, you can exchange messages. Premium members can directly view contact details.",
      },
      {
        question: "What should I do if someone is harassing me?",
        answer:
          "Use the 'Report' or 'Block' option on their profile to report inappropriate behavior. Our moderation team reviews all reports and takes strict action against policy violations.",
      },
      {
        question: "Can I see who viewed my profile?",
        answer:
          "Yes, you can see who viewed your profile in the 'Profile Visitors' section of your dashboard. Premium members get detailed visitor analytics and notification alerts.",
      },
    ],
    "profile-photo": [
      {
        question: "How do I update my profile information?",
        answer:
          "Log in to your account and go to 'Edit Profile' in your dashboard. You can update your personal details, partner preferences, and other information. Remember to save changes after editing.",
      },
      {
        question: "What are the photo guidelines?",
        answer:
          "Photos should be recent, clear, and show your face properly. Avoid group photos as your main image. Inappropriate or fake photos will be rejected. We recommend uploading at least 3-5 photos.",
      },
      {
        question: "How long does photo verification take?",
        answer:
          "Photo verification typically takes 24-48 hours. Our team manually reviews all photos to ensure they meet our guidelines. You'll be notified once your photos are approved or if changes are needed.",
      },
      {
        question: "Can I hide my photos from certain members?",
        answer:
          "Yes, you can set your photos to 'Protected' mode. This means only members you approve can view your photos. You can also selectively share photos with specific members.",
      },
    ],
    payments: [
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL encryption and PCI-compliant payment gateways. Your financial information is never stored on our servers.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Refund requests are evaluated on a case-by-case basis within 7 days of purchase. Partial refunds may be provided based on usage. Please contact support with your order details for refund requests.",
      },
      {
        question: "Can I upgrade my membership plan?",
        answer:
          "Yes, you can upgrade your plan at any time. The price difference will be calculated pro-rata based on your remaining subscription period. Visit the Pricing page to upgrade.",
      },
    ],
    general: [
      {
        question: "Is Love & Ring available as a mobile app?",
        answer:
          "Currently, Love & Ring is available as a responsive web application that works seamlessly on all devices. Our dedicated mobile apps for iOS and Android are coming soon.",
      },
      {
        question: "How do you verify profiles?",
        answer:
          "We use multiple verification methods including phone verification, email verification, ID verification, and photo moderation. Premium members can opt for additional verification badges.",
      },
      {
        question: "How can I delete my account?",
        answer:
          "To delete your account, go to Settings > Account > Delete Account. Note that this action is irreversible and all your data will be permanently removed after 30 days.",
      },
      {
        question: "How do I contact customer support?",
        answer:
          "You can reach our support team via email at support@lovering.com, through the Contact page on our website, or call our helpline. Premium members get priority support with faster response times.",
      },
    ],
  };

  const [activeCategory, setActiveCategory] = useState("registration");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find answers to common questions about Love & Ring
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Category Dropdown */}
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

              {/* Desktop Sidebar */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:block lg:w-64 shrink-0"
              >
                <div className="sticky top-24 space-y-2">
                  <h3 className="font-semibold text-lg mb-4">Categories</h3>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-primary to-secondary text-white font-medium shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </motion.aside>

              {/* FAQ Accordion Content */}
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <div className="bg-card rounded-2xl shadow-lg border p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {categories.find((c) => c.id === activeCategory)?.label}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqData[activeCategory]?.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border rounded-lg px-4 bg-background"
                      >
                        <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
