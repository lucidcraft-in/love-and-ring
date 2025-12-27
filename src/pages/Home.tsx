import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Users, Lock, CheckCircle, Heart, Star, ChevronLeft, ChevronRight, X, Eye, EyeOff, Headset } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import homeAthiraVisish1 from "@/assets/home-athira-visish-1.png";
import homeAthiraVisish2 from "@/assets/home-athira-visish-2.png";
import homeAthiraVisish3 from "@/assets/home-athira-visish-3.png";
import homeAbinaBasil1 from "@/assets/home-abina-basil-1.png";
import homeAbinaBasil2 from "@/assets/home-abina-basil-2.png";
import homeMolexRoshin1 from "@/assets/home-molex-roshin-1.png";
import homeMolexRoshin2 from "@/assets/home-molex-roshin-2.png";
import homeMolexRoshin3 from "@/assets/home-molex-roshin-3.png";
import { useAuth } from "@/contexts/AuthContext";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";
import HomeStoryCarousel from "@/components/HomeStoryCarousel";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

type FormMode = "hero" | "signin" | "registration";

const Home = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formMode, setFormMode] = useState<FormMode>("hero");
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const totalSteps = 5;

  // Preload hero images for smooth transitions
  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-rotate hero background slides with pause on hover
  useEffect(() => {
    if (isHeroHovered) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isHeroHovered]);

  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};
    setStepErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setStepErrors({});
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStepErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      login({ email: signInData.email || "user@example.com", name: "User" });
      toast.success("Registration successful!");
      navigate('/dashboard');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill all fields");
      return;
    }
    login({ email: signInData.email, name: "User" });
    toast.success("Signed in successfully!");
    navigate('/dashboard');
  };

  const resetForm = () => {
    setFormMode("hero");
    setCurrentStep(1);
    setStepErrors({});
    setSignInData({ email: "", password: "" });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne errors={stepErrors} />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree errors={stepErrors} />;
      case 4:
        return <StepFour />;
      case 5:
        return <StepFive errors={stepErrors} />;
      default:
        return <StepOne errors={stepErrors} />;
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your data is protected with industry-leading security measures, ensuring complete trust and reliability.",
    },
    {
      icon: Users,
      title: "Authentic Profiles",
      description: "Every profile is manually verified through a strict authentication process to ensure complete authenticity.",
    },
    {
      icon: Lock,
      title: "Your Privacy",
      description: "Ensuring absolute privacy with full control over who can view your profile and contact details, tailored to your needs.",
    },
    {
      icon: CheckCircle,
      title: "Advanced Matching",
      description: "Smart algorithm capabilities focusing on compatibility and exclusivity to help you find your perfect match.",
    },
    {
      icon: Headset,
      title: "Personalised Support",
      description: "Every profile receives consultant-led personalised support, ensuring meaningful matches without relying solely on algorithm-based outcomes.",
    },
  ];

  const successStories = [
    {
      names: "Athira & Visish",
      images: [homeAthiraVisish1, homeAthiraVisish2, homeAthiraVisish3],
      story: "Love & Ring made our journey calm, reassuring, and truly meaningful.",
      date: "Married: 29th October 2025",
    },
    {
      names: "Abina & Basil",
      images: [homeAbinaBasil1, homeAbinaBasil2],
      story: "A trustworthy platform that helped us connect naturally and confidently.",
      date: "Married: 9th November 2025",
    },
    {
      names: "Molex & Roshin",
      images: [homeMolexRoshin1, homeMolexRoshin2, homeMolexRoshin3],
      story: "Thanks to Love & Ring, we found our perfect match with ease and clarity.",
      date: "Married: 10th November 2025",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-8 sm:py-12"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Background Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroSlides[currentSlide]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
        
        {/* Elegant Vertical Gradient Overlay - romantic, premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-transparent to-primary/20" />
        
        <div className="container mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {formMode === "hero" && !isAuthenticated ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 px-4"
              >
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white hero-text-shadow">
                  Find Your <span className="gradient-text-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Perfect Match</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl hero-subtext">
                  Join thousands of happy couples who found their life partner through our trusted matrimony platform
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setFormMode("signin")}
                    variant="outline"
                    className="text-base sm:text-lg px-6 sm:px-8"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setFormMode("registration")}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg px-6 sm:px-8"
                  >
                    Register Now
                  </Button>
                </div>
              </motion.div>
            ) : formMode === "signin" ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="max-w-md mx-auto relative p-4 sm:p-6"
              >
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 sm:-top-2 sm:-right-2 z-20 bg-background/80 hover:bg-background rounded-full shadow-lg"
                  onClick={resetForm}
                >
                  <X className="h-5 w-5" />
                </Button>

                <Card className="p-6 sm:p-8 glass-card">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                      Welcome <span className="gradient-text">Back</span>
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Sign in to continue your journey
                    </p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <Link to="/forgot-password" className="text-primary hover:underline">
                        Forgot Password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      Sign In
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setFormMode("registration")}
                        className="text-primary hover:underline font-medium"
                      >
                        Register Now
                      </button>
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : formMode === "registration" ? (
              <motion.div
                key="registration"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative p-4 sm:p-6"
              >
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 sm:-top-2 sm:-right-2 z-20 bg-background/80 hover:bg-background rounded-full shadow-lg"
                  onClick={resetForm}
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
                    Create Your <span className="gradient-text">Profile</span>
                  </h1>
                  <p className="text-base sm:text-xl text-muted-foreground">
                    Step {currentStep} of {totalSteps}: Complete your registration
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 sm:mb-8">
                  <Progress value={progress} className="h-2 sm:h-3" />
                  <div className="hidden sm:flex justify-between mt-2 text-xs sm:text-sm text-muted-foreground">
                    <span>Basic Details</span>
                    <span>Basic Info</span>
                    <span>Personal</span>
                    <span>Education</span>
                    <span>Additional</span>
                  </div>
                  <div className="sm:hidden text-center mt-2 text-xs text-muted-foreground">
                    Step {currentStep}: {["Basic Details", "Basic Info", "Personal", "Education", "Additional"][currentStep - 1]}
                  </div>
                </div>

                {/* Form Card */}
                <Card className="p-4 sm:p-6 md:p-8 glass-card">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t gap-4">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Back</span>
                    </Button>

                    <Button
                      onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                      className="gap-1 sm:gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm sm:text-base"
                    >
                      {currentStep === totalSteps ? "Submit" : "Continue"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Already have account */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      onClick={() => setFormMode("signin")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="authenticated"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8 px-4"
              >
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold">
                  Welcome <span className="gradient-text">Back!</span>
                </h1>
                <p className="text-base sm:text-xl md:text-2xl text-muted-foreground">
                  Continue your journey to find your perfect life partner
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg px-6 sm:px-8"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative floating elements */}
        {formMode === "hero" && !isAuthenticated && (
          <>
            <div className="absolute top-20 left-4 sm:left-10 opacity-20">
              <Heart className="h-10 w-10 sm:h-16 sm:w-16 text-primary animate-float" />
            </div>
            <div className="absolute bottom-20 right-4 sm:right-10 opacity-20">
              <Star className="h-12 w-12 sm:h-20 sm:w-20 text-secondary animate-float" style={{ animationDelay: "1s" }} />
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Why Choose Love & Ring?</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide a secure, trusted platform to help you find your perfect life partner
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full max-w-sm mx-auto"
                >
                  <Card className="p-5 sm:p-6 h-full glass-card hover:shadow-lg transition-all">
                    <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Success Stories</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real Couples, Real Happiness – read their inspiring journeys and the beautiful stories that brought them together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden glass-card hover:shadow-xl transition-all">
                  {story.images.length > 1 ? (
                    <HomeStoryCarousel images={story.images} names={story.names} />
                  ) : story.images.length === 1 ? (
                    <img
                      src={story.images[0]}
                      alt={story.names}
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl font-semibold gradient-text">{story.names}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground italic">"{story.story}"</p>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      <p>{story.date}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" variant="outline" asChild className="text-sm sm:text-base">
              <Link to="/success-stories">View All Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 sm:space-y-6"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">About Love & Ring</h2>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                Love & Ring is a trusted, personalised matchmaking and matrimonial platform dedicated to helping individuals find their ideal life partner. Our platform is built on trust, authenticity, and a deep understanding of diverse social and cultural backgrounds.
              </p>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                With many success stories, we understand the importance of finding a companion who shares your values and aspirations and is ready to walk together hand in hand.
              </p>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                Our platform combines advanced technology with consultant-led personalised service. Every profile is manually verified, and your privacy is always assured.
              </p>
              <Button size="lg" variant="outline" asChild className="text-sm sm:text-base">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">Ready to Find Your Match?</h2>
            <p className="text-base sm:text-xl opacity-90">
              Create your profile in just a few minutes and start your journey to find your perfect life partner
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="bg-white text-primary hover:bg-white/90 text-sm sm:text-lg px-6 sm:px-8"
              >
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white hover:text-primary text-sm sm:text-lg px-6 sm:px-8"
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
