import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LogIn,
  UserPlus,
  Monitor,
  ShieldAlert,
  Lock,
  CreditCard,
  HeadphonesIcon,
  Sparkles,
  Mail,
  Send,
  ChevronLeft,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface SupportCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  guidance: string[];
}

const supportCategories: SupportCategory[] = [
  {
    id: "signin",
    title: "Help with Sign In / Account Access",
    icon: LogIn,
    description: "Issues logging into your account",
    guidance: [
      "Make sure you're using the correct email address associated with your account.",
      "Try resetting your password using the 'Forgot Password' link on the login page.",
      "Clear your browser cache and cookies, then try again.",
      "If you're still having issues, submit a support request below.",
    ],
  },
  {
    id: "registration",
    title: "Help with Registration",
    icon: UserPlus,
    description: "Problems creating a new account",
    guidance: [
      "Ensure all required fields are filled correctly.",
      "Use a valid email address that you have access to.",
      "Check that your password meets the minimum requirements.",
      "If you're getting an error, try using a different browser.",
    ],
  },
  {
    id: "website",
    title: "Help with Website Usage",
    icon: Monitor,
    description: "Navigation and feature questions",
    guidance: [
      "Visit our FAQ page for common questions about using the platform.",
      "Try refreshing the page if something isn't loading correctly.",
      "Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge).",
      "For specific feature guidance, describe your issue below.",
    ],
  },
  {
    id: "security",
    title: "Profile Security / Account Compromised",
    icon: ShieldAlert,
    description: "Security concerns or suspicious activity",
    guidance: [
      "Immediately change your password if you suspect unauthorized access.",
      "Review your recent account activity for any suspicious changes.",
      "Contact us immediately if you notice any unauthorized profile changes.",
      "Never share your login credentials with anyone.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Data Concerns",
    icon: Lock,
    description: "Questions about your personal data",
    guidance: [
      "Your data is protected according to our Privacy Policy.",
      "You can request data deletion by contacting our support team.",
      "We never share your personal information with third parties without consent.",
      "Review your privacy settings in your profile dashboard.",
    ],
  },
  {
    id: "pricing",
    title: "Help with Upgrading / Pricing",
    icon: CreditCard,
    description: "Questions about plans and payments",
    guidance: [
      "Visit our Pricing page to compare available plans.",
      "Contact us for custom plan inquiries or corporate packages.",
      "Payment issues are handled securely through our payment partners.",
      "Refund requests can be submitted through the form below.",
    ],
  },
  {
    id: "support-quality",
    title: "I'm not getting the right support",
    icon: HeadphonesIcon,
    description: "Need to escalate your issue",
    guidance: [
      "We apologize if your previous support experience wasn't satisfactory.",
      "Please describe your issue in detail so we can escalate appropriately.",
      "Our senior support team will personally review escalated cases.",
      "We aim to respond to escalated issues within 24 hours.",
    ],
  },
  {
    id: "special",
    title: "Special needs or unavailable features",
    icon: Sparkles,
    description: "Feature requests or accessibility needs",
    guidance: [
      "We're constantly improving our platform based on user feedback.",
      "Describe the feature you need, and we'll evaluate adding it.",
      "For accessibility requirements, please let us know how we can help.",
      "Your suggestions help us serve you better.",
    ],
  },
];

const categoryFromParam: Record<string, string> = {
  signin: "signin",
  login: "signin",
  registration: "registration",
  register: "registration",
  "client-registration": "registration",
  "client-terms": "website",
  "partner-registration": "registration",
};

const Support = () => {
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fromParam && categoryFromParam[fromParam]) {
      setSelectedCategory(categoryFromParam[fromParam]);
      setFormData((prev) => ({
        ...prev,
        category: categoryFromParam[fromParam],
      }));
    }
  }, [fromParam]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Your support request has been submitted. We'll get back to you soon!");
      setFormData({ category: "", description: "", email: "" });
      setShowForm(false);
      setSelectedCategory(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const selectedCategoryData = supportCategories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How can we help you?
            </h1>
            <p className="text-muted-foreground text-lg">
              Select a topic below to get guidance or submit a support request.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              /* Category Grid */
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {supportCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="p-5 cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                          <category.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Selected Category View */
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Back Button */}
                <Button
                  variant="ghost"
                  className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowForm(false);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to all topics
                </Button>

                <Card className="p-6 md:p-8">
                  {/* Category Header */}
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      {selectedCategoryData && (
                        <selectedCategoryData.icon className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        {selectedCategoryData?.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedCategoryData?.description}
                      </p>
                    </div>
                  </div>

                  {/* Guidance */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-4">
                      Quick guidance
                    </h3>
                    <ul className="space-y-3">
                      {selectedCategoryData?.guidance.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Toggle Form */}
                  {!showForm ? (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-muted-foreground mb-4">
                        Still need help? Submit a support request and we'll get
                        back to you.
                      </p>
                      <Button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Contact Support
                      </Button>
                    </div>
                  ) : (
                    /* Support Form */
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSubmit}
                      className="pt-4 border-t border-border/50 space-y-4"
                    >
                      <div className="space-y-1.5">
                        <Label htmlFor="category">
                          Issue Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, category: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="description">
                          Describe your issue <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Please describe your issue in detail..."
                          className="min-h-[120px] resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">
                          Email (optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="your.email@example.com"
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll use this to get back to you
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white gap-2"
                        >
                          {isSubmitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Request
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Card className="p-6 bg-muted/30 border-dashed">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">
                  Prefer email?
                </span>
              </div>
              <p className="text-muted-foreground">
                You can also reach us directly at{" "}
                <a
                  href="mailto:support@lovering.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@lovering.com
                </a>
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Support;
