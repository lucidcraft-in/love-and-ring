import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";

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
  profileImage: string;
  education: string;
  profession: string;
  interests: string[];
  traits: string[];
  diets: string[];
}

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    accountFor: "",
    fullName: "",
    email: "",
    countryCode: "",
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
    profileImage: "",
    education: "",
    profession: "",
    interests: [],
    traits: [],
    diets: [],
  });
  const totalSteps = 5;

  const progress = (currentStep / totalSteps) * 100;

  const getRequiredFieldsForStep = (step: number): (keyof RegistrationData)[] => {
    switch (step) {
      case 1:
        return ["accountFor", "fullName", "email", "countryCode", "mobile", "gender", "dob", "language"];
      case 2:
        return ["religion", "caste", "motherTongue"];
      case 3:
        return ["height", "weight", "maritalStatus", "bodyType", "city"];
      case 4:
        return ["education", "profession"];
      case 5:
        return [];
      default:
        return [];
    }
  };

  const checkStepValidity = (step: number): boolean => {
    const requiredFields = getRequiredFieldsForStep(step);
    return requiredFields.every(field => {
      const value = formData[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.trim() !== "";
    });
  };

  useEffect(() => {
    setIsStepValid(checkStepValidity(currentStep));
  }, [formData, currentStep]);

  const updateFormData = (field: keyof RegistrationData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setStepErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setStepErrors({});
    }
  };

  const handleSubmit = () => {
    toast.success("Registration successful!");
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne errors={stepErrors} formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StepTwo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepThree errors={stepErrors} formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepFour formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <StepFive errors={stepErrors} formData={formData} updateFormData={updateFormData} />;
      default:
        return <StepOne errors={stepErrors} formData={formData} updateFormData={updateFormData} />;
    }
  };

  const isLastStep = currentStep === totalSteps;
  const canProceed = isLastStep || isStepValid;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Dark Background with Content */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white p-12 xl:p-16 flex-col justify-center relative overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          onClick={() => navigate('/')}
        >
          <X className="h-5 w-5" />
        </Button>

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
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Join thousands of verified profiles finding their perfect match. 
            Our platform offers secure, private, and meaningful connections 
            tailored to your preferences.
          </p>

          {/* Features List */}
          <div className="space-y-4 mb-10">
            {[
              "100% Verified Profiles",
              "Advanced Matching Algorithm",
              "Secure & Private Communication",
              "Dedicated Relationship Support"
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Login Link */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Section - Registration Form */}
      <div className="flex-1 lg:w-[55%] bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 sm:p-6 lg:p-10 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                Love<span className="text-primary">&</span>Ring
              </span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Create Your <span className="text-primary">Profile</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 right-4 bg-background/80 hover:bg-background rounded-full shadow-md"
            onClick={() => navigate('/')}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Form Card */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-card/95 backdrop-blur-sm shadow-2xl border-border/50 rounded-2xl lg:rounded-3xl">
            {/* Step Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Step {currentStep} of {totalSteps}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {currentStep === 1 && "Basic Details"}
                  {currentStep === 2 && "Background Info"}
                  {currentStep === 3 && "Personal Details"}
                  {currentStep === 4 && "Education & Work"}
                  {currentStep === 5 && "Final Steps"}
                </span>
              </div>
              
              {/* Step Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className="flex-1 flex items-center">
                    <div 
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        i + 1 < currentStep 
                          ? 'bg-gradient-to-r from-primary to-secondary' 
                          : i + 1 === currentStep 
                            ? 'bg-gradient-to-r from-primary to-secondary' 
                            : 'bg-muted'
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
            {!canProceed && !isLastStep && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">Please fill all required fields to continue</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2 rounded-xl px-6 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={isLastStep ? handleSubmit : nextStep}
                disabled={!canProceed}
                className={`gap-2 rounded-xl px-8 ${
                  canProceed 
                    ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {isLastStep ? "Submit" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Need help? Contact us at <span className="text-primary">support@lovering.com</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
