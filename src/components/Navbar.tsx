import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import coupleLogo from "@/assets/couple-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import StepOne from "@/components/registration/StepOne";
import StepTwo from "@/components/registration/StepTwo";
import StepThree from "@/components/registration/StepThree";
import StepFour from "@/components/registration/StepFour";
import StepFive from "@/components/registration/StepFive";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});
  const { isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();
  const totalSteps = 5;

  const progress = (currentStep / totalSteps) * 100;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Pricing", path: "/pricing" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
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
    login({ email: "user@example.com", name: "User" });
    toast.success("Registration successful!");
    setShowRegistration(false);
    setCurrentStep(1);
    navigate('/dashboard');
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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={coupleLogo} alt="Love & Ring" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold gradient-text">Love & Ring</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button variant="ghost" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button 
                    onClick={() => setShowRegistration(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    Register Now
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-4"
              >
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    {isAuthenticated ? (
                      <Button variant="ghost" onClick={handleLogout} className="gap-2 justify-start">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" asChild>
                          <Link to="/login">Sign In</Link>
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowRegistration(true);
                            setIsOpen(false);
                          }}
                          className="bg-gradient-to-r from-primary to-secondary"
                        >
                          Register Now
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Registration Dialog */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Create Your <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep} of {totalSteps}: Complete your registration
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Basic Details</span>
              <span>Basic Info</span>
              <span>Personal</span>
              <span>Education</span>
              <span>Additional</span>
            </div>
          </div>

          {/* Form */}
          <Card className="p-6 glass-card">
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
            <div className="flex justify-between mt-6 pt-4 border-t">
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
