import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, X, AlertCircle, Shield, Users, Lock, CheckCircle } from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

interface ClientFormData {
  fullName: string;
  email: string;
  countryCode: string;
  mobile: string;
  city: string;
  state: string;
  experience: string;
  organization: string;
  about: string;
}

const ClientRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    city: "",
    state: "",
    experience: "",
    organization: "",
    about: "",
  });
  const totalSteps = 2;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload hero images
  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-rotate background
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const progress = (currentStep / totalSteps) * 100;

  const getRequiredFieldsForStep = (step: number): (keyof ClientFormData)[] => {
    switch (step) {
      case 1:
        return ["fullName", "email", "countryCode", "mobile", "city", "state"];
      case 2:
        return ["experience", "about"];
      default:
        return [];
    }
  };

  const checkStepValidity = (step: number): boolean => {
    const requiredFields = getRequiredFieldsForStep(step);
    return requiredFields.every((field) => {
      const value = formData[field];
      return value && value.trim() !== "";
    });
  };

  useEffect(() => {
    setIsStepValid(checkStepValidity(currentStep));
  }, [formData, currentStep]);

  const updateFormData = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success("Registration submitted successfully! We will contact you soon.");
    navigate("/");
  };

  const isLastStep = currentStep === totalSteps;
  const canProceed = isStepValid;

  const features = [
    { icon: Shield, title: "Verified Partner", desc: "Become an official partner" },
    { icon: Users, title: "Network Access", desc: "Connect with families" },
    { icon: Lock, title: "Secure Platform", desc: "Protected interactions" },
    { icon: CheckCircle, title: "Premium Support", desc: "Dedicated assistance" },
  ];

  const countryCodes = [
    { value: "+91", label: "India (+91)" },
    { value: "+1", label: "USA (+1)" },
    { value: "+44", label: "UK (+44)" },
    { value: "+971", label: "UAE (+971)" },
    { value: "+65", label: "Singapore (+65)" },
    { value: "+61", label: "Australia (+61)" },
  ];

  const experienceOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "More than 10 years",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter your email"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => updateFormData("countryCode", value)}
                  >
                    <SelectTrigger className="w-[120px] h-10">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => updateFormData("mobile", e.target.value)}
                    placeholder="Mobile number"
                    className="flex-1 h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="Your city"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    placeholder="Your state"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="experience" className="text-sm">
                Matchmaking Experience <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => updateFormData("experience", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select your experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organization" className="text-sm">
                Organization/Agency Name (Optional)
              </Label>
              <Input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => updateFormData("organization", e.target.value)}
                placeholder="If applicable"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="about" className="text-sm">
                Tell Us About Yourself <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) => updateFormData("about", e.target.value)}
                placeholder="Briefly describe your experience and why you want to partner with us..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Carousel Background */}
      <div id="hero-section" className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide]}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Floating Brand Logo */}
      <FloatingBrandLogo className="z-[5]" />

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Marketing Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg">
            {/* Brand */}
            <Link to="/" className="inline-block mb-5">
              {/* <span className="text-2xl font-bold">
                Love<span className="text-primary">&</span>Ring
              </span> */}
            </Link>

            {/* Main Heading */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Client Partner
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Registration
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join our network of trusted matchmaking professionals. Help 
              families find meaningful connections while being part of 
              India's premium matrimony platform.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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

            {/* Back Link */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/70">
                Changed your mind?{" "}
                <Link
                  to="/"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Return to Home
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Registration Form */}
        <div className="flex-1 lg:w-[55%] flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-xl"
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold text-white">
                  Love<span className="text-primary">&</span>Ring
                </span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                Client <span className="text-primary">Registration</span>
              </h1>
            </div>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Form Card */}
            <Card className="relative mt-10 p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
              {/* Step Progress Indicator */}
              <div className="mb-5 pr-8 lg:pr-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-foreground">
                    Step {currentStep} of {totalSteps}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {currentStep === 1 && "Personal Details"}
                    {currentStep === 2 && "Professional Info"}
                  </span>
                </div>

                {/* Step Dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div key={i} className="flex-1 flex items-center">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i + 1 <= currentStep
                            ? "bg-gradient-to-r from-primary to-secondary"
                            : "bg-muted"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
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

              {/* Validation Message */}
              {!canProceed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-4 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs">Please fill all required fields to continue</p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-5 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-1.5 rounded-lg px-4 h-9 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={isLastStep ? handleSubmit : nextStep}
                  disabled={!canProceed}
                  className={`gap-1.5 rounded-lg px-6 h-9 text-sm ${
                    canProceed
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  {isLastStep ? "Submit" : "Continue"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-4 text-xs text-white/60">
              <p>
                Need help with partner registration?{" "}
                <Link to="/support?from=client-registration" className="text-primary hover:underline">
                  Get help
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;
