import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const totalSteps = 5;

  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};
    
    // Basic validation - in production this would check actual form values
    switch (step) {
      case 1:
        // Validate basic details
        break;
      case 2:
        // Validate basic info
        break;
      case 3:
        // Validate personal details
        break;
      case 4:
        // Validate education
        break;
      case 5:
        // Validate additional details
        break;
    }
    
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
      toast.success("Registration successful!");
      navigate('/dashboard');
    }
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
                onClick={currentStep === totalSteps ? handleSubmit : nextStep}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {currentStep === totalSteps ? "Submit" : "Continue"}
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
