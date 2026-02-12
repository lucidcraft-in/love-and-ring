import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  X,
  Shield,
  Users,
  Lock,
  CheckCircle,
  ArrowLeft,
  EyeOff,
  Eye,
} from "lucide-react";
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.error(
        error?.response?.data?.message || "Failed to send verification code",
      );
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
      toast.error(
        error?.response?.data?.message || "Invalid verification code",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const passwordRegex = /^(?=.*[A-Z]).{4,}$/;

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 4 characters and contain at least one uppercase letter",
      );
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

  const stepTitles = [
    {
      title: "Forgot Password",
      subtitle: "Enter your registered email to receive a verification code.",
    },
    {
      title: "Verify Your Email",
      subtitle: "We've sent a 6-digit code to your email.",
    },
    {
      title: "Set New Password",
      subtitle: "Create a strong new password for your account.",
    },
  ];

  const current = stepTitles[step - 1];

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "", width: "0%" };

    let score = 0;

    if (password.length >= 4) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { color: "bg-red-500", width: "33%" };

    if (score === 2)
      return {  color: "bg-yellow-500", width: "66%" };

    return {  color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Carousel Background - Same as Login */}
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

      {/* Desktop Close Button - Same as Login */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Content Layer - Same split layout as Login */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Marketing (identical to Login) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg mt-10">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Reset Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Password Securely
              </span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Don't worry, it happens to the best of us. Follow the simple steps
              to regain access to your account safely and securely.
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
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Form Card (identical layout to Login) */}
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
                Reset <span className="text-primary">Password</span>
              </h1>
              <p className="text-white/70 text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Form Card - Same styling as Login */}
            <Card className="relative p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
              {/* Back to login link */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </button>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      s <= step
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Form Header */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {current.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {current.subtitle}
                </p>
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
                      <Label htmlFor="fp-email" className="text-sm">
                        Email Address
                      </Label>
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
                      Code sent to{" "}
                      <span className="font-medium text-foreground">
                        {email}
                      </span>
                    </p>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Enter 6-Digit Code</Label>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                        {countdown > 0
                          ? `Resend code in ${countdown}s`
                          : "Resend Code"}
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
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="new-pw" className="text-sm">
                        New Password
                      </Label>

                      <div className="relative">
                        <Input
                          id="new-pw"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Minimum 4 characters, 1 uppercase letter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-10 pr-10"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {newPassword && (
                        <>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                            <div
                              className={`h-full transition-all duration-300 ${strength.color}`}
                              style={{ width: strength.width }}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-pw" className="text-sm">
                        Confirm Password
                      </Label>

                      <div className="relative">
                        <Input
                          id="confirm-pw"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-10 pr-10"
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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
              <p className="text-center mt-5 text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </Link>
              </p>
            </Card>

            {/* Help Text */}
            <div className="text-center mt-4 text-xs text-white/60">
              <p>
                Need help?{" "}
                <Link
                  to="/support?from=forgot-password"
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

export default ForgotPassword;
