import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 right-0 z-20 bg-background/80 hover:bg-background rounded-full shadow-lg"
            onClick={() => navigate('/')}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create Your <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Step {currentStep} of {totalSteps}: Complete your registration
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Basic Details</span>
              <span>Basic Info</span>
              <span>Personal</span>
              <span>Education</span>
              <span>Additional</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 glass-card">
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
                className="flex items-center gap-2 mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">Please fill all required fields to continue</p>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={isLastStep ? handleSubmit : nextStep}
                disabled={!canProceed}
                className={`gap-2 ${canProceed ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
              >
                {isLastStep ? "Submit" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>Need help? Contact us at support@lovering.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
