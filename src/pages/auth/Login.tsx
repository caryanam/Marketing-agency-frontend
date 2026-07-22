import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle, Lock, Mail, Eye, EyeOff,
  ArrowRight, ShieldCheck, User, X, KeyRound, Building2, Phone
} from "lucide-react";
import toast from "react-hot-toast";
import loginBg from "@/assets/login-bg.png";
import loginHero from "@/assets/login-hero.png";
import loginAvatar from "@/assets/login-avatar.png";
import bgVideo from "@/assets/now_animatied_this_only_waves.mp4";

import { useAuth } from "@/hooks/auth/useAuth";
import { useClientAuth } from "@/hooks/auth/useClientAuth";

const CATEGORIES = [
  "Used Car Dealers",
  "Car Showrooms",
  "Hospitals",
  "Garages",
  "Real Estate",
  "Insurance Agents",
  "Schools And Colleges",
  "Hotels And Restaurants",
  "Finance Companies",
];

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const clientAuth = useClientAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"request" | "verify" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtp(newDigits.join(""));

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    setOtp(newDigits.join(""));

    const focusIndex = Math.min(pastedData.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handlePhoneInput = (value: string, setter: (val: string) => void) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setter("");
      return;
    }
    const firstDigit = digits.charAt(0);
    if (firstDigit < "6") {
      toast.error("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }
    setter(digits.slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRegister) {
      if (!fullName.trim() || !companyName.trim() || !category || !phone.trim() || !whatsapp.trim() || !email.trim() || !password) {
        const msg = "All registration fields (Full Name, Company Name, Category, Phone, WhatsApp, Email, Password) are mandatory.";
        setError(msg);
        toast.error(msg);
        return;
      }

      const mobileRegex = /^[6-9]\d{9}$/;
      const cleanPhone = phone.trim().replace(/\D/g, "");
      const cleanWhatsapp = whatsapp.trim().replace(/\D/g, "");

      if (!mobileRegex.test(cleanPhone)) {
        const msg = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits.";
        setError(msg);
        toast.error(msg);
        return;
      }

      if (!mobileRegex.test(cleanWhatsapp)) {
        const msg = "WhatsApp number must start with 6, 7, 8, or 9 and be exactly 10 digits.";
        setError(msg);
        toast.error(msg);
        return;
      }

      if (password.length < 8) {
        const msg = "Password must be at least 8 characters long.";
        setError(msg);
        toast.error(msg);
        return;
      }

      setIsLoading(true);

      // API Client Registration
      const regRes = await clientAuth.registerClient({
        ownerName: fullName.trim(),
        companyName: companyName.trim(),
        category,
        phoneNumber: cleanPhone,
        whatsappNumber: cleanWhatsapp,
        email: email.trim(),
        password,
      });

      if (!regRes.success) {
        setError(regRes.error || "Registration failed.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      toast.success("Registration successful! Please sign in with your credentials.");
      setIsRegister(false);
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // API Login
    const loginRes = await auth.login({ email: email.trim(), password });
    setIsLoading(false);

    if (loginRes.success) {
      navigate(loginRes.role === "admin" ? "/admin" : "/client");
    } else {
      setError(loginRes.error || "Invalid email or password.");
    }
  };

  // Forgot Password Handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsForgotLoading(true);
    const res = await auth.forgotPassword(forgotEmail.trim());
    setIsForgotLoading(false);
    if (res.success) {
      setOtpDigits(["", "", "", "", "", ""]);
      setOtp("");
      setForgotStep("verify");
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }
    setIsForgotLoading(true);
    const res = await auth.verifyOtp(forgotEmail.trim(), code);
    setIsForgotLoading(false);
    if (res.success) {
      setForgotStep("reset");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setIsForgotLoading(true);
    const res = await auth.resetPassword(forgotEmail.trim(), newPassword);
    setIsForgotLoading(false);
    if (res.success) {
      setIsForgotOpen(false);
      setForgotStep("request");
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    }
  };

  const fieldStyle: React.CSSProperties = {
    background: "#f6faf6",
    border: "1.5px solid #d8ead8",
    borderRadius: "12px",
    color: "#1a3a1a",
    fontSize: "13.5px",
    fontWeight: 500,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="relative min-h-screen h-auto lg:h-screen w-full flex flex-col lg:flex-row overflow-y-auto font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL  —  background image + headline + illustration
      ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[60%] h-full relative z-10 overflow-hidden flex-col shrink-0">
        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 p-7 pl-12 xl:p-9 xl:pl-16 hover:opacity-90 transition-opacity cursor-pointer">
          <div
            className="h-11 w-11 rounded-full grid place-items-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)" }}
          >
            <MessageCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-black text-xl leading-tight" style={{ color: "#1a3a1a" }}>Caryanam</div>
            <div className="text-[9px] uppercase tracking-[0.22em] font-bold" style={{ color: "#5a8a5a" }}>Marketing Agency</div>
          </div>
        </Link>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative z-10 pl-12 xl:pl-16 pr-6"
        >
          <h1 className="font-display font-black leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)" }}>
            <span style={{ color: "#1a3a1a" }}>Connect.</span><br />
            <span style={{ color: "#2e7d32" }}>Engage.</span><br />
            <span style={{ color: "#e8941a" }}>Scale.</span>
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed max-w-[280px]" style={{ color: "#4a6a4a" }}>
            Manage enterprise WhatsApp marketing campaigns, coordinate client workflows, and
            monitor deliverability rates with pixel-perfect precision.
          </p>
        </motion.div>

        {/* Hero Illustration */}
        <div className="relative z-10 flex-1 flex items-end justify-end min-h-0 pl-4 pr-10 pb-0">
          <motion.img
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            src={loginHero}
            alt="WhatsApp Marketing Campaign"
            className="w-auto max-w-[500px] xl:max-w-[500px] max-h-[350px] xl:max-h-[720px] object-contain select-none pointer-events-none translate-x-10 xl:translate-x-16"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT PANEL  —  mint bg + white card
      ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-h-screen h-full w-full relative z-10 flex flex-col items-center justify-center lg:justify-start lg:pl-4 xl:pl-10 p-4 sm:p-6 py-8 sm:py-12 overflow-y-auto">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-6 flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity cursor-pointer">
          <div
            className="h-10 w-10 rounded-full grid place-items-center shadow-md"
            style={{ background: "linear-gradient(135deg,#1b5e20,#2e7d32)" }}
          >
            <MessageCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-black text-xl leading-tight" style={{ color: "#1a3a1a" }}>Caryanam</div>
            <div className="text-[8px] uppercase tracking-[0.2em] font-bold" style={{ color: "#5a8a5a" }}>Marketing Agency</div>
          </div>
        </Link>

        {/* White Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] my-auto"
        >
          <div
            className="rounded-3xl overflow-hidden shadow-xl lg:shadow-none"
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(210,235,210,0.85)",
            }}
          >
            {/* Card header */}
            <div
              className="relative px-5 pt-4 pb-2 flex items-start justify-between"
              style={{ background: "#f4fbf4" }}
            >
              <img
                src={loginAvatar}
                alt="Dashboard illustration"
                className="h-20 w-auto object-contain"
              />
              <div
                className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5"
                style={{
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  border: "1px solid #c8e6c9",
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                {isRegister ? "Registration" : "Secure Login"}
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 pb-5 pt-2">
              <h2
                className="font-display font-black leading-tight mb-1"
                style={{ fontSize: "1.65rem", color: "#1a3a1a" }}
              >
                {isRegister ? "Create Account 👋" : "Welcome Back! 👋"}
              </h2>
              <p className="text-[13px] mb-4" style={{ color: "#6a8a6a" }}>
                {isRegister ? "Sign up to start your marketing campaigns" : "Sign in to access your dashboard"}
              </p>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200 flex items-center gap-2 font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Registration Fields (Only for Register) */}
                {isRegister && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#2e7d32" }}>
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#6a9a6a" }}>
                            <User className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ ...fieldStyle, padding: "10px 10px 10px 34px" }}
                          />
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#2e7d32" }}>
                          Company Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#6a9a6a" }}>
                            <Building2 className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Acme Retail"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            style={{ ...fieldStyle, padding: "10px 10px 10px 34px" }}
                          />
                        </div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#2e7d32" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9811122201"
                          value={phone}
                          onChange={(e) => handlePhoneInput(e.target.value, setPhone)}
                          style={{ ...fieldStyle, padding: "10px 10px" }}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#2e7d32" }}>
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9811122201"
                          value={whatsapp}
                          onChange={(e) => handlePhoneInput(e.target.value, setWhatsapp)}
                          style={{ ...fieldStyle, padding: "10px 10px" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#2e7d32" }}>
                        Business Category
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ ...fieldStyle, padding: "10px 8px" }}
                        className="cursor-pointer text-xs"
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#2e7d32" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#6a9a6a" }}>
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...fieldStyle, padding: "11px 40px 11px 38px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                      onBlur={(e) => (e.target.style.borderColor = "#d8ead8")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#2e7d32" }}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#6a9a6a" }}>
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...fieldStyle, padding: "11px 44px 11px 38px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                      onBlur={(e) => (e.target.style.borderColor = "#d8ead8")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                      style={{ color: "#6a9a6a" }}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                {!isRegister && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotStep("request");
                        setIsForgotOpen(true);
                      }}
                      className="text-[12px] font-semibold cursor-pointer hover:underline border-none bg-transparent"
                      style={{ color: "#2e7d32" }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Sign In / Register Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(20,100,40,0.38)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-5 rounded-2xl text-white font-bold text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer mt-2"
                  style={{
                    background: "linear-gradient(135deg,#1b5e20 0%,#2e7d32 55%,#43a047 100%)",
                    boxShadow: "0 4px 16px rgba(20,100,40,0.28)",
                  }}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? "Create Account" : "Sign In"}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Mode Switch Link */}
              <div className="pt-3 text-center border-t border-emerald-100/60 mt-3">
                <p className="text-[12.5px]" style={{ color: "#5a7a5a" }}>
                  {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError("");
                    }}
                    className="font-bold cursor-pointer hover:underline ml-1"
                    style={{ color: "#2e7d32" }}
                  >
                    {isRegister ? "Sign In" : "Register"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FORGOT PASSWORD MODAL OVERLAY */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 relative"
            >
              <button
                onClick={() => setIsForgotOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mb-4">
                <KeyRound className="h-6 w-6" />
              </div>

              {forgotStep === "request" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-emerald-950">Forgot Password?</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your email address to receive a 6-digit verification code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={fieldStyle}
                      className="p-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {isForgotLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {forgotStep === "verify" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-emerald-950">Enter Verification Code</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      An OTP has been sent to <span className="font-bold text-emerald-800">{forgotEmail}</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-2">6-Digit OTP</label>
                    <div className="grid grid-cols-6 gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-full h-12 text-center text-lg font-black rounded-xl border border-emerald-200 bg-emerald-50/50 focus:border-emerald-600 focus:bg-white focus:outline-none transition-all font-mono"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {isForgotLoading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </form>
              )}

              {forgotStep === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-emerald-950">Set New Password</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your new account password below.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-900 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={fieldStyle}
                      className="p-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {isForgotLoading ? "Resetting Password..." : "Reset Password"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
