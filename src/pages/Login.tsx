import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, X, Shield, Users, Lock, CheckCircle, Phone, Mail } from "lucide-react";
import FloatingBrandLogo from "@/components/FloatingBrandLogo";
import { useAuth } from "@/contexts/AuthContext";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { loginUserApi, sendLoginOtp, verifyLoginOtp } from "@/services/AuthServices";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const heroSlides = [heroSlide1, heroSlide2, heroSlide3];

const features = [
  { icon: Shield, title: "Verified Profiles", desc: "100% authenticated members" },
  { icon: Users, title: "Smart Matching", desc: "AI-powered compatibility" },
  { icon: Lock, title: "Complete Privacy", desc: "Your data stays secure" },
  { icon: CheckCircle, title: "Premium Support", desc: "24/7 dedicated assistance" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Email mode state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Phone mode state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Shared state
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const toggleMode = () => {
    setIsPhoneLogin((prev) => !prev);
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setShowPassword(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const response = await loginUserApi(email, password);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      login(user);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    try {
      setSendingOtp(true);
      await sendLoginOtp(phone);
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !otp || otp.length < 6) {
      toast.error("Please enter phone number and OTP");
      return;
    }
    try {
      setIsLoading(true);
      const response = await verifyLoginOtp(phone, otp);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      login(user);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

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

      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:flex absolute top-6 right-6 z-20 text-white/80 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
        onClick={() => navigate("/")}
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Marketing */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-[45%] text-white p-12 xl:p-16 flex-col justify-center relative"
        >
          <div className="relative z-10 max-w-lg mt-10">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Welcome Back
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Sign In to Continue
              </span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Your perfect match is waiting. Sign in to continue your journey
              and discover meaningful connections tailored to your preferences.
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
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                    <p className="text-white/60 text-xs">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/70">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Login Form */}
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
                Welcome <span className="text-primary">Back</span>
              </h1>
              <p className="text-white/70 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
              onClick={() => navigate("/")}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Form Card */}
            <Card className="relative p-5 sm:p-6 lg:p-7 bg-card/95 backdrop-blur-md shadow-2xl border-border/30 rounded-2xl lg:rounded-3xl">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-foreground mb-1">Sign In</h2>
                <p className="text-sm text-muted-foreground">
                  {isPhoneLogin
                    ? "Enter your phone number to receive an OTP"
                    : "Enter your credentials to access your account"}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!isPhoneLogin ? (
                  /* Email & Password Form */
                  <motion.form
                    key="email-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleEmailLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.form>
                ) : (
                  /* Phone & OTP Form */
                  <motion.form
                    key="phone-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handlePhoneLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-sm">Phone Number</Label>
                      <PhoneInput
                        country="in"
                        value={phone}
                        onChange={(value) => setPhone(value)}
                        inputClass="!w-full !h-10 !rounded-md !border-input !bg-background !text-foreground !text-sm"
                        containerClass="!w-full"
                        buttonClass="!border-input !bg-background !rounded-l-md"
                        dropdownClass="!bg-background !text-foreground !border-input"
                      />
                    </div>

                    {!otpSent ? (
                      <Button
                        type="button"
                        className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                        disabled={sendingOtp}
                        onClick={handleSendOtp}
                      >
                        {sendingOtp ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-sm">Enter OTP</Label>
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
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-xs text-primary hover:underline mt-1"
                            disabled={sendingOtp}
                          >
                            Resend OTP
                          </button>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/25 rounded-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Verify & Sign In"}
                        </Button>
                      </>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              {/* Toggle Button */}
              <Button
                variant="outline"
                className="w-full h-10 rounded-lg text-primary border-primary/30 hover:bg-primary/5"
                type="button"
                onClick={toggleMode}
              >
                {isPhoneLogin ? (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Continue with Email & Password
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Continue with Phone
                  </>
                )}
              </Button>

              {/* Register Link - Mobile */}
              <p className="text-center mt-5 text-sm text-muted-foreground lg:hidden">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register Now
                </Link>
              </p>
            </Card>

            <div className="text-center mt-4 text-xs text-white/60">
              <p>
                Need help signing in?{" "}
                <Link to="/support?from=signin" className="text-primary hover:underline">
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

export default Login;
