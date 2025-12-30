import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Diamond, Shield, Star, Users } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Normal Plan",
      icon: Shield,
      description: "Essential matchmaking service",
      features: [
        "Single Profile",
        "Guaranteed Response",
        "Mutual Expression of Interest",
        "Single-Party Fee",
      ],
      cta: "Get Started",
      tier: "standard",
    },
    {
      name: "Silver Plan",
      icon: Star,
      description: "Balanced partnership approach",
      features: [
        "Single Profile",
        "Guaranteed Response",
        "Mutual Expression of Interest",
        "Fee Paid Mutually",
      ],
      cta: "Get Started",
      tier: "standard",
    },
    {
      name: "Gold Plan",
      icon: Crown,
      description: "Value bundle for families",
      features: [
        "Bundle of 10 Profiles",
        "Response Not Guaranteed",
        "Single Expression of Interest",
        "Single-Party Payment",
      ],
      cta: "Enquire Now",
      tier: "standard",
    },
    {
      name: "Premium Club",
      icon: Diamond,
      description: "Elevated matchmaking experience",
      features: [
        "Exclusive lounge area for video call & live chat",
        "Direct access to a dedicated client manager",
        "Client-manager coordinated meetings",
        "Multiple payment options",
      ],
      cta: "Contact Us",
      tier: "premium",
    },
    {
      name: "Million Club",
      icon: Users,
      description: "Ultra-exclusive concierge service",
      features: [
        "Consultant-led client service",
        "Complete client validation",
        "Client-specific confidential service",
        "Legal (pre-nuptial) service",
      ],
      cta: "Contact Us",
      tier: "exclusive",
    },
  ];

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
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find the plan that works best for your journey to finding your life partner
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Standard Plans Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.filter(p => p.tier === "standard").map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors">
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Premium Plans Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.filter(p => p.tier === "premium" || p.tier === "exclusive").map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-8 h-full flex flex-col relative overflow-hidden transition-all duration-300 ${
                    plan.tier === "exclusive" 
                      ? "bg-gradient-to-br from-slate-900 to-slate-800 border-amber-500/30 text-white" 
                      : "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20"
                  }`}
                >
                  {plan.tier === "exclusive" && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
                  )}
                  
                  <div className="mb-6 relative z-10">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      plan.tier === "exclusive" 
                        ? "bg-amber-500/20" 
                        : "bg-primary/10"
                    }`}>
                      <plan.icon className={`h-6 w-6 ${
                        plan.tier === "exclusive" ? "text-amber-400" : "text-primary"
                      }`} />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-xl font-semibold ${
                        plan.tier === "exclusive" ? "text-white" : "text-foreground"
                      }`}>
                        {plan.name}
                      </h3>
                      {plan.tier === "exclusive" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                          Exclusive
                        </span>
                      )}
                      {plan.tier === "premium" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      plan.tier === "exclusive" ? "text-slate-300" : "text-muted-foreground"
                    }`}>
                      {plan.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-grow relative z-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.tier === "exclusive" 
                            ? "bg-amber-500/20" 
                            : "bg-primary/10"
                        }`}>
                          <Check className={`h-3 w-3 ${
                            plan.tier === "exclusive" ? "text-amber-400" : "text-primary"
                          }`} />
                        </div>
                        <span className={`text-sm ${
                          plan.tier === "exclusive" ? "text-slate-200" : "text-foreground/80"
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full relative z-10 ${
                      plan.tier === "exclusive"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold border-0"
                        : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-4">Need Help Choosing?</h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you find the perfect plan for your matchmaking journey. 
              Get in touch for personalized guidance.
            </p>
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary hover:text-primary-foreground">
              Speak with Our Team
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
