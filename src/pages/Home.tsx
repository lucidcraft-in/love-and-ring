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
import HowItWorks from "@/components/HowItWorks";
import FeaturedSuccessStory from "@/components/FeaturedSuccessStory";


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
  // 4 seconds for authenticated users, 7 seconds for public view
  useEffect(() => {
    if (isHeroHovered) return;
    
    const intervalDuration = isAuthenticated ? 4000 : 7000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, intervalDuration);
    return () => clearInterval(interval);
  }, [isHeroHovered, isAuthenticated]);

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

  const loginFeatures = [
    { icon: Shield, title: "Verified Profiles", desc: "100% authenticated members" },
    { icon: Users, title: "Smart Matching", desc: "AI-powered compatibility" },
    { icon: Lock, title: "Complete Privacy", desc: "Your data stays secure" },
    { icon: CheckCircle, title: "Premium Support", desc: "24/7 dedicated assistance" },
  ];

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
      fullStory: "Love & Ring made our journey calm, reassuring, and truly meaningful. From the very first interaction, we felt the platform understood what we were looking for in a life partner. The personalized approach and genuine care from the team made all the difference. We never felt rushed or pressured—just supported every step of the way. Today, we're building a beautiful life together, and we owe it all to this wonderful platform that brought us together.",
    },
    {
      names: "Abina & Basil",
      images: [homeAbinaBasil1, homeAbinaBasil2],
      story: "A trustworthy platform that helped us connect naturally and confidently.",
      date: "Married: 9th November 2025",
      fullStory: "A trustworthy platform that helped us connect naturally and confidently. What stood out to us was how authentic every profile felt—no exaggerations, no false promises, just real people looking for genuine connections. The verification process gave us peace of mind, and the matching algorithm truly understood our preferences. Our families were impressed with the professionalism, and we found in each other exactly what we had been searching for. We're so grateful for Love & Ring.",
    },
    {
      names: "Molex & Roshin",
      images: [homeMolexRoshin1, homeMolexRoshin2, homeMolexRoshin3],
      story: "Thanks to Love & Ring, we found our perfect match with ease and clarity.",
      date: "Married: 10th November 2025",
      fullStory: "Thanks to Love & Ring, we found our perfect match with ease and clarity. The platform's attention to detail and the way they consider cultural backgrounds, values, and aspirations made the entire experience seamless. We appreciated the privacy controls and the thoughtful communication features that allowed us to get to know each other at our own pace. Love & Ring isn't just a matrimony platform—it's a bridge to finding your soulmate. We couldn't be happier with our journey.",
    },
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - starts from absolute top of viewport, behind navbar */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ marginTop: 0, paddingTop: 0 }}
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Background Image Carousel - sharp, no blur */}
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
        
        {/* Dark Gradient Overlay for text readability - no blur */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.5) 100%)'
          }}
        />
        
        {/* Hero Content - centered with padding for navbar space */}
        <div className="container mx-auto relative z-10 px-4 pt-16">
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
                    asChild
                    variant="outline"
                    className="text-base sm:text-lg px-6 sm:px-8"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base sm:text-lg px-6 sm:px-8"
                  >
                    <Link to="/register">Register Now</Link>
                  </Button>
                </div>
              </motion.div>
            ) : formMode === "signin" ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col lg:flex-row"
              >
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-0" />

                {/* Desktop/Tablet Close Button - Top Right of Screen */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex absolute top-6 right-6 z-30 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
                  onClick={resetForm}
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Left Section - Marketing Content */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative z-10"
                >
                  <div className="relative z-10 max-w-lg">
                    {/* Main Heading */}
                    <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
                      Welcome Back
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Sign In to Continue
                      </span>
                    </h1>

                    {/* Supporting Text */}
                    <p className="text-lg text-white/80 leading-relaxed mb-10">
                      Your perfect match is waiting. Sign in to continue your journey 
                      and discover meaningful connections tailored to your preferences.
                    </p>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                      {loginFeatures.map((feature, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                            <p className="text-white/60 text-xs">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Register Link */}
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-white/70">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                          Register Now
                        </Link>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Right Section - Login Form */}
                <div className="flex-1 lg:w-[55%] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 min-h-[80vh] lg:min-h-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-xl"
                  >
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                        Welcome <span className="text-primary">Back</span>
                      </h1>
                      <p className="text-white/70 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                          Register
                        </Link>
                      </p>
                    </div>

                    {/* Mobile Close Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm z-30"
                      onClick={resetForm}
                    >
                      <X className="h-5 w-5" />
                    </Button>

                    {/* Form Card */}
                    <Card className="relative p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
                      {/* Form Header */}
                      <div className="mb-5">
                        <h2 className="text-xl font-semibold text-foreground mb-1">
                          Sign In
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your credentials to access your account
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-sm">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                            className="h-10"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm">Password</Label>
                            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={signInData.password}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              className="h-10 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                        >
                          Sign In
                        </Button>
                      </form>

                      {/* Divider */}
                      <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-3 bg-card text-muted-foreground">or continue with</span>
                        </div>
                      </div>

                      {/* Social Login */}
                      <Button variant="outline" className="w-full h-10 rounded-lg" type="button">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>

                      {/* Register Link - Mobile/Tablet visible inside card */}
                      <p className="text-center mt-5 text-sm text-muted-foreground lg:hidden">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline font-medium">
                          Register Now
                        </Link>
                      </p>
                    </Card>

                    {/* Help Text */}
                    <div className="text-center mt-4 text-xs text-white/60">
                      <p>Need help? Contact us at <span className="text-primary">support@lovering.com</span></p>
                    </div>
                  </motion.div>
                </div>
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
                <h1 
                  className="text-3xl sm:text-5xl md:text-7xl font-bold"
                  style={{ 
                    color: '#FFFFFF',
                    textShadow: '0 2px 12px rgba(0,0,0,0.35)'
                  }}
                >
                  Welcome <span className="gradient-text-light">Back!</span>
                </h1>
                <p 
                  className="text-base sm:text-xl md:text-2xl"
                  style={{ 
                    color: 'rgba(255,255,255,0.85)',
                    textShadow: '0 2px 12px rgba(0,0,0,0.35)'
                  }}
                >
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

      {/* How It Works Section */}
      <HowItWorks />

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

          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex"
                >
                  <Card className="p-5 sm:p-6 w-full glass-card hover:shadow-lg transition-all flex flex-col">
                    <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground flex-1">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/20">
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

          <div className="">
            <FeaturedSuccessStory stories={successStories} />
          </div>

          <div className="text-center mt-10 sm:mt-14">
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
                className="border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary shadow-[0_0_15px_rgba(255,255,255,0.2)] text-sm sm:text-lg px-6 sm:px-8"
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
