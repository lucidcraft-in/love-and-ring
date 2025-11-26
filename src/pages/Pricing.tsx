import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "Forever",
      description: "Perfect for getting started",
      features: [
        "Create profile",
        "Browse limited profiles",
        "Basic search filters",
        "Send 5 interests per month",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Silver",
      price: "₹999",
      period: "3 Months",
      description: "Great for active searchers",
      features: [
        "Everything in Free",
        "Browse unlimited profiles",
        "Advanced search filters",
        "Send unlimited interests",
        "View contact details (50)",
        "Chat with matches",
        "Priority support",
      ],
      highlighted: false,
    },
    {
      name: "Gold",
      price: "₹2,499",
      period: "6 Months",
      description: "Most popular choice",
      features: [
        "Everything in Silver",
        "Highlighted profile",
        "View contact details (150)",
        "Profile visibility boost",
        "Advanced matching algorithm",
        "Video call feature",
        "Dedicated relationship advisor",
        "Premium badge",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "₹4,999",
      period: "12 Months",
      description: "Complete matrimony experience",
      features: [
        "Everything in Gold",
        "Unlimited contact views",
        "Top profile placement",
        "Personalized matchmaking",
        "Background verification",
        "Astrology matching",
        "Wedding planning assistance",
        "Lifetime profile support",
      ],
      highlighted: false,
    },
  ];

  const comparisonFeatures = [
    { feature: "Profile Creation", free: true, silver: true, gold: true, premium: true },
    { feature: "Browse Profiles", free: "Limited", silver: "Unlimited", gold: "Unlimited", premium: "Unlimited" },
    { feature: "Send Interests", free: "5/month", silver: "Unlimited", gold: "Unlimited", premium: "Unlimited" },
    { feature: "View Contact Details", free: false, silver: "50", gold: "150", premium: "Unlimited" },
    { feature: "Chat Feature", free: false, silver: true, gold: true, premium: true },
    { feature: "Video Calls", free: false, silver: false, gold: true, premium: true },
    { feature: "Profile Boost", free: false, silver: false, gold: true, premium: true },
    { feature: "Priority Support", free: false, silver: true, gold: true, premium: true },
    { feature: "Relationship Advisor", free: false, silver: false, gold: true, premium: true },
    { feature: "Background Verification", free: false, silver: false, gold: false, premium: true },
    { feature: "Astrology Matching", free: false, silver: false, gold: false, premium: true },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 h-full glass-card hover:shadow-xl transition-all relative ${
                    plan.highlighted ? "border-2 border-primary" : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Choose Plan
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              Compare all features across different plans
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Silver</th>
                  <th className="text-center p-4 font-semibold">Gold</th>
                  <th className="text-center p-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span>{row.free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.silver === "boolean" ? (
                        row.silver ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span>{row.silver}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.gold === "boolean" ? (
                        row.gold ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span>{row.gold}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span>{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
