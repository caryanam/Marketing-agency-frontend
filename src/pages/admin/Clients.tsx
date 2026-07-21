import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Phone, Mail, MessageCircle, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import { CLIENTS } from "@/lib/admin-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CATS = ["All", "Used Cars", "Healthcare", "Real Estate", "Garages", "Insurance", "Education", "Hospitality", "Finance"];

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
  "Used Cars": "🚗",
  "Healthcare": "🩺",
  "Real Estate": "🏡",
  "Garages": "🔧",
  "Insurance": "🛡️",
  "Education": "🎓",
  "Hospitality": "🏨",
  "Finance": "💰"
};

export default function AdminClients() {
  const [clients, setClients] = useState<typeof CLIENTS>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return CLIENTS;
        }
      }
    }
    return CLIENTS;
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [company, setCompany] = useState("");
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState("Used Cars");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "trial" | "paused">("active");
  const [plan, setPlan] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [billingBasis, setBillingBasis] = useState<"monthly" | "daily">("monthly");

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !owner || !phone || !email) return;

    // Generate url-friendly ID
    const id = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Choose a random tone gradient
    const logoTone = TONES[Math.floor(Math.random() * TONES.length)];

    // Derive emoji dynamically from category
    const resolvedEmoji = CATEGORY_EMOJIS[category] || "💼";

    const newClient = {
      id,
      company,
      owner,
      category,
      phone,
      whatsapp: whatsapp || phone,
      email,
      revenue: 0,
      campaigns: 0,
      status,
      lastActivity: "Just added",
      logoTone,
      emoji: resolvedEmoji,
      plan,
      billingBasis
    };

    setClients([newClient, ...clients]);
    setIsOpen(false);

    // Reset form
    setCompany("");
    setOwner("");
    setCategory("Used Cars");
    setPhone("");
    setWhatsapp("");
    setEmail("");
    setStatus("active");
    setPlan("Growth");
    setBillingBasis("monthly");
  };

  const filtered = clients.filter((c) =>
    (cat === "All" || c.category === cat) && c.company.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-teal text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/70 text-xs uppercase tracking-widest font-bold">Client Portfolio</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">All Clients ({clients.length})</h1>
            <p className="mt-2 text-white/70 max-w-lg">Track relationships, revenue and activity across every brand you serve.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5">
                <Plus className="h-5 w-5" /> Add Client
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
              <DialogHeader>
                <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Add New Client</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClient} className="space-y-4 mt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Owner Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={owner}
                      onChange={e => setOwner(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      {CATS.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 99999 88888"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">WhatsApp (Optional)</label>
                    <input
                      type="text"
                      placeholder="Same as phone"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="info@acme.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="trial">Trial</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Plan</label>
                    <select
                      value={plan}
                      onChange={e => setPlan(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Growth">Growth</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Billing Basis</label>
                    <select
                      value={billingBasis}
                      onChange={e => setBillingBasis(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="daily">Daily</option>
                    </select>
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
                    className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm"
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              cat === c ? "bg-brand text-white shadow-glow" : "bg-cream text-emerald-deep hover:bg-secondary"
            }`}>{c}</button>
          ))}
        </div>
      </div>

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
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c.logoTone} grid place-items-center text-2xl shadow-float`}>{c.emoji}</div>
                    <div>
                      <div className="font-display font-black text-lg text-emerald-deep leading-snug">{c.company}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.owner}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      c.status === "active" ? "bg-brand/15 text-brand" : c.status === "trial" ? "bg-sunny/40 text-emerald-deep" : "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                    <span className="px-2 py-0.5 rounded bg-cream text-emerald-deep border border-emerald-deep/10 text-[9px] font-extrabold uppercase whitespace-nowrap">
                      {c.plan || "Growth"} · {c.billingBasis || "monthly"}
                    </span>
                  </div>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0"><Phone className="h-3 w-3 shrink-0" /><span className="truncate">{c.phone}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0"><MessageCircle className="h-3 w-3 shrink-0" /><span className="truncate">{c.whatsapp}</span></div>
                  <div className="col-span-2 flex items-center gap-2 text-muted-foreground min-w-0"><Mail className="h-3 w-3 shrink-0" /><span className="truncate">{c.email}</span></div>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-cream p-3.5">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Campaigns</div>
                    <div className="font-black text-emerald-deep text-base mt-0.5">{c.campaigns}</div>
                  </div>
                  <div className="rounded-2xl bg-cream p-3.5">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Category</div>
                    <div className="font-black text-emerald-deep text-sm mt-0.5 truncate" title={c.category}>{c.category}</div>
                  </div>
                </div>
              </div>

              <div className="relative mt-5 pt-3 border-t border-cream flex items-center justify-between">
                <div className="text-xs text-brand font-bold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {c.lastActivity}</div>
                <Link to={`/admin/clients/${c.id}`} className="text-sm font-black text-emerald-deep inline-flex items-center gap-1 hover:text-brand transition cursor-pointer">
                  View <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
