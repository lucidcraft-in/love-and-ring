import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "@/axios/axios";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import pricingHeroBg from "@/assets/pricing-hero-bg.jpg";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  _id: string;
  title: string;
  heading: string;
  price: number;
  currency: string;
  features: {
    label: string;
    value: string;
    isHighlighted: boolean;
  }[];
  isPopular: boolean;
  duration?: {
    value: number;
    unit: string;
  };
}

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showMalayalam, setShowMalayalam] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan: Plan) => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a subscription plan.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setPaymentLoading(plan._id);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!sdkLoaded) {
        toast({
          title: "SDK Load Failed",
          description: "Could not load payment gateway SDK. Are you online?",
          variant: "destructive",
        });
        setPaymentLoading(null);
        return;
      }

      // 2. Fetch Razorpay Key ID
      const keyResponse = await Axios.get("/api/razorpay/key", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const razorpayKey = keyResponse.data.key;

      // 3. Create checkout order
      const orderResponse = await Axios.post(
        "/api/razorpay/checkout",
        { planId: plan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const orderData = orderResponse.data;

      // 4. Configure Razorpay Options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Love & Ring",
        description: `Upgrade to ${plan.title} Plan`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await Axios.post(
              "/api/razorpay/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan._id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            toast({
              title: "Upgrade Successful!",
              description: verifyResponse.data.message || "Your subscription has been activated.",
            });

            // Fetch latest user details and update profile state
            try {
              const userProfileResponse = await Axios.get(`/api/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              updateProfile(userProfileResponse.data);
            } catch (err) {
              console.error("Failed to fetch updated user info:", err);
            }

            // Redirect to dashboard
            navigate("/dashboard");
          } catch (verifyError: any) {
            toast({
              title: "Payment Verification Failed",
              description: verifyError.response?.data?.message || "Something went wrong during payment verification.",
              variant: "destructive",
            });
            setPaymentLoading(null);
          }
        },
        prefill: {
          name: user.fullName || "",
          email: user.email || "",
          contact: user.mobile || "",
          method: "upi",
        },
        theme: {
          color: "#E11D48",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(null);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      toast({
        title: "Payment Initiation Failed",
        description: err.response?.data?.message || "Could not start the payment flow.",
        variant: "destructive",
      });
      setPaymentLoading(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await Axios.get("/api/payment/plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlans(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    fetchPlans();
  }, []);
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
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pricingHeroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* Floating Brand Logos */}
        <FloatingBrandLogo variant="hero" />
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white hero-text-shadow">
              Choose Your{" "}
              <span className="gradient-text-light">Perfect Plan</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl hero-subtext min-h-[60px]">
              Find the plan that works best for your journey to finding your
              life partner.{" "}
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
                    ? "Creating beautiful journeys where love finds its forever."
                    : "ജീവിതപങ്കാളിയെ കുറിച്ച് ഉള്ള നിങ്ങളുടെ സ്വപ്നം സഫലമാക്കാൻ….ലവ് & റിങ്"}
                </motion.span>
              </AnimatePresence>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full flex flex-col relative">
                  {plan.isPopular && (
                    <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-primary text-white">
                      Popular
                    </span>
                  )}

                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="text-xl font-semibold mb-1">{plan.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {plan.heading}
                    </p>

                    <p className="text-2xl font-bold mt-4">
                      ₹{plan.price}
                      {plan.duration && (
                        <span className="text-sm font-normal text-muted-foreground">
                          {" "}
                          / {plan.duration.value} {plan.duration.unit}
                        </span>
                      )}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          className={`h-4 w-4 mt-1 ${
                            feature.isHighlighted
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-sm">
                          {feature.label}: <strong>{feature.value}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary"
                    onClick={() => handlePayment(plan)}
                    disabled={paymentLoading === plan._id}
                  >
                    {paymentLoading === plan._id ? "Processing..." : "Choose Plan"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
