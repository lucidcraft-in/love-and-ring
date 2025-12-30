import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Diamond, Shield, Star, Users, Minus } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Normal Plan",
      slug: "normal",
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
      slug: "silver",
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
      slug: "gold",
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
      slug: "premium-club",
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
      slug: "million-club",
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

  const comparisonFeatures = [
    { 
      name: "Number of Profiles", 
      normal: "1", 
      silver: "1", 
      gold: "10", 
      premium: "Unlimited", 
      million: "Unlimited" 
    },
    { 
      name: "Guaranteed Response", 
      normal: true, 
      silver: true, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Mutual Expression of Interest", 
      normal: true, 
      silver: true, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Payment Type", 
      normal: "Single-Party", 
      silver: "Mutual", 
      gold: "Single-Party", 
      premium: "Flexible", 
      million: "Custom" 
    },
    { 
      name: "Profile Bundle", 
      normal: false, 
      silver: false, 
      gold: true, 
      premium: false, 
      million: false 
    },
    { 
      name: "Video Call & Live Chat", 
      normal: false, 
      silver: false, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Dedicated Client Manager", 
      normal: false, 
      silver: false, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Meeting Coordination", 
      normal: false, 
      silver: false, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Confidential Handling", 
      normal: false, 
      silver: false, 
      gold: false, 
      premium: true, 
      million: true 
    },
    { 
      name: "Legal / Pre-Nuptial Support", 
      normal: false, 
      silver: false, 
      gold: false, 
      premium: false, 
      million: true 
    },
  ];

  const renderComparisonValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <Minus className="h-5 w-5 text-muted-foreground/40 mx-auto" />
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

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
                  
                  <ul className="space-y-4 mb-6 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {plan.cta}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-primary hover:text-primary hover:bg-primary/5"
                      onClick={() => navigate(`/pricing/${plan.slug}`)}
                    >
                      View Details
                    </Button>
                  </div>
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
                  
                  <ul className="space-y-4 mb-6 flex-grow relative z-10">
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
                  
                  <div className="space-y-3 relative z-10">
                    <Button 
                      className={`w-full ${
                        plan.tier === "exclusive"
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold border-0"
                          : "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full ${
                        plan.tier === "exclusive"
                          ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                          : "text-primary hover:text-primary hover:bg-primary/5"
                      }`}
                      onClick={() => navigate(`/pricing/${plan.slug}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our plans compare side by side to find the perfect fit for your needs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 font-semibold text-foreground bg-muted/30">
                      Features
                    </th>
                    <th className="p-4 text-center font-semibold text-foreground bg-muted/30">
                      Normal
                    </th>
                    <th className="p-4 text-center font-semibold text-foreground bg-muted/30">
                      Silver
                    </th>
                    <th className="p-4 text-center font-semibold text-foreground bg-muted/30">
                      Gold
                    </th>
                    <th className="p-4 text-center font-semibold text-primary bg-primary/5">
                      Premium Club
                    </th>
                    <th className="p-4 text-center font-semibold bg-gradient-to-r from-amber-500/10 to-amber-600/10">
                      <span className="text-amber-600">Million Club</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr 
                      key={feature.name}
                      className={`border-b border-border/30 ${index % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      <td className="p-4 text-sm font-medium text-foreground">
                        {feature.name}
                      </td>
                      <td className="p-4 text-center">
                        {renderComparisonValue(feature.normal)}
                      </td>
                      <td className="p-4 text-center">
                        {renderComparisonValue(feature.silver)}
                      </td>
                      <td className="p-4 text-center">
                        {renderComparisonValue(feature.gold)}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {renderComparisonValue(feature.premium)}
                      </td>
                      <td className="p-4 text-center bg-gradient-to-r from-amber-500/5 to-amber-600/5">
                        {renderComparisonValue(feature.million)}
                      </td>
                    </tr>
                  ))}
                  {/* CTA Row */}
                  <tr>
                    <td className="p-4"></td>
                    <td className="p-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/pricing/normal")}
                        className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
                      >
                        Learn More
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/pricing/silver")}
                        className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
                      >
                        Learn More
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate("/pricing/gold")}
                        className="border-primary/30 hover:bg-primary hover:text-primary-foreground"
                      >
                        Learn More
                      </Button>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <Button 
                        size="sm"
                        onClick={() => navigate("/pricing/premium-club")}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        Learn More
                      </Button>
                    </td>
                    <td className="p-4 text-center bg-gradient-to-r from-amber-500/5 to-amber-600/5">
                      <Button 
                        size="sm"
                        onClick={() => navigate("/pricing/million-club")}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                      >
                        Learn More
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
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
