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
  Smartphone,
  RotateCcw,
  CheckCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ChevronLeft,
  Circle,
} from "lucide-react";
import { verifyRegistrationOtpOnly } from "@/services/UserServices";
import { validatePassword } from "@/utils/validation";

interface OTPVerificationProps {
  email: string;
  mobile?: string;
  countryCode?: string;
  onVerified: (otp: string, password: string) => void;
  onBack: () => void;
  onResendOtp?: () => Promise<void>;
}

const OTPVerification = ({
  email,
  mobile = "",
  countryCode = "+91",
  onVerified,
  onBack,
  onResendOtp,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
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

  // Mask email
  const maskedEmail =
    email.length > 4
      ? email.slice(0, 3) + "***" + email.slice(email.indexOf("@"))
      : email;

  // Mask mobile
  const cleanMobile = mobile.replace(/[^0-9]/g, "");
  const last4 = cleanMobile.slice(-4);
  const maskedMobile = cleanMobile ? `${countryCode} *****${last4}` : "";

  useEffect(() => {
    if (resendTimer > 0 && !isOTPVerified) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isOTPVerified) {
      setCanResend(true);
    }
  }, [resendTimer, isOTPVerified]);

  const passwordValidation = validatePassword(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const canCreatePassword = passwordValidation.isValid && passwordsMatch;

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await verifyRegistrationOtpOnly({ email, otp });
      setIsVerifying(false);
      setIsOTPVerified(true);
    } catch (err: any) {
      setIsVerifying(false);
      const msg = err.response?.data?.message || err.message || "Invalid OTP";
      setError(msg);
    }
  };

  const handleCreatePassword = async () => {
    if (!canCreatePassword) {
      if (!passwordValidation.isValid) {
        setPasswordError(
          "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.",
        );
      } else if (!passwordsMatch) {
        setPasswordError("Passwords do not match");
      }
      return;
    }

    setIsCreatingPassword(true);
    setPasswordError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsCreatingPassword(false);
    onVerified(otp, password);
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setResendTimer(60);
    setOtp("");
    setError("");

    if (onResendOtp) {
      await onResendOtp();
    }
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
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center gap-1">
                <Mail className="w-5 h-5 text-primary" />
                <Smartphone className="w-5 h-5 text-secondary" />
              </div>

              <h2 className="text-lg font-bold mb-1">Enter Verification Code</h2>
              <p className="text-muted-foreground text-xs max-w-xs mx-auto">
                An OTP has been sent to your <strong>Email</strong> and <strong>SMS</strong>. Verify using either code.
              </p>

              {/* Masked Channels Box */}
              <div className="bg-card/80 border border-border/60 rounded-xl p-2.5 my-3 max-w-xs mx-auto text-xs space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-medium truncate">{maskedEmail}</span>
                </div>
                {maskedMobile && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span className="font-medium truncate">{maskedMobile}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4-Digit OTP Input */}
            <div className="flex flex-col items-center gap-3">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError("");
                }}
              >
                <InputOTPGroup className="flex gap-3 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="
                        w-12 h-14 
                        text-xl font-bold text-center
                        rounded-xl
                        border-2 border-primary/40
                        bg-background
                        shadow-sm
                        transition-all duration-200
                        focus:border-primary
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
                  Resend OTP to Email & Phone
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
                disabled={otp.length !== 4 || isVerifying}
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
                    Verify & Continue
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground h-8 text-xs"
              >
                Change Details
              </Button>
            </div>
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
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Verified Successfully
                </span>
              </div>
              <h2 className="text-lg font-bold mb-1">Create Password</h2>
              <p className="text-muted-foreground text-sm">
                Set a secure password for your account
              </p>
            </div>

            <div className="space-y-4">
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
                    className="h-10 pr-10 bg-background/50 border-border/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 px-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
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
                    className="h-10 pr-10 bg-background/50 border-border/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 w-10 px-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
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
                  {confirmPassword.length > 0 && (
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

              {passwordError && (
                <p className="text-destructive text-xs text-center font-medium">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <Button
                onClick={handleCreatePassword}
                disabled={!canCreatePassword || isCreatingPassword}
                className="w-full h-10 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg gap-2 text-sm"
              >
                {isCreatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Continuing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Save Password & Continue
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setIsOTPVerified(false);
                    setError("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1 h-8"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back to OTP
                </Button>

                <Button
                  variant="ghost"
                  type="button"
                  onClick={onBack}
                  className="text-xs text-muted-foreground hover:text-foreground h-8"
                >
                  Change Email / Details
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OTPVerification;