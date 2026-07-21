import { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, CreditCard, Edit3, Check, X } from "lucide-react";
import { CLIENTS } from "@/lib/admin-data";
import { Blob } from "@/components/site/Decor";
import { motion, AnimatePresence } from "motion/react";

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("Acme Retail Pvt. Ltd.");
  const [phone, setPhone] = useState("+91 98450 12210");
  const [plan, setPlan] = useState("Growth");
  const [billingBasis, setBillingBasis] = useState<"monthly" | "daily">("monthly");

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);

    let clientsList = CLIENTS;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          clientsList = JSON.parse(stored);
        } catch (e) {}
      }
    }
    const found = clientsList.find(c => c.email.toLowerCase() === storedEmail.toLowerCase());
    if (found) {
      setName(found.owner);
      setCompany(found.company);
      setPhone(found.phone);
      setPlan(found.plan || "Growth");
      setBillingBasis(found.billingBasis || "monthly");
      setEditForm({
        name: found.owner,
        email: found.email,
        company: found.company,
        phone: found.phone
      });
    } else {
      const userN = localStorage.getItem("userName") || "Client";
      setName(userN);
      setPlan("Growth");
      setEditForm({
        name: userN,
        email: storedEmail,
        company: "Acme Retail Pvt. Ltd.",
        phone: "+91 98450 12210"
      });
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setName(editForm.name);
    setEmail(editForm.email);
    setCompany(editForm.company);
    setPhone(editForm.phone);
    setIsEditing(false);

    // Save to localStorage
    localStorage.setItem("userName", editForm.name);
    localStorage.setItem("userEmail", editForm.email);

    // Update in CLIENTS list if matched
    let clientsList = CLIENTS;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          clientsList = JSON.parse(stored);
        } catch (err) {}
      }
    }
    const updatedList = clientsList.map(c => 
      c.email.toLowerCase() === email.toLowerCase() 
        ? { ...c, owner: editForm.name, email: editForm.email, company: editForm.company, phone: editForm.phone } 
        : c
    );
    localStorage.setItem("clients", JSON.stringify(updatedList));
  };

  const handleCancel = () => {
    setEditForm({ name, email, company, phone });
    setIsEditing(false);
  };

  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="space-y-6 font-sans">
      {/* Cover */}
      <div className="rounded-[36px] h-48 bg-gradient-brand relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
      </div>

      {/* Profile Info Header */}
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6">
          <div className="h-32 w-32 rounded-3xl bg-gradient-brand text-white border-4 border-white shadow-glow grid place-items-center font-display font-black text-4xl -mt-16">
            {initials || "C"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl md:text-4xl text-emerald-deep">{name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-extrabold uppercase shrink-0">
                {plan} Plan
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-brand" /> {company}</span>
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-brand" /> {email}</span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow inline-flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
          )}
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
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
                      className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Save Changes
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
                    { l: "WhatsApp Number", v: phone, i: Phone },
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
            <div className="text-sm text-muted-foreground font-semibold">
              {plan} Plan — <span className="font-bold text-emerald-deep">
                {plan === "Starter" 
                  ? (billingBasis === "daily" ? "₹499/day" : "₹14,999/mo") 
                  : plan === "Enterprise" 
                  ? "Custom Pricing" 
                  : (billingBasis === "daily" ? "₹1,199/day" : "₹34,999/mo")}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-semibold">Next invoice on 5th Aug 2026</div>
            <button disabled className="mt-4 w-full py-2.5 rounded-2xl bg-cream text-emerald-deep/70 font-bold text-sm cursor-not-allowed border border-emerald-deep/5">
              Plan Active
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
