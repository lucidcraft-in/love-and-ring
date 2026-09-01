import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X, AlertCircle, Shield, Users, Lock, CheckCircle, Loader2, Eye, EyeOff, Circle } from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Axios from "@/axios/axios";
import { validatePassword } from "@/utils/validation";
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
  regions: string;
  password: string;
  confirmPassword: string;
  licenseNumber: string;
}

const ClientRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    regions: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
  });
  const totalSteps = 2;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        return ["fullName", "email", "countryCode", "mobile"];
      case 2:
        return ["regions", "password", "confirmPassword"];
      default:
        return [];
    }
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const checkStepValidity = (step: number): boolean => {
    const requiredFields = getRequiredFieldsForStep(step);
    const basicValid = requiredFields.every((field) => {
      const value = formData[field];
      return value && value.trim() !== "";
    });

    if (step === 2) {
      return basicValid && passwordValidation.isValid && passwordsMatch;
    }

    return basicValid;
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

  const handleSubmit = async () => {
    if (!passwordValidation.isValid) {
      toast.error("Password does not meet requirements.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${formData.countryCode} ${formData.mobile}`;
      await Axios.post("/api/consultants/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: fullPhone,
        regions: formData.regions,
        licenseNumber: formData.licenseNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      toast.success("Registration submitted successfully! Awaiting admin approval.");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit consultant registration";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === totalSteps;
  const canProceed = isStepValid && !isSubmitting;

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
                  placeholder="Enter full name"
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
                  placeholder="email@agency.com"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">
                  Mobile / Phone Number <span className="text-destructive">*</span>
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
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="regions" className="text-sm">
                Operating Regions / Cities <span className="text-destructive">*</span>
              </Label>
              <Input
                id="regions"
                type="text"
                value={formData.regions}
                onChange={(e) => updateFormData("regions", e.target.value)}
                placeholder="e.g. Mumbai, Pune, Delhi"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber" className="text-sm">
                License / Registration No. (Optional)
              </Label>
              <Input
                id="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                placeholder="License or Agency ID"
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="Min. 6 characters"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    placeholder="Confirm password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="bg-muted/40 border border-border/50 rounded-xl p-3 space-y-2 text-xs">
              <p className="font-medium text-foreground text-xs">
                Password Requirements:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordValidation.minLength
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {passwordValidation.minLength ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  )}
                  <span>At least 8 characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordValidation.hasUppercase
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {passwordValidation.hasUppercase ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  )}
                  <span>One uppercase letter (A-Z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordValidation.hasDigit
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {passwordValidation.hasDigit ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  )}
                  <span>One number (0-9)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    passwordValidation.hasSpecial
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {passwordValidation.hasSpecial ? (
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  )}
                  <span>Special character (!@#$%^&*)</span>
                </div>
                {formData.confirmPassword.length > 0 && (
                  <div
                    className={`flex items-center gap-1.5 sm:col-span-2 transition-colors ${
                      passwordsMatch
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : "text-destructive font-medium"
                    }`}
                  >
                    {passwordsMatch ? (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                    )}
                    <span>
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>
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
      <FloatingBrandLogo variant="auth" className="z-[5]" />

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
                    {currentStep === 1 && "Account & Contact"}
                    {currentStep === 2 && "Region & Credentials"}
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
                  disabled={currentStep === 1 || isSubmitting}
                  className="gap-1.5 rounded-lg px-4 h-9 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={isLastStep ? handleSubmit : nextStep}
                  disabled={!canProceed || isSubmitting}
                  className={`gap-1.5 rounded-lg px-6 h-9 text-sm ${
                    canProceed && !isSubmitting
                      ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Submitting...
                    </>
                  ) : isLastStep ? (
                    "Submit Registration"
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
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
