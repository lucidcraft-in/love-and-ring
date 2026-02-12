import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Mail, ShieldCheck, LockKeyhole } from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "@/services/AuthServices";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const stepConfig = [
  { icon: Mail, title: "Forgot Password", subtitle: "Enter your registered email to receive a verification code." },
  { icon: ShieldCheck, title: "Verify Your Email", subtitle: "We've sent a 6-digit code to your email." },
  { icon: LockKeyhole, title: "Set New Password", subtitle: "Create a strong new password for your account." },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = useCallback(() => setCountdown(30), []);

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setIsLoading(true);
      await sendForgotPasswordOtp(email);
      toast.success("Verification code sent to your email");
      startCountdown();
      setStep(2);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    try {
      setIsLoading(true);
      await verifyForgotPasswordOtp(email, otp);
      toast.success("Email verified successfully");
      setStep(3);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await sendForgotPasswordOtp(email);
      toast.success("Verification code resent");
      startCountdown();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend code");
    }
  };

  const current = stepConfig[step - 1];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Carousel Background */}
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
            <img src={heroSlides[currentSlide]} alt="Background" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <FloatingBrandLogo variant="auth" className="z-[5]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                Love<span className="text-primary">&</span>Ring
              </span>
            </Link>
          </div>

          <Card className="relative p-6 sm:p-8 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
            {/* Back to login */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-gradient-to-r from-primary to-secondary" : "bg-border"
                  }`}
                />
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <current.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.subtitle}</p>
              </div>
            </div>

            {/* Steps */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="fp-email" className="text-sm">Email Address</Label>
                    <Input
                      id="fp-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                    disabled={isLoading}
                    onClick={handleSendOtp}
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    Code sent to <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Enter 6-Digit Code</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                      className={`text-xs transition-colors ${
                        countdown > 0
                          ? "text-muted-foreground cursor-not-allowed"
                          : "text-primary hover:underline"
                      }`}
                    >
                      {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
                    </button>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                    disabled={isLoading}
                    onClick={handleVerifyOtp}
                  >
                    {isLoading ? "Verifying..." : "Verify Code"}
                  </Button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="new-pw" className="text-sm">New Password</Label>
                    <Input
                      id="new-pw"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pw" className="text-sm">Confirm Password</Label>
                    <Input
                      id="confirm-pw"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                    disabled={isLoading}
                    onClick={handleResetPassword}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
