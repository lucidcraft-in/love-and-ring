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
  WifiOff,
  RefreshCw,
  Save,
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
import { completeUserProfile, verifyRegistrationOtp, registerFullUserApi } from "@/services/UserServices";
import Axios from "@/axios/axios";
import PrivacyConsentModal from "@/components/registration/PrivacyConsentModal";
import { trackUserActivity, flushPendingActivityLogs } from "@/utils/activityTracker";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

export interface RegistrationData {
  accountFor: string;
  fullName: string;
  email: string;
  password?: string;
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
  alternateMobile?: string;
  primaryEducation: string;
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
    password: "",
    countryCode: "+91",
    mobile: "",
    alternateMobile: "",
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

  // Network error retry & draft auto-save state
  const [submissionError, setSubmissionError] = useState<{
    message: string;
    action: "submit" | "otp";
  } | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [draftRestored, setDraftRestored] = useState(false);

  // Listen to network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      flushPendingActivityLogs();
      toast.success("Network connection restored! You can now retry your registration submission.", {
        id: "connection-status-toast",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Network connection lost! Your registration details are saved safely as a draft.", {
        id: "connection-status-toast",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Restore draft and pre-fill user profile data on mount
  useEffect(() => {
    let draftData: Partial<RegistrationData> = {};
    let draftStep: number | null = null;
    let draftOTPVerified = false;

    // 1. Read draft from localStorage if present
    const savedDraftStr = localStorage.getItem("registration_draft");
    const tempPassword = sessionStorage.getItem("register_temp_password");
    if (savedDraftStr) {
      try {
        const savedDraft = JSON.parse(savedDraftStr);
        if (savedDraft.formData) {
          draftData = savedDraft.formData;
          if (savedDraft.currentStep && savedDraft.currentStep > 1) {
            draftStep = savedDraft.currentStep;
          }
          if (savedDraft.isOTPVerified) {
            draftOTPVerified = true;
          }
          setDraftRestored(true);
        }
      } catch (err) {
        console.error("Failed to restore draft:", err);
      }
    }

    // 2. Read saved user profile from localStorage if present
    let userData: Partial<RegistrationData> = {};
    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr && savedUserStr !== "undefined") {
      try {
        const u = JSON.parse(savedUserStr);
        if (u && u._id) {
          setUserId(u._id);
          setIsOTPVerified(true);
          userData = {
            accountFor: u.accountFor ? u.accountFor.toLowerCase() : "",
            fullName: u.fullName || u.name || "",
            email: u.email || "",
            countryCode: u.countryCode || "+91",
            mobile: u.mobile || u.phone || "",
            gender: u.gender ? u.gender.toLowerCase() : "",
            dob: u.dob || (u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : ""),
            language: u.language || u.preferredLanguage || "",
            religion: typeof u.religion === 'object' ? u.religion?._id : (u.religion || ""),
            caste: typeof u.caste === 'object' ? u.caste?._id : (u.caste || ""),
            motherTongue: typeof u.motherTongue === 'object' ? u.motherTongue?._id : (u.motherTongue || ""),
            height: u.height ? String(u.height) : u.heightCm ? String(u.heightCm) : "",
            weight: u.weight ? String(u.weight) : u.weightKg ? String(u.weightKg) : "",
            maritalStatus: u.maritalStatus || "",
            bodyType: u.bodyType || "",
            city: typeof u.city === 'object' ? u.city?._id : (u.city || ""),
            primaryEducation: typeof u.primaryEducation === 'object' ? u.primaryEducation?._id : (u.primaryEducation || u.education || ""),
            profession: typeof u.profession === 'object' ? u.profession?._id : (u.profession || ""),
            physicallyChallenged: u.physicallyChallenged ?? false,
            liveWithFamily: u.livingWithFamily ?? u.liveWithFamily ?? true,
            interests: Array.isArray(u.interests) ? u.interests : [],
            traits: Array.isArray(u.traits || u.personalityTraits) ? (u.traits || u.personalityTraits) : [],
            diets: Array.isArray(u.diets || u.dietPreference) ? (u.diets || u.dietPreference) : [],
            income: u.income || null,
          };
        }
      } catch (err) {
        console.error("Error pre-filling profile data:", err);
      }
    }

    // 3. Merge: prefer draftData if filled, fallback to userData, fallback to initial state
    setFormData((prev) => {
      const merged = { ...prev };
      Object.keys(prev).forEach((k) => {
        const key = k as keyof RegistrationData;
        const valDraft = draftData[key];
        const valUser = userData[key];

        if (valDraft !== undefined && valDraft !== null && valDraft !== "" && (!Array.isArray(valDraft) || valDraft.length > 0)) {
          (merged as any)[key] = valDraft;
        } else if (valUser !== undefined && valUser !== null && valUser !== "" && (!Array.isArray(valUser) || valUser.length > 0)) {
          (merged as any)[key] = valUser;
        }
      });

      if (tempPassword || draftData.password) {
        merged.password = tempPassword || draftData.password || merged.password;
      }
      return merged;
    });

    if (draftOTPVerified || location.state?.userId) {
      setIsOTPVerified(true);
    }

    if (location.state?.step) {
      setCurrentStep(location.state.step);
    } else if (draftStep && draftStep > 1) {
      setCurrentStep(draftStep);
    }
  }, [location.state?.userId, location.state?.step]);

  // Persist form data to localStorage as draft whenever formData or currentStep changes
  useEffect(() => {
    const { profileImage, cv, ...serializableFormData } = formData;
    if (formData.password) {
      sessionStorage.setItem("register_temp_password", formData.password);
    }
    const draftPayload = {
      formData: serializableFormData,
      currentStep,
      isOTPVerified,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("registration_draft", JSON.stringify(draftPayload));
  }, [formData, currentStep, isOTPVerified]);

  const clearDraft = () => {
    localStorage.removeItem("registration_draft");
    setDraftRestored(false);
    toast.success("Draft cleared. You can start fresh!");
  };

  useEffect(() => {
    heroSlides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  /* 👈 FIX: Pass email, mobile, and countryCode when requesting OTP */
  const handleSendOtp = async () => {
    if (!formData.email || !formData.mobile) {
      toast.error("Email and Mobile number are required");
      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_STEP_1_VALIDATION_ERROR",
        step: 1,
        status: "ERROR",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        errorMessage: "Email and Mobile number are required for OTP",
      });
      return;
    }

    try {
      setSendingOtp(true);
      setSubmissionError(null);

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_SEND_OTP_REQUEST",
        step: 1,
        status: "INFO",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
      });

      // 1. Check availability
      await Axios.post("/api/users/check-availability", {
        email: formData.email,
        mobile: formData.mobile,
      });

      // 2. Send OTP with email, mobile & countryCode
      await Axios.post("/api/users/send-otp", {
        email: formData.email,
        mobile: formData.mobile,
        countryCode: formData.countryCode || "+91",
      });

      setOtpSent(true);
      setShowOTPVerification(true);

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_SEND_OTP_SUCCESS",
        step: 1,
        status: "SUCCESS",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
      });

      toast.success("OTP sent to your Email and Mobile number");
    } catch (err: any) {
      const isNetErr = !err.response || err.code === "ERR_NETWORK" || !navigator.onLine;
      const message = isNetErr
        ? "Network connection error while sending OTP. Your data is saved locally. Please check your connection and retry."
        : err.response?.data?.message || "Failed to send OTP";

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_SEND_OTP_ERROR",
        step: 1,
        status: "ERROR",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        errorMessage: message,
      });

      setSubmissionError({ message, action: "otp" });
      toast.error(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const getRequiredFieldsForStep = (
    step: number
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
        return ["religion", "motherTongue"];
      case 3:
        return ["height", "weight", "maritalStatus", "bodyType", "city"];
      case 4:
        return ["primaryEducation", "profession"];
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
        return true;
      }

      return false;
    });
  };

  useEffect(() => {
    setIsStepValid(checkStepValidity(currentStep));
  }, [formData, currentStep]);

  const updateFormData = (
    field: keyof RegistrationData,
    value: string | string[] | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const requiredFields = getRequiredFieldsForStep(currentStep);
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "string") return value.trim() === "";
      return !value;
    });

    if (missingFields.length > 0) {
      trackUserActivity({
        category: "REGISTRATION",
        action: `REGISTRATION_STEP_${currentStep}_VALIDATION_ERROR`,
        step: currentStep,
        status: "ERROR",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        errorMessage: `Step ${currentStep} incomplete. Missing fields: ${missingFields.join(", ")}`,
        details: { missingFields },
      });
    }

    if (currentStep === 1 && !isOTPVerified) {
      setShowOTPVerification(true);
      return;
    }

    if (currentStep < totalSteps) {
      trackUserActivity({
        category: "REGISTRATION",
        action: `REGISTRATION_STEP_${currentStep}_NEXT`,
        step: currentStep,
        status: "SUCCESS",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        details: { nextStep: currentStep + 1 },
      });
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
      setCurrentStep(currentStep - 1);
      setStepErrors({});
    }
  };

  const handleOTPVerified = async (otp: string, password: string) => {
    try {
      if (password) {
        sessionStorage.setItem("register_temp_password", password);
      }
      setFormData((prev) => ({ ...prev, password }));
      setIsOTPVerified(true);
      setShowOTPVerification(false);
      setCurrentStep(2);

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_OTP_VERIFIED",
        step: 1,
        status: "SUCCESS",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
      });

      // Save password and initial profile details into MongoDB directly at Step 1
      try {
        const otpRes = await verifyRegistrationOtp({
          email: formData.email,
          otp,
          password,
          accountFor: formData.accountFor
            ? formData.accountFor.charAt(0).toUpperCase() + formData.accountFor.slice(1)
            : "Self",
          fullName: formData.fullName,
          mobile: formData.mobile,
          alternateMobile: formData.alternateMobile,
          countryCode: formData.countryCode || "+91",
          gender: formData.gender
            ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)
            : "Male",
        });
        if (otpRes?.data?.user?._id) {
          setUserId(otpRes.data.user._id);
        }
      } catch (saveErr) {
        console.warn("OTP/password DB sync warning:", saveErr);
      }

      toast.success("OTP verified. Please complete your registration details.");
    } catch (err: any) {
      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_OTP_VERIFICATION_FAILED",
        step: 1,
        status: "ERROR",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        errorMessage: err.message || "Failed to proceed after OTP verification",
      });
      toast.error("Failed to proceed after OTP verification");
    }
  };

  const handleSubmit = async () => {
    if (!consentAccepted) {
      toast.error("Privacy consent is required");
      return;
    }

    try {
      setSubmitting(true);
      setSubmissionError(null);

      const finalPassword =
        formData.password ||
        sessionStorage.getItem("register_temp_password") ||
        "";

      const submitData = new FormData();
      submitData.append("email", formData.email);
      if (finalPassword) {
        submitData.append("password", finalPassword);
      }
      submitData.append("fullName", formData.fullName);
      submitData.append(
        "accountFor",
        formData.accountFor
          ? formData.accountFor.charAt(0).toUpperCase() + formData.accountFor.slice(1)
          : "Self"
      );
      submitData.append("mobile", formData.mobile);
      submitData.append("countryCode", formData.countryCode || "+91");
      if (formData.alternateMobile) {
        submitData.append("alternateMobile", formData.alternateMobile);
      }
      submitData.append(
        "gender",
        formData.gender
          ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)
          : "Male"
      );

      if (formData.dob) submitData.append("dob", formData.dob);
      if (formData.religion) submitData.append("religion", formData.religion);
      if (formData.caste) submitData.append("caste", formData.caste);
      if (formData.motherTongue) submitData.append("motherTongue", formData.motherTongue);
      if (formData.height) submitData.append("height", formData.height);
      if (formData.weight) submitData.append("weight", formData.weight);
      if (formData.maritalStatus) submitData.append("maritalStatus", formData.maritalStatus);
      if (formData.bodyType) submitData.append("bodyType", formData.bodyType);
      if (formData.city) submitData.append("city", formData.city);
      if (formData.primaryEducation) submitData.append("primaryEducation", formData.primaryEducation);
      if (formData.profession) submitData.append("profession", formData.profession);

      submitData.append("physicallyChallenged", String(formData.physicallyChallenged));
      submitData.append("livingWithFamily", String(formData.liveWithFamily));

      if (formData.interests && formData.interests.length > 0) {
        formData.interests.forEach((item) => submitData.append("interests[]", item));
      }
      if (formData.traits && formData.traits.length > 0) {
        formData.traits.forEach((item) => submitData.append("personalityTraits[]", item));
      }
      if (formData.diets && formData.diets.length > 0) {
        formData.diets.forEach((item) => submitData.append("dietPreference[]", item));
      }
      if (formData.income) {
        submitData.append("income[amount]", String(formData.income.amount));
        submitData.append("income[type]", formData.income.type);
      }

      if (formData.profileImage) {
        submitData.append("photo", formData.profileImage);
      }
      if (formData.cv) {
        submitData.append("cv", formData.cv);
      }

      submitData.append("profileStatus", "COMPLETED");

      let res;
      if (userId && localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        res = await Axios.put(`/api/users/${userId}`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        res = await registerFullUserApi(submitData);
      }

      const updatedUser = res.data?.user || res.data;
      if (updatedUser) {
        const currentSaved = JSON.parse(localStorage.getItem("user") || "{}");
        const mergedUser = {
          ...currentSaved,
          ...updatedUser,
          profileStatus: "COMPLETED",
        };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        window.dispatchEvent(new Event("userProfileUpdated"));
      }

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_SUBMIT_SUCCESS",
        step: 5,
        status: "SUCCESS",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
      });

      localStorage.removeItem("registration_draft");
      sessionStorage.removeItem("register_temp_password");

      if (userId && localStorage.getItem("token")) {
        toast.success("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        toast.success("Profile created successfully!");
        navigate("/login", {
          state: {
            email: formData.email,
            password: finalPassword,
            fromRegistration: true,
          },
        });
      }
    } catch (err: any) {
      const isNetErr = !err.response || err.code === "ERR_NETWORK" || !navigator.onLine;
      const message = isNetErr
        ? "Network connection lost during submission. Your details are saved safely. Click Retry below to resubmit."
        : err.response?.data?.message || "Failed to complete registration";

      trackUserActivity({
        category: "REGISTRATION",
        action: "REGISTRATION_SUBMIT_FAILED",
        step: 5,
        status: "ERROR",
        userEmail: formData.email,
        userPhone: formData.mobile,
        userFullName: formData.fullName,
        errorMessage: message,
      });

      setSubmissionError({ message, action: "submit" });
      toast.error(message);
    } finally {
      setSubmitting(false);
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
            isOTPVerified={isOTPVerified || !!userId}
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
      <PrivacyConsentModal
        open={showConsentModal}
        onAgree={handleConsentAgree}
        onDecline={handleConsentDecline}
      />

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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <FloatingBrandLogo variant="auth" className="z-[5]" />

      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      <div
        className={`relative z-10 min-h-screen flex flex-col lg:flex-row transition-all duration-300 ${
          showConsentModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg">
            <Link to="/" className="inline-block mb-10">
              <span className="text-2xl font-bold">
                Love<span className="text-primary">&</span>Ring
              </span>
            </Link>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Register Now
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                For Free
              </span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join thousands of verified profiles finding their perfect match.
              Our platform offers secure, private, and meaningful connections
              tailored to your preferences.
            </p>

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

            <div className="pt-6 border-t border-white/10">
              <p className="text-white/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  state={{ email: formData.email, password: formData.password }}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
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
                  state={{ email: formData.email, password: formData.password }}
                  className="text-primary hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <X className="h-5 w-5" />
            </Button>

            <Card className="relative mt-10 p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
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

                {/* Network status / Offline / Draft / Retry Notifications */}
                <AnimatePresence>
                  {isOffline && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <WifiOff className="h-4 w-4 shrink-0" />
                        <span>You are offline. Form progress is saved locally and will submit once connected.</span>
                      </div>
                    </motion.div>
                  )}

                  {draftRestored && !isOffline && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-center justify-between px-3 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs"
                    >
                      <span className="text-primary font-medium flex items-center gap-1.5">
                        <Save className="h-3.5 w-3.5" />
                        Restored saved registration draft
                      </span>
                      <button
                        type="button"
                        onClick={clearDraft}
                        className="text-[11px] text-muted-foreground hover:text-destructive underline ml-2 font-medium"
                      >
                        Start Fresh
                      </button>
                    </motion.div>
                  )}

                  {submissionError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 p-3.5 bg-destructive/10 border border-destructive/30 rounded-xl text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-destructive">
                              {submissionError.action === "otp"
                                ? "OTP Request Failed"
                                : "Submission Error"}
                            </p>
                            <p className="text-muted-foreground text-[11px] mt-0.5">
                              {submissionError.message}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0"
                          onClick={() => setSubmissionError(null)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() => setSubmissionError(null)}
                          className="h-7 text-[11px] px-2.5"
                        >
                          Dismiss
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          onClick={
                            submissionError.action === "otp"
                              ? handleSendOtp
                              : handleSubmit
                          }
                          disabled={sendingOtp || submitting}
                          className="h-7 text-[11px] px-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-1.5 font-medium"
                        >
                          {sendingOtp || submitting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Retry Now
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {showOTPVerification ? (
                  /* 👈 FIX: Pass mobile, countryCode & onResendOtp props */
                  <OTPVerification
                    email={formData.email}
                    mobile={formData.mobile}
                    countryCode={formData.countryCode}
                    onVerified={handleOTPVerified}
                    onBack={handleBackFromOTP}
                    onResendOtp={handleSendOtp}
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
                          : currentStep === 1 && !isOTPVerified && !userId
                            ? handleSendOtp
                            : nextStep
                      }
                      disabled={
                        !canProceed ||
                        (currentStep === 1 && !isOTPVerified && !userId && sendingOtp) ||
                        (isLastStep && submitting)
                      }
                      className={`gap-1.5 rounded-lg px-6 h-9 text-sm ${
                        canProceed
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      {currentStep === 1 && !isOTPVerified && !userId && sendingOtp ? (
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
                      ) : currentStep === 1 && !isOTPVerified && !userId ? (
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