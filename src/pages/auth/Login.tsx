import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  MessageCircle, Lock, Mail, Eye, EyeOff,
  ArrowRight, ShieldCheck, User,
} from "lucide-react";
import loginBg from "@/assets/login-bg.png";
import loginHero from "@/assets/login-hero.png";
import loginAvatar from "@/assets/login-avatar.png";
import bgVideo from "@/assets/now_animatied_this_only_waves.mp4";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate(localStorage.getItem("role") === "admin" ? "/admin" : "/client");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (isRegister) {
      if (!fullName.trim() || !email.trim() || !password) {
        setError("Please fill in all required fields to register.");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "client");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", fullName.trim());
      navigate("/client");
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }
    localStorage.setItem("isAuthenticated", "true");
    if (email === "admin@gmail.com" && password === "admin@123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", "Aarav Menon");
      navigate("/admin");
    } else {
      const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      localStorage.setItem("role", "client");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || "Client");
      navigate("/client");
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
      className="relative min-h-screen h-auto lg:h-screen w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden font-sans"
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
      <div className="flex-1 min-h-screen lg:min-h-full w-full relative z-10 flex flex-col items-center justify-center lg:justify-start lg:pl-4 xl:pl-10 p-4 sm:p-6 py-8 sm:py-12 lg:py-4 overflow-y-auto lg:overflow-hidden">
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

        {/* ── White card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[380px] sm:max-w-[400px] my-auto"
        >
          <div
            className="rounded-3xl overflow-hidden shadow-xl lg:shadow-none"
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(210,235,210,0.85)",
            }}
          >
            {/* Card header: avatar + Secure Login / Registration */}
            <div
              className="relative px-5 pt-4 pb-2 flex items-start justify-between"
              style={{ background: "#f4fbf4" }}
            >
              <img
                src={loginAvatar}
                alt="Dashboard illustration"
                className="h-20 w-auto object-contain"
                style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.09))" }}
              />
              <div
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full mt-1"
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

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200 flex items-center gap-2"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name (Only for Register) */}
                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label
                      htmlFor="fullName"
                      className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
                      style={{ color: "#2e7d32" }}
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div
                        className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                        style={{ color: "#6a9a6a" }}
                      >
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ ...fieldStyle, padding: "11px 40px 11px 38px" }}
                        onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                        onBlur={(e) => (e.target.style.borderColor = "#d8ead8")}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
                    style={{ color: "#2e7d32" }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                      style={{ color: "#6a9a6a" }}
                    >
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
                    {email && (
                      <div
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                        style={{ color: "#2e7d32" }}
                      >
                        <div className="h-5 w-5 rounded-full border-2 border-current grid place-items-center">
                          <svg viewBox="0 0 12 10" className="h-2.5 w-2.5" fill="none">
                            <path d="M1 5l3 3L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-black uppercase tracking-widest mb-1.5"
                    style={{ color: "#2e7d32" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                      style={{ color: "#6a9a6a" }}
                    >
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

                {/* Remember me + Forgot (only for Login) */}
                {!isRegister && (
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div
                        onClick={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 rounded grid place-items-center cursor-pointer shrink-0 transition-all"
                        style={{
                          background: rememberMe ? "#2e7d32" : "#fff",
                          border: "1.5px solid " + (rememberMe ? "#2e7d32" : "#bdd5bd"),
                        }}
                      >
                        {rememberMe && (
                          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[12px]" style={{ color: "#4a6a4a" }}>Remember me</span>
                    </label>
                    <span
                      className="text-[12px] font-semibold cursor-pointer hover:underline"
                      style={{ color: "#2e7d32" }}
                    >
                      Forgot Password?
                    </span>
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
    </div>
  );
}
