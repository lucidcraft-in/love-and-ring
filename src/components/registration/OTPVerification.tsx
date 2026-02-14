import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Mail,
  RotateCcw,
  CheckCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerified: (otp: string, password: string) => void;
  onBack: () => void;
}

const OTPVerification = ({
  email,
  onVerified,
  onBack,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  // Password state
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);

  // Mask email for display
  const maskedEmail =
    email.length > 4
      ? email.slice(0, 3) + "***" + email.slice(email.indexOf("@"))
      : email;

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0 && !isOTPVerified) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isOTPVerified) {
      setCanResend(true);
    }
  }, [resendTimer, isOTPVerified]);

  // Password validation
  const validatePassword = (pass: string): boolean => {
    const hasMinLength = pass.length >= 4;
    const hasCapitalLetter = /[A-Z]/.test(pass);

    return hasMinLength && hasCapitalLetter;
  };

  const isPasswordValid = validatePassword(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const canCreatePassword = isPasswordValid && passwordsMatch;

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate OTP verification (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo, accept any 6-digit OTP
    setIsVerifying(false);
    setIsOTPVerified(true);
  };

  const handleCreatePassword = async () => {
    if (!canCreatePassword) {
      if (!isPasswordValid) {
        setPasswordError(
          "Password must be exactly 4 characters and include at least one capital letter",
        );
      } else if (!passwordsMatch) {
        setPasswordError("Passwords do not match");
      }
      return;
    }

    setIsCreatingPassword(true);
    setPasswordError("");

    // Simulate password creation (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsCreatingPassword(false);
    onVerified(otp, password);
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setResendTimer(120);
    setOtp("");
    setError("");

    // Simulate resend (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <AnimatePresence mode="wait">
        {!isOTPVerified ? (
          /* OTP Verification Section */
          <motion.div
            key="otp-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-lg font-bold mb-1">Verify Your Email</h2>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit verification code sent to
              </p>
              <p className="font-semibold text-foreground mt-1 text-sm">
                {maskedEmail}
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex flex-col items-center gap-3">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError("");
                }}
              >
                <InputOTPGroup className="flex gap-3 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="
        w-12 h-14 
        text-xl font-semibold text-center
        rounded-xl
        border border-gray-300
        bg-white/70 backdrop-blur-sm
        shadow-sm
        transition-all duration-200 ease-in-out
        
        focus:border-indigo-500
        focus:ring-4
        focus:ring-indigo-100
        focus:shadow-md
        focus:scale-105
        
        hover:border-indigo-300
      "
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {error && (
                <p className="text-destructive text-xs text-center">{error}</p>
              )}
            </div>

            {/* Resend Timer */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOTP}
                  className="text-primary hover:text-primary/80 gap-2 h-8 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Resend OTP
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Resend OTP in{" "}
                  <span className="font-semibold text-foreground">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isVerifying}
                className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold rounded-lg shadow-lg shadow-primary/25 gap-2 text-sm"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Verify OTP
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground h-8 text-xs"
              >
                Edit Email Address
              </Button>
            </div>

            {/* Security Note */}
            <p className="text-[11px] text-center text-muted-foreground">
              By verifying, you confirm ownership of this email address.
            </p>
          </motion.div>
        ) : (
          /* Password Creation Section */
          <motion.div
            key="password-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Email Verified
                </span>
              </div>
              <h2 className="text-lg font-bold mb-1">Create Password</h2>
              <p className="text-muted-foreground text-sm">
                Set a secure password for your account
              </p>
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="h-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Password must be at least 4 characters and include at least
                  one capital letter.
                </p>
                {/* Password Strength Indicators */}
                {password.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    <div
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        password.length >= 4 ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                    <div
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        /[A-Z]/.test(password) ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="h-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-[11px] flex items-center gap-1 ${
                      passwordsMatch ? "text-green-600" : "text-destructive"
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </>
                    ) : (
                      "Passwords do not match"
                    )}
                  </p>
                )}
              </div>

              {passwordError && (
                <p className="text-destructive text-xs text-center">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <Button
                onClick={handleCreatePassword}
                disabled={!canCreatePassword || isCreatingPassword}
                className={`w-full h-10 font-semibold rounded-lg gap-2 text-sm transition-all ${
                  canCreatePassword
                    ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isCreatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Create Password & Continue
                  </>
                )}
              </Button>
            </div>

            {/* Security Note */}
            <p className="text-[11px] text-center text-muted-foreground">
              Your password is encrypted and securely stored.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OTPVerification;
