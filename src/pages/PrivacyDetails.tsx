import { motion } from "framer-motion";
import heroSlide1 from "@/assets/hero-slide-1.jpg";

const sections = [
  {
    title: "1. Information We Collect",
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
    items: [
      "Encryption",
      "Secure servers",
      "Limited access controls",
    ],
  },
  {
    title: "4. Your Rights",
    items: [
      "Access your data",
      "Correct your data",
      "Delete your account",
      "Withdraw consent",
    ],
  },
];

const PrivacyDetails = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div id="hero-section" className="relative h-[340px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={heroSlide1}
          alt="Privacy Policy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Privacy Policy & Data Usage
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Learn how we collect, use, and protect your information.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-10"
        >
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-foreground mb-4">{section.title}</h2>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Contact Us</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For privacy-related questions, please contact us at:{" "}
              <a href="mailto:privacy@yourdomain.com" className="text-primary font-medium hover:underline">
                privacy@yourdomain.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyDetails;
