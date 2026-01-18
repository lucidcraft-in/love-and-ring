import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, RotateCcw, CheckCircle, Loader2 } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ email, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  // Mask email for display
  const maskedEmail = email.length > 4 
    ? email.slice(0, 3) + "***" + email.slice(email.indexOf("@")) 
    : email;

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate OTP verification (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, accept any 6-digit OTP
    setIsVerifying(false);
    onVerified();
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setResendTimer(30);
    setOtp("");
    setError("");
    
    // Simulate resend (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <motion.div
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
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={1} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={2} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={3} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={4} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={5} className="w-10 h-11 sm:w-11 sm:h-12 text-lg font-semibold border-border/50" />
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
            Resend OTP in <span className="font-semibold text-foreground">{resendTimer}s</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <Button
          onClick={handleVerify}
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
              Verify & Continue
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
  );
};

export default OTPVerification;
