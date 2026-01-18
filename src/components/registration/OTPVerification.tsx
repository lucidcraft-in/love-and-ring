import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield, RotateCcw, CheckCircle, Loader2 } from "lucide-react";

interface OTPVerificationProps {
  mobile: string;
  countryCode: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ mobile, countryCode, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  // Mask mobile number for display
  const maskedMobile = mobile.length > 4 
    ? mobile.slice(0, 2) + "XXXX" + mobile.slice(-2) 
    : "XXXXXXXX";

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
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Verify Your Number</h2>
        <p className="text-muted-foreground text-sm">
          Enter the 6-digit OTP sent to
        </p>
        <p className="font-semibold text-foreground mt-1">
          {countryCode} {maskedMobile}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center gap-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => {
            setOtp(value);
            setError("");
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
            <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-semibold border-border/50" />
          </InputOTPGroup>
        </InputOTP>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}
      </div>

      {/* Resend Timer */}
      <div className="text-center">
        {canResend ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            className="text-primary hover:text-primary/80 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resend OTP
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Resend OTP in <span className="font-semibold text-foreground">{resendTimer}s</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 gap-2"
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
          className="text-muted-foreground hover:text-foreground"
        >
          Change Mobile Number
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground pt-2">
        By verifying, you confirm that this mobile number belongs to you.
      </p>
    </motion.div>
  );
};

export default OTPVerification;
