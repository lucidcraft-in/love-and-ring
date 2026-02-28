import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Shield,
  Users,
  Lock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";
import OTPVerification from "@/components/registration/OTPVerification";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import {
  completeUserProfile,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  registerUser,
} from "@/services/UserServices";
import Axios from "@/axios/axios";
import PrivacyConsentModal from "@/components/registration/PrivacyConsentModal";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

export interface RegistrationData {
  accountFor: string;
  fullName: string;
  email: string;
  countryCode: string;
  mobile: string;
  gender: string;
  dob: string;
  language: string;
  religion: string;
  caste: string;
  motherTongue: string;
  height: string;
  weight: string;
  maritalStatus: string;
  bodyType: string;
  city: string;
  profileImage: File | null;
  primaryEducation: string;
  highestEducation: string;
  profession: string;
  physicallyChallenged: boolean;
  liveWithFamily: boolean;
  interests: string[];
  traits: string[];
  diets: string[];
  photos?: string[];
  personalityTraits?: string[];
  dietPreference?: string[];
  income: {
    amount: number;
    type: "Monthly" | "Yearly";
  } | null;
  cv: File | null;
}

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<number>(() => {
    return location.state?.step ?? 1;
  });
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<Date | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [userId, setUserId] = useState<string | null>(() => {
    return location.state?.userId ?? null;
  });

  const [formData, setFormData] = useState<RegistrationData>({
    accountFor: "",
    fullName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    gender: "",
    dob: "",
    language: "",
    religion: "",
    caste: "",
    motherTongue: "",
    height: "",
    weight: "",
    maritalStatus: "",
    bodyType: "",
    city: "",
    profileImage: null,
    primaryEducation: "",
    highestEducation: "",
    profession: "",
    physicallyChallenged: false,
    liveWithFamily: true,
    interests: [],
    traits: [],
    diets: [],
    income: null,
    cv: null,
  });
  const totalSteps = 5;
  const [currentSlide, setCurrentSlide] = useState(0);

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Preload hero images for smooth transitions
  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-rotate hero background slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const progress = (currentStep / totalSteps) * 100;

  const handleSendOtp = async () => {
    if (!formData.email || !formData.mobile) {
      toast.error("Email and Mobile number are required");
      return;
    }

    try {
      setSendingOtp(true);

      // ✅ Check availability first
      await Axios.post("/api/users/check-availability", {
        email: formData.email,
        mobile: formData.mobile,
      });

      // ✅ If available → send OTP
      await sendRegistrationOtp(formData.email);

      setOtpSent(true);
      setShowOTPVerification(true);

      toast.success("OTP sent to email");
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";

      toast.error(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const getRequiredFieldsForStep = (
    step: number,
  ): (keyof RegistrationData)[] => {
    switch (step) {
      case 1:
        return [
          "accountFor",
          "fullName",
          "email",
          "countryCode",
          "mobile",
          "gender",
        ];
      case 2:
        return ["religion", "caste", "motherTongue"];
      case 3:
        return ["height", "weight", "maritalStatus", "bodyType", "city"];
      case 4:
        return ["highestEducation", "primaryEducation", "profession"];
      case 5:
        return [];
      default:
        return [];
    }
  };

  const checkStepValidity = (step: number): boolean => {
    const requiredFields = getRequiredFieldsForStep(step);

    return requiredFields.every((field) => {
      const value = formData[field];

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "string") {
        return value.trim() !== "";
      }

      if (typeof value === "object" && value !== null) {
        return true; // for income or future objects
      }

      return false;
    });
  };

  useEffect(() => {
    setIsStepValid(checkStepValidity(currentStep));
  }, [formData, currentStep]);

  const updateFormData = (
    field: keyof RegistrationData,
    value: string | string[] | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // On Step 1, show OTP verification instead of going to Step 2
    if (currentStep === 1 && !isOTPVerified) {
      setShowOTPVerification(true);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setStepErrors({});
    }
  };

  const handleBackFromOTP = () => {
    setShowOTPVerification(false);
    setOtpSent(false);
    setIsOTPVerified(false);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // If going back to step 1, keep OTP verified status
      setCurrentStep(currentStep - 1);
      setStepErrors({});
    }
  };

  const handleOTPVerified = async (otp: string, password: string) => {
    try {
      // 1️⃣ Verify OTP & create user
      const res = await verifyRegistrationOtp({
        email: formData.email,
        otp,
        password,
      });

      const userId = res.data.user._id;
      setUserId(userId);

      // 2️⃣ SAVE STEP-1 DATA IMMEDIATELY
      await completeUserProfile(userId, {
        fullName: formData.fullName,
        gender:
          formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
        accountFor:
          formData.accountFor.charAt(0).toUpperCase() +
          formData.accountFor.slice(1),
        mobile: formData.mobile,
        countryCode: formData.countryCode,
      });

      setIsOTPVerified(true);
      setShowOTPVerification(false);
      setCurrentStep(2);

      toast.success("Account created successfully");
    } catch (err: any) {
      const message = err.response?.data?.message || "OTP verification failed";

      toast.error(message);

      if (
        message.toLowerCase().includes("phone") ||
        message.toLowerCase().includes("email")
      ) {
        setShowOTPVerification(false);
        setCurrentStep(1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User not created");
      return;
    }

    if (!consentAccepted) {
      toast.error("Privacy consent is required");
      return;
    }

    try {
      setSubmitting(true);

      // 🔥 1️⃣ Upload profile image to S3 first (if exists)
      if (formData.profileImage) {
        const form = new FormData();
        form.append("photo", formData.profileImage);

        await Axios.post(`/api/users/${userId}/photos`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (formData.cv) {
        const cvForm = new FormData();
        cvForm.append("cv", formData.cv);
        await Axios.post(`/api/users/${userId}/cv`, cvForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 🔥 2️⃣ Complete profile
      await completeUserProfile(userId, {
        religion: formData.religion,
        caste: formData.caste,
        motherTongue: formData.motherTongue,
        heightCm: Number(formData.height),
        weightKg: Number(formData.weight),
        dob: formData.dob,
        maritalStatus: formData.maritalStatus,
        bodyType: formData.bodyType,
        city: formData.city,
        highestEducation: formData.highestEducation,
        primaryEducation: formData.primaryEducation,
        profession: formData.profession,
        interests: formData.interests,
        personalityTraits: formData.traits,
        dietPreference: formData.diets,
        physicallyChallenged: formData.physicallyChallenged,
        liveWithFamily: formData.liveWithFamily,
        income: formData.income,
      });

      toast.success("Profile completed successfully");
      navigate("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to complete profile";

      toast.error(message);
    } finally {
      setSubmitting(false); // 🔥 stop loader
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            errors={stepErrors}
            formData={formData}
            updateFormData={updateFormData}
            otpSent={otpSent}
          />
        );
      case 2:
        return <StepTwo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return (
          <StepThree
            errors={stepErrors}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return <StepFour formData={formData} updateFormData={updateFormData} />;
      case 5:
        return (
          <StepFive
            // errors={stepErrors}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return (
          <StepOne
            errors={stepErrors}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
    }
  };

  const isLastStep = currentStep === totalSteps;
  const canProceed = isLastStep || isStepValid;

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      desc: "100% authenticated members",
    },
    { icon: Users, title: "Smart Matching", desc: "AI-powered compatibility" },
    { icon: Lock, title: "Complete Privacy", desc: "Your data stays secure" },
    {
      icon: CheckCircle,
      title: "Premium Support",
      desc: "24/7 dedicated assistance",
    },
  ];

  const handleConsentAgree = (timestamp: Date) => {
    setConsentAccepted(true);
    setConsentTimestamp(timestamp);
    setShowConsentModal(false);
  };

  const handleConsentDecline = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        open={showConsentModal}
        onAgree={handleConsentAgree}
        onDecline={handleConsentDecline}
      />

      {/* Hero Carousel Background - Same as Home Page */}
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

        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Floating Brand Logo */}
      <FloatingBrandLogo variant="auth" className="z-[5]" />

      {/* Desktop/Tablet Close Button - Top Right of Screen */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Content Layer */}
      <div
        className={`relative z-10 min-h-screen flex flex-col lg:flex-row transition-all duration-300 ${showConsentModal ? "blur-sm pointer-events-none select-none" : ""}`}
      >
        {/* Left Section - Marketing Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg">
            {/* Brand */}
            <Link to="/" className="inline-block mb-10">
              <span className="text-2xl font-bold">
                Love<span className="text-primary">&</span>Ring
              </span>
            </Link>

            {/* Main Heading */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Register Now
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                For Free
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join thousands of verified profiles finding their perfect match.
              Our platform offers secure, private, and meaningful connections
              tailored to your preferences.
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
                    <h3 className="font-semibold text-white text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white/60 text-xs">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Login Link */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Login here
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
                Create Your <span className="text-primary">Profile</span>
              </h1>
              <p className="text-white/70 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
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
                    {currentStep === 1 && "Basic Details"}
                    {currentStep === 2 && "Background Info"}
                    {currentStep === 3 && "Personal Details"}
                    {currentStep === 4 && "Education & Work"}
                    {currentStep === 5 && "Final Steps"}
                  </span>
                </div>

                {/* Step Dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div key={i} className="flex-1 flex items-center">
                      <div
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i + 1 < currentStep
                            ? "bg-gradient-to-r from-primary to-secondary"
                            : i + 1 === currentStep
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
                {showOTPVerification ? (
                  <OTPVerification
                    email={formData.email}
                    onVerified={handleOTPVerified}
                    onBack={handleBackFromOTP}
                  />
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStep()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Validation Message & Navigation - Hide during OTP verification */}
              {!showOTPVerification && (
                <>
                  {!canProceed && !isLastStep && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 mt-3 py-1.5 px-2.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-600 dark:text-amber-400"
                    >
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <p className="text-[11px]">
                        Please fill all required fields to continue
                      </p>
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
                      onClick={
                        isLastStep
                          ? handleSubmit
                          : currentStep === 1
                            ? handleSendOtp
                            : nextStep
                      }
                      disabled={
                        !canProceed ||
                        (currentStep === 1 && sendingOtp) ||
                        (isLastStep && submitting)
                      }
                      className={`gap-1.5 rounded-lg px-6 h-9 text-sm ${
                        canProceed
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      {currentStep === 1 && sendingOtp ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : isLastStep && submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : isLastStep ? (
                        "Submit"
                      ) : currentStep === 1 ? (
                        "Get OTP"
                      ) : (
                        "Continue"
                      )}

                      {!sendingOtp && !submitting && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </Card>

            {/* Help Text */}
            <div className="text-center mt-4 text-xs text-white/60">
              <p>
                Need help creating your account?{" "}
                <Link
                  to="/support?from=registration"
                  className="text-primary hover:underline"
                >
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

export default Register;
