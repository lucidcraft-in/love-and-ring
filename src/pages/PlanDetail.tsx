import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowLeft, Crown, Diamond, Shield, Star, Users } from "lucide-react";

const planData = {
  normal: {
    name: "Normal Plan",
    icon: Shield,
    tagline: "Essential matchmaking service for focused individuals",
    summary: "Ideal for singles who want a straightforward, no-fuss approach to finding their life partner with guaranteed attention to their profile.",
    features: [
      {
        title: "Single Profile",
        description: "Your profile receives dedicated attention from our matchmaking team, ensuring quality over quantity in the matching process."
      },
      {
        title: "Guaranteed Response",
        description: "Every interest expressed on your behalf receives a response, ensuring you're never left waiting or uncertain."
      },
      {
        title: "Mutual Expression of Interest",
        description: "Both parties must express interest before contact details are shared, ensuring genuine connections only."
      },
      {
        title: "Single-Party Fee",
        description: "Simple pricing structure where only you pay the service fee, making it easy to get started."
      }
    ],
    whoShouldChoose: [
      "Individuals seeking a focused, personalized matchmaking experience",
      "Those who prefer quality matches over high volume",
      "Singles who value guaranteed communication",
      "First-time users of professional matchmaking services"
    ],
    tier: "standard"
  },
  silver: {
    name: "Silver Plan",
    icon: Star,
    tagline: "Balanced partnership approach for mutual commitment",
    summary: "Perfect for those who believe in shared responsibility and mutual investment in the matchmaking journey.",
    features: [
      {
        title: "Single Profile",
        description: "Dedicated profile management with personalized attention from our experienced matchmakers."
      },
      {
        title: "Guaranteed Response",
        description: "Every expression of interest on your profile is guaranteed a response within our service timeline."
      },
      {
        title: "Mutual Expression of Interest",
        description: "A balanced approach where both families express genuine interest before proceeding further."
      },
      {
        title: "Fee Paid Mutually",
        description: "The service fee is shared between both parties, reflecting mutual commitment to the process."
      }
    ],
    whoShouldChoose: [
      "Families who believe in shared investment and commitment",
      "Those seeking partners with similar values of mutual respect",
      "Individuals who appreciate balanced responsibility",
      "Those looking for serious, committed connections"
    ],
    tier: "standard"
  },
  gold: {
    name: "Gold Plan",
    icon: Crown,
    tagline: "Value bundle for families seeking multiple matches",
    summary: "Designed for families who want to explore multiple compatible profiles efficiently with a bundled approach.",
    features: [
      {
        title: "Bundle of 10 Profiles",
        description: "Access to 10 carefully curated profiles that match your preferences, maximizing your chances of finding the right match."
      },
      {
        title: "Response Not Guaranteed",
        description: "While responses aren't guaranteed, the volume of profiles increases your overall connection opportunities."
      },
      {
        title: "Single Expression of Interest",
        description: "You can express interest in profiles without requiring mutual interest, giving you more flexibility."
      },
      {
        title: "Single-Party Payment",
        description: "One-time payment for the entire bundle, offering excellent value for families."
      }
    ],
    whoShouldChoose: [
      "Families looking for value through bundled services",
      "Those who prefer to explore multiple options",
      "Individuals comfortable with a volume-based approach",
      "Families with specific requirements seeking wider exposure"
    ],
    tier: "standard"
  },
  "premium-club": {
    name: "Premium Club",
    icon: Diamond,
    tagline: "Elevated matchmaking experience with personal attention",
    summary: "For discerning individuals and families who expect premium service, personal coordination, and exclusive features.",
    features: [
      {
        title: "Exclusive Lounge for Video Call & Live Chat",
        description: "Access our private digital lounge for secure video calls and real-time chat with potential matches in a controlled environment."
      },
      {
        title: "Direct Access to Dedicated Client Manager",
        description: "A personal client manager assigned to your profile, available to address your needs and guide you through every step."
      },
      {
        title: "Client-Manager Coordinated Meetings",
        description: "Your client manager personally coordinates meetings between families, ensuring smooth and professional interactions."
      },
      {
        title: "Multiple Payment Options",
        description: "Flexible payment structures tailored to your convenience, including installment options."
      }
    ],
    whoShouldChoose: [
      "High-net-worth individuals and families",
      "Those who value personalized, white-glove service",
      "Busy professionals who need managed matchmaking",
      "Families seeking coordinated, hassle-free experiences"
    ],
    tier: "premium"
  },
  "million-club": {
    name: "Million Club",
    icon: Users,
    tagline: "Ultra-exclusive concierge service for elite clientele",
    summary: "The pinnacle of matchmaking services, offering complete confidentiality, legal support, and consultant-led personalized service.",
    features: [
      {
        title: "Consultant-Led Client Service",
        description: "A senior consultant personally handles your matchmaking journey, bringing years of expertise and an exclusive network."
      },
      {
        title: "Complete Client Validation",
        description: "Thorough background verification and validation of all parties involved, ensuring authenticity and trustworthiness."
      },
      {
        title: "Client-Specific Confidential Service",
        description: "Your identity and details are handled with the highest level of discretion, visible only to approved matches."
      },
      {
        title: "Legal (Pre-Nuptial) Service",
        description: "Access to legal experts for pre-nuptial agreements and other matrimonial legal requirements."
      }
    ],
    whoShouldChoose: [
      "Ultra-high-net-worth individuals and families",
      "Public figures requiring complete confidentiality",
      "Families seeking comprehensive legal support",
      "Those who demand the absolute best in matchmaking"
    ],
    tier: "exclusive"
  }
};

const PlanDetail = () => {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  
  const planInfo = plan ? planData[plan as keyof typeof planData] : null;
  
  if (!planInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <Button onClick={() => navigate("/pricing")}>Back to Pricing</Button>
        </div>
      </div>
    );
  }

  const Icon = planInfo.icon;
  const isExclusive = planInfo.tier === "exclusive";
  const isPremium = planInfo.tier === "premium";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`py-20 ${
        isExclusive 
          ? "bg-gradient-to-br from-slate-900 to-slate-800" 
          : isPremium 
            ? "bg-gradient-to-br from-primary/20 to-secondary/20"
            : "bg-gradient-to-br from-primary/10 to-secondary/10"
      }`}>
        <div className="container mx-auto px-4">
          <Link 
            to="/pricing" 
            className={`inline-flex items-center gap-2 mb-8 text-sm hover:underline ${
              isExclusive ? "text-slate-300" : "text-muted-foreground"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Plans
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
              isExclusive 
                ? "bg-amber-500/20" 
                : "bg-primary/10"
            }`}>
              <Icon className={`h-8 w-8 ${
                isExclusive ? "text-amber-400" : "text-primary"
              }`} />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <h1 className={`text-4xl md:text-5xl font-bold ${
                isExclusive ? "text-white" : "text-foreground"
              }`}>
                {planInfo.name}
              </h1>
              {isExclusive && (
                <span className="px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  Exclusive
                </span>
              )}
              {isPremium && (
                <span className="px-3 py-1 text-sm font-medium bg-primary/20 text-primary rounded-full border border-primary/30">
                  Premium
                </span>
              )}
            </div>
            
            <p className={`text-xl mb-4 ${
              isExclusive ? "text-amber-200" : "text-primary"
            }`}>
              {planInfo.tagline}
            </p>
            
            <p className={`text-lg ${
              isExclusive ? "text-slate-300" : "text-muted-foreground"
            }`}>
              {planInfo.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-8">What's Included</h2>
            
            <div className="grid gap-6">
              {planInfo.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isExclusive 
                          ? "bg-amber-500/10" 
                          : "bg-primary/10"
                      }`}>
                        <Check className={`h-5 w-5 ${
                          isExclusive ? "text-amber-500" : "text-primary"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Should Choose Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-8">Who Should Choose This Plan?</h2>
            
            <Card className="p-8 border-border/50">
              <ul className="space-y-4">
                {planInfo.whoShouldChoose.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isExclusive 
                        ? "bg-amber-500/10" 
                        : "bg-primary/10"
                    }`}>
                      <Check className={`h-4 w-4 ${
                        isExclusive ? "text-amber-500" : "text-primary"
                      }`} />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Contact our team today to learn more about the {planInfo.name} and begin your matchmaking journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className={
                  isExclusive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                    : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                }
                onClick={() => navigate("/contact")}
              >
                {isExclusive || isPremium ? "Contact Us" : "Enquire Now"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 hover:bg-primary/5"
                onClick={() => navigate("/pricing")}
              >
                Compare All Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PlanDetail;