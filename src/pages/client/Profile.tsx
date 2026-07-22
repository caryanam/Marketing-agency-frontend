import { useEffect, useState, useRef } from "react";
import { User, Mail, Phone, Building2, CreditCard, Edit3, Check, X, KeyRound, Lock, RefreshCw, Layers } from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth/useAuth";
import { useClientProfile } from "@/hooks/client/useClientProfile";
import { useClientCurrentSubscription } from "@/hooks/client/useClientSubscription";
import { Link } from "react-router-dom";

export default function ClientProfile() {
  const auth = useAuth();
  const { client, isLoading, isError, updateProfile, isUpdating } = useClientProfile();
  const { data: activeSub, isLoading: isActiveSubLoading } = useClientCurrentSubscription();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    whatsapp: "",
    category: "",
  });

  // Change Password Modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState<"request" | "verify" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.ownerName || "");
      setEmail(client.email || "");
      setCompany(client.companyName || "");
      setPhone(client.phoneNumber || "");
      setWhatsapp(client.whatsappNumber || client.phoneNumber || "");
      setCategory(client.category || "");

      setEditForm({
        name: client.ownerName || "",
        email: client.email || "",
        company: client.companyName || "",
        phone: client.phoneNumber || "",
        whatsapp: client.whatsappNumber || client.phoneNumber || "",
        category: client.category || "",
      });
      setForgotEmail(client.email || "");
    }
  }, [client]);

  const handlePhoneInput = (value: string, key: "phone" | "whatsapp") => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setEditForm((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const firstDigit = digits.charAt(0);
    if (firstDigit < "6") {
      toast.error("Mobile number must start with 6, 7, 8, or 9.");
      return;
    }
    setEditForm((prev) => ({ ...prev, [key]: digits.slice(0, 10) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(editForm.phone)) {
      toast.error("Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits.");
      return;
    }

    if (editForm.whatsapp && !mobileRegex.test(editForm.whatsapp)) {
      toast.error("WhatsApp number must start with 6, 7, 8, or 9 and be exactly 10 digits.");
      return;
    }

    try {
      await updateProfile({
        ownerName: editForm.name,
        companyName: editForm.company,
        email: editForm.email,
        phoneNumber: editForm.phone,
        whatsappNumber: editForm.whatsapp || editForm.phone,
        category: editForm.category,
      });
      setName(editForm.name);
      setEmail(editForm.email);
      setCompany(editForm.company);
      setPhone(editForm.phone);
      setWhatsapp(editForm.whatsapp || editForm.phone);
      setCategory(editForm.category);
      setIsEditing(false);
    } catch (err: any) {
      // Handled by mutation onError
    }
  };

  const handleCancel = () => {
    setEditForm({
      name,
      email,
      company,
      phone,
      whatsapp,
      category,
    });
    setIsEditing(false);
  };

  // Change Password Handlers
  const handleOpenPasswordModal = () => {
    setForgotEmail(email);
    setPasswordStep("request");
    setOtpDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setIsPasswordModalOpen(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your registered email.");
      return;
    }
    setIsPasswordLoading(true);
    const res = await auth.forgotPassword(forgotEmail.trim());
    setIsPasswordLoading(false);
    if (res.success) {
      setPasswordStep("verify");
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

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

    const focusIndex = Math.min(pastedData.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }
    setIsPasswordLoading(true);
    const res = await auth.verifyOtp(forgotEmail.trim(), code);
    setIsPasswordLoading(false);
    if (res.success) {
      setPasswordStep("reset");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    setIsPasswordLoading(true);
    const res = await auth.resetPassword(forgotEmail.trim(), newPassword);
    setIsPasswordLoading(false);
    if (res.success) {
      setIsPasswordModalOpen(false);
      setPasswordStep("request");
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
    }
  };

  const initials = (name || "Client")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fieldStyle: React.CSSProperties = {
    background: "#f6faf6",
    border: "1.5px solid #d8ead8",
    borderRadius: "12px",
    color: "#1a3a1a",
    fontSize: "13.5px",
    fontWeight: 500,
    width: "100%",
    outline: "none",
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-deep"></div>
          <span className="text-sm font-semibold text-emerald-900">Loading client profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Cover */}
      <div className="rounded-[36px] h-48 bg-gradient-brand relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
      </div>

      {/* Profile Info Header */}
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6 relative">
          <div className="h-32 w-32 rounded-[32px] bg-gradient-sun text-emerald-deep border-4 border-white shadow-2xl grid place-items-center font-display font-black text-4xl -mt-20 relative z-10 shrink-0">
            {initials || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display capitalize font-black text-3xl  text-emerald-deep">{name || "Client Profile"}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-extrabold uppercase shrink-0">
                {activeSub?.plan?.planName || "No Active"} Plan
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1 capitalize"><Building2 className="h-3.5 w-3.5 text-brand" /> {company || "N/A"}</span>
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-brand" /> {email || "N/A"}</span>

            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow inline-flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </button>
            )}
            <button
              onClick={handleOpenPasswordModal}
              className="px-5 py-3 rounded-2xl bg-cream border border-emerald-200 text-emerald-deep font-bold hover:bg-emerald-100/60 inline-flex items-center gap-2 transition cursor-pointer"
            >
              <KeyRound className="h-4 w-4 text-brand" /> Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] bg-white p-6 md:p-8 shadow-float border border-white/60"
              >
                <h3 className="font-display font-black text-xl text-emerald-deep mb-6">Edit Account Details</h3>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Full Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Company Name</label>
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9811122201"
                        value={editForm.phone}
                        onChange={(e) => handlePhoneInput(e.target.value, "phone")}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9811122201"
                        value={editForm.whatsapp}
                        onChange={(e) => handlePhoneInput(e.target.value, "whatsapp")}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-cream">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] bg-white p-6 md:p-8 shadow-float"
              >
                <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { l: "Full Name", v: name, i: User },
                    { l: "Company", v: company, i: Building2 },
                    { l: "Email Address", v: email, i: Mail },
                    { l: "Phone Number", v: phone, i: Phone },
                    { l: "WhatsApp Number", v: whatsapp, i: Phone },
                    { l: "Category", v: category || "N/A", i: Layers },
                  ].map((f) => (
                    <div key={f.l} className="rounded-2xl bg-cream p-4">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{f.l}</div>
                      <div className="mt-1 font-black text-emerald-deep flex items-center gap-2">
                        {f.i && <f.i className="h-4 w-4 text-brand" />}
                        {f.v}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-5">
          {/* Billing & Subscription */}
          <div className="rounded-[28px] bg-white p-6 shadow-float border border-cream">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-sun grid place-items-center text-emerald-deep">
                <CreditCard className="h-5 w-5" />
              </div>
              <h4 className="font-display font-black text-emerald-deep">Billing Info</h4>
            </div>
            {activeSub ? (
              <>
                <div className="text-sm text-muted-foreground font-semibold">
                  {activeSub.plan?.planName} —{" "}
                  <span className="font-bold text-emerald-deep">
                    ₹{activeSub.plan?.price?.toLocaleString() || 0}
                    {activeSub.plan?.planType === "DAILY" ? "/day" : "/mo"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-semibold">
                  Expires on: {activeSub.expiryDate ? new Date(activeSub.expiryDate).toLocaleDateString("en-IN") : "—"}
                </div>
                <div className="mt-2 text-[10px] text-brand/80 font-bold uppercase tracking-wider">
                  Messages Remaining: {activeSub.remainingMessages?.toLocaleString()}
                </div>
                <button disabled className="mt-4 w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-100">
                  Plan Active
                </button>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground font-semibold">
                  No Active Subscription
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">
                  Upgrade to send campaigns and broadcast messages.
                </div>
                <Link
                  to="/client/plans"
                  className="mt-4 w-full py-3 rounded-2xl bg-gradient-brand text-white font-bold text-xs shadow-glow hover:shadow-lg transition flex items-center justify-center cursor-pointer text-center"
                >
                  Upgrade Subscription
                </Link>
              </>
            )}
          </div>

          {/* Quick Security Action */}
          <div className="rounded-[28px] bg-white p-6 shadow-float border border-cream">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 grid place-items-center text-emerald-800">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-black text-emerald-deep">Security & Auth</h4>
                <p className="text-xs text-muted-foreground">Manage your account credentials</p>
              </div>
            </div>
            <button
              onClick={handleOpenPasswordModal}
              className="mt-3 w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" /> Reset Password via OTP
            </button>
          </div>
        </div>
      </div>

      {/* FORGOT / RESET PASSWORD MODAL OVERLAY */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-emerald-100 relative"
            >
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mb-4">
                <KeyRound className="h-6 w-6" />
              </div>

              {passwordStep === "request" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-emerald-950">Change Password</h3>
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
                    disabled={isPasswordLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isPasswordLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}

              {passwordStep === "verify" && (
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
                    disabled={isPasswordLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isPasswordLoading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </form>
              )}

              {passwordStep === "reset" && (
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
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={fieldStyle}
                      className="p-3"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isPasswordLoading ? "Resetting Password..." : "Reset Password"}
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
