import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Axios from "@/axios/axios";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import contactHeroBg from "@/assets/contact-hero-bg.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactPage, setContactPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMalayalam, setShowMalayalam] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  useEffect(() => {
    const fetchContactPage = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 your auth token

        const res = await Axios.get("/api/cms/static-pages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contact = res.data.find((page: any) => page.slug === "contact");

        setContactPage(contact);
      } catch (err) {
        console.error("Failed to load contact page", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();
  }, []);

  const heroSection = contactPage?.sections?.find((s: any) => s.key === "hero");

  const contactInfoSection = contactPage?.sections?.find(
    (s: any) => s.key === "contact-info",
  );

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: contactInfoSection?.fields?.email,
      href: contactInfoSection?.fields?.email
        ? `mailto:${contactInfoSection.fields.email}`
        : null,
    },
    {
      icon: Phone,
      title: "Phone",
      content: contactInfoSection?.fields?.phone,
      href: contactInfoSection?.fields?.phone
        ? `tel:${contactInfoSection.fields.phone}`
        : null,
    },
    {
      icon: MapPin,
      title: "Address",
      content: contactInfoSection?.fields?.address,
      href: null,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMalayalam((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${contactHeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        <FloatingBrandLogo variant="hero" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white hero-text-shadow">
              Get In <span className="gradient-text-light">Touch</span>
            </h1>
            {/* <p className="text-xl md:text-2xl hero-subtext max-w-2xl mx-auto">
              {heroSection?.description ||
                "We're here to help you on your journey to finding your perfect life partner"}
            </p> */}
            <p className="text-base sm:text-xl md:text-2xl hero-subtext min-h-[60px]">
              We’d love to hear from you.{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={showMalayalam ? "ml" : "en"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.6 }}
                  className={
                    showMalayalam ? "gradient-text-light inline" : "inline"
                  }
                  style={
                    showMalayalam
                      ? {
                          fontFamily: "'Noto Sans Malayalam', sans-serif",
                          fontSize: "0.9em",
                          fontWeight: 500,
                        }
                      : {}
                  }
                >
                  {!showMalayalam
                    ? "We're here to help you on your journey to finding your perfect life partner."
                    : "ജീവിതപങ്കാളിയെ കുറിച്ച് ഉള്ള നിങ്ങളുടെ സ്വപ്നം സഫലമാക്കാൻ….ലവ് & റിങ്"}
                </motion.span>
              </AnimatePresence>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 glass-card">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground text-lg">
                  We're here to assist you with any questions or concerns. Reach
                  out to us through any of the following channels.
                </p>
              </div>

              {/* Contact Information Cards */}
              {contactInfoSection?.fields && (
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    if (!info?.content) return null; // 👈 skip empty fields

                    return (
                      <Card
                        key={index}
                        className="p-6 glass-card hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className="p-3 rounded-lg bg-primary/10">
                            <info.icon className="h-6 w-6 text-primary" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{info.title}</h3>

                            {info.href ? (
                              <a
                                href={info.href}
                                className="text-muted-foreground hover:text-primary transition-colors break-words"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-muted-foreground break-words">
                                {info.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Map Placeholder */}
              <Card className="p-6 glass-card">
                <h3 className="font-semibold mb-4">Our Location</h3>
                <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map view would appear here
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
