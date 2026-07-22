import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Phone, Mail, MessageCircle, TrendingUp, ArrowUpRight, Plus, Eye, EyeOff, User, Building2, Calendar, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import toast from "react-hot-toast";

import { useAdminClients } from "@/hooks/admin/useAdminClients";
import { useClientAuth } from "@/hooks/auth/useClientAuth";

const CATS = ["All", "Used Car Dealers", "Car Showrooms", "Hospitals", "Garages", "Real Estate", "Insurance Agents", "Finance Companies", "Schools And Colleges", "Hotels And Restaurants"];

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Car Dealers",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Hospitals",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance Agents",
  FINANCE_COMPANIES: "Finance Companies",
  SCHOOLS_AND_COLLEGES: "Schools And Colleges",
  HOTELS_AND_RESTAURANTS: "Hotels And Restaurants",
};

const TONES = [
  "from-brand to-teal-deep",
  "from-sky-soft to-brand",
  "from-emerald-deep to-brand",
  "from-tangerine to-sunny",
  "from-sunny to-tangerine",
  "from-brand to-sunny",
  "from-teal-deep to-sky-soft"
];

const CATEGORY_EMOJIS: Record<string, string> = {
  "Used Car Dealers": "🚗",
  "Car Showrooms": "🏎️",
  "Hospitals": "🩺",
  "Real Estate": "🏡",
  "Garages": "🔧",
  "Insurance Agents": "🛡️",
  "Finance Companies": "💰",
  "Schools And Colleges": "🎓",
  "Hotels And Restaurants": "🏨",
};

export default function AdminClients() {
  const { clients: apiClients, isLoading, refetch } = useAdminClients();
  const clientAuth = useClientAuth();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  // Form states (aligned with Registration)
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || !companyName.trim() || !category || !phone.trim() || !whatsapp.trim() || !email.trim() || !password) {
      const msg = "All registration fields (Full Name, Company Name, Category, Phone, WhatsApp, Email, Password) are mandatory.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.trim().replace(/\D/g, "");
    const cleanWhatsapp = whatsapp.trim().replace(/\D/g, "");

    if (!mobileRegex.test(cleanPhone)) {
      const msg = "Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!mobileRegex.test(cleanWhatsapp)) {
      const msg = "WhatsApp number must start with 6, 7, 8, or 9 and be exactly 10 digits.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    const res = await clientAuth.registerClient({
      ownerName: fullName.trim(),
      companyName: companyName.trim(),
      category,
      phoneNumber: cleanPhone,
      whatsappNumber: cleanWhatsapp,
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (res.success) {
      refetch();
      setIsOpen(false);
      setFormError("");
      // Reset form
      setFullName("");
      setCompanyName("");
      setCategory("");
      setPhone("");
      setWhatsapp("");
      setEmail("");
      setPassword("");
    } else {
      setFormError(res.error || "Registration failed. Please check your inputs.");
    }
  };

  const allClients = (apiClients || []).map((c) => {
    const displayCategory = REVERSE_CATEGORY_MAP[c.category] || c.category || "General";
    return {
      id: String(c.id),
      company: c.companyName || "Client Business",
      owner: c.ownerName || "Client Owner",
      category: displayCategory,
      rawCategory: c.category,
      phone: c.phoneNumber || "",
      whatsapp: c.whatsappNumber || c.phoneNumber || "",
      email: c.email || "",
      createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently",
      logoTone: TONES[(c.id || 0) % TONES.length] || "from-brand to-teal-deep",
      emoji: CATEGORY_EMOJIS[displayCategory] || "💼",
    };
  });

  const filtered = allClients.filter((c) =>
    (cat === "All" || c.category === cat) && (c.company.toLowerCase().includes(q.toLowerCase()) || c.owner.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-teal text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/70 text-xs uppercase tracking-widest font-bold">Client Portfolio</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">All Clients ({allClients.length})</h1>
            <p className="mt-2 text-white/70 max-w-lg">Track relationships, revenue and activity across every brand you serve.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsRefreshing(true);
                await refetch();
                setIsRefreshing(false);
                toast.success("Client list refreshed!");
              }}
              disabled={isLoading || isRefreshing}
              className="px-4 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white font-extrabold text-sm shadow-glow transition cursor-pointer flex items-center gap-2 border border-white/20 disabled:opacity-50"
              title="Refresh Client List"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5">
                  <Plus className="h-5 w-5" /> Add Client
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
                <DialogHeader>
                  <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Register New Client Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddClient} className="space-y-4 mt-2">
                  {formError && (
                    <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs font-medium border border-red-200 flex items-center gap-2">
                      <span>⚠️</span> {formError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Retail"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9811122201"
                        value={phone}
                        onChange={e => handlePhoneInput(e.target.value, setPhone)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9811122201"
                        value={whatsapp}
                        onChange={e => handlePhoneInput(e.target.value, setWhatsapp)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Business Category</label>
                      <select
                        required
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {CATS.filter(c => c !== "All").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="client@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Account Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-emerald-deep transition cursor-pointer"
                      >
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Register Client"
                      )}
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-float flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-cream rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients by name..." className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-2 rounded-full text-xs font-bold transition cursor-pointer ${cat === c ? "bg-brand text-white shadow-glow" : "bg-cream text-emerald-deep hover:bg-secondary"
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[28px] bg-white p-6 shadow-float animate-pulse space-y-4 border border-cream/50">
              <div className="h-14 w-14 rounded-2xl bg-cream-dark/30" />
              <div className="h-6 w-3/4 bg-cream-dark/30 rounded-lg" />
              <div className="h-4 w-1/2 bg-cream-dark/30 rounded-lg" />
              <div className="h-16 bg-cream/70 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[28px] bg-white p-12 text-center shadow-float">
          <div className="h-16 w-16 rounded-2xl bg-cream text-emerald-deep grid place-items-center mx-auto mb-4 text-2xl">
            💼
          </div>
          <h3 className="font-display font-black text-xl text-emerald-deep">No Clients Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {cat !== "All" ? `No registered clients under category '${cat}'.` : "No registered clients match your search query."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence initial={false}>
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-[28px] bg-white p-6 shadow-float hover:shadow-glow hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col justify-between"
              >
                <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${c.logoTone} opacity-10 group-hover:opacity-20 transition`} />
                <div>
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c.logoTone} grid place-items-center text-2xl shadow-float shrink-0`}>
                        {c.emoji}
                      </div>
                      <div>
                        <div className="font-display font-black text-lg text-emerald-deep leading-snug capitalize">{c.company}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 capitalize flex items-center gap-1 font-medium">
                          <User className="h-3 w-3 text-brand inline" /> {c.owner}
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-brand/15 text-brand text-[10px] font-bold uppercase shrink-0">
                      ID: #{c.id}
                    </span>
                  </div>

                  <div className="relative mt-5 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 min-w-0">
                      <Phone className="h-3.5 w-3.5 text-brand shrink-0" />
                      <span className="font-semibold truncate">{c.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 min-w-0">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-800 shrink-0" />
                      <span className="font-semibold truncate">{c.whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 min-w-0">
                      <Mail className="h-3.5 w-3.5 text-brand shrink-0" />
                      <span className="font-semibold truncate">{c.email}</span>
                    </div>
                  </div>

                  <div className="relative mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-cream p-3">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Registered</div>
                      <div className="font-black text-emerald-deep text-xs mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-brand" /> {c.createdAt}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-cream p-3">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Category</div>
                      <div className="font-black text-emerald-deep text-xs mt-1 truncate" title={c.category}>
                        {c.category}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 pt-3 border-t border-cream flex items-center justify-between">
                  <div className="text-xs text-brand font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Active Client
                  </div>
                  <Link to={`/admin/clients/${c.id}`} className="text-xs font-black text-emerald-deep inline-flex items-center gap-1 hover:text-brand transition cursor-pointer">
                    View Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
