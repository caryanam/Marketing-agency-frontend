import { useEffect, useState } from "react";
import { CLIENTS } from "@/lib/admin-data";
import { CreditCard, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function ClientPlans() {
  const [client, setClient] = useState<any>(null);
  const [plan, setPlan] = useState("Growth");
  const [billingBasis, setBillingBasis] = useState<"monthly" | "daily">("monthly");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "";
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
      setClient(found);
      setPlan(found.plan || "Growth");
      setBillingBasis(found.billingBasis || "monthly");
    }
  }, []);

  const plans = [
    {
      name: "Starter",
      price: billingBasis === "daily" ? "₹499" : "₹14,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "For small businesses",
      features: ["Up to 10K messages/mo", "1 campaign per week", "Basic templates", "Email support", "Standard analytics"],
      bg: "bg-white text-emerald-deep border-cream",
      btnBg: "bg-cream text-emerald-deep"
    },
    {
      name: "Growth",
      price: billingBasis === "daily" ? "₹1,199" : "₹34,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "Most popular choice",
      features: ["Up to 50K messages/mo", "Unlimited campaigns", "Meta green-tick setup", "Dedicated strategist", "Advanced analytics", "CRM integration"],
      bg: "bg-gradient-brand text-white border-transparent shadow-glow",
      btnBg: "bg-sunny text-emerald-deep font-black"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      tag: "For 100+ locations",
      features: ["Unlimited messages", "White-glove onboarding & dedicated strategist", "Custom integrations & API access", "24/7 SLA support", "Dedicated infra & server capacity", "Quarterly business reviews"],
      bg: "bg-emerald-deep text-white border-transparent",
      btnBg: "bg-white/15 text-white hover:bg-white/20"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Client Billing</div>
            <h1 className="font-display font-black text-3xl md:text-4xl mt-1">My Plan & Subscriptions</h1>
            <p className="text-white/80 text-sm mt-1">View your current membership details, features, and explore other packages.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 shrink-0">
            <CreditCard className="h-5 w-5 text-sunny" />
            <span className="text-sm font-bold">Active Package: {plan}</span>
          </div>
        </div>
      </div>

      {/* Active Plan Overview Card */}
      <div className="rounded-[28px] bg-white p-6 shadow-float border border-brand/5 relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full bg-brand/5 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest">
              <Sparkles className="h-4 w-4 text-sunny" /> CURRENT SUBSCRIPTION
            </div>
            <h2 className="font-display font-black text-3xl text-emerald-deep">{plan} Plan Active</h2>
            <p className="text-sm text-muted-foreground max-w-xl font-medium">
              You are currently subscribed to the <span className="font-bold text-brand">{plan} Plan</span> ({client?.billingBasis || "monthly"} basis). Your subscription is active, and the next billing period will start automatically.
            </p>
          </div>
          <div className="bg-cream p-5 rounded-2xl border border-cream shrink-0 text-center md:text-right">
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pricing tier</div>
            <div className="font-display font-black text-2xl text-emerald-deep mt-1">
              {plan === "Starter" 
                ? (client?.billingBasis === "daily" ? "₹499/day" : "₹14,999/mo") 
                : plan === "Enterprise" 
                ? "Custom Pricing" 
                : (client?.billingBasis === "daily" ? "₹1,199/day" : "₹34,999/mo")}
            </div>
            <div className="text-xs text-emerald-deep/75 mt-1 font-bold">Status: ACTIVE</div>
          </div>
        </div>
      </div>

      {/* Package comparison with Toggle */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="font-display font-black text-2xl text-emerald-deep">Compare & Upgrade Plans</h3>
        <div className="flex bg-cream p-1 rounded-xl border border-cream/50">
          <button
            onClick={() => setBillingBasis("monthly")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingBasis === "monthly" ? "bg-white text-emerald-deep shadow-float" : "text-muted-foreground hover:text-emerald-deep"
            }`}
          >
            Monthly Basis
          </button>
          <button
            onClick={() => setBillingBasis("daily")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              billingBasis === "daily" ? "bg-white text-emerald-deep shadow-float" : "text-muted-foreground hover:text-emerald-deep"
            }`}
          >
            Daily Basis
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {plans.map((p, i) => {
          const isCurrent = p.name.toLowerCase() === plan.toLowerCase() && (client?.billingBasis === billingBasis || plan.toLowerCase() === "enterprise");
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[28px] p-6 border flex flex-col justify-between relative overflow-hidden ${p.bg}`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-sunny text-emerald-deep text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                  Active
                </div>
              )}
              <div>
                <h4 className="font-display font-black text-2xl">{p.name}</h4>
                <p className="opacity-80 text-xs mt-1 font-semibold">{p.tag}</p>
                <div className="my-5">
                  <span className="font-display font-black text-4xl">{p.price}</span>
                  <span className="text-xs opacity-70">{p.period}</span>
                </div>
                <ul className="space-y-3.5 border-t border-current/10 pt-5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm font-semibold opacity-90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                {isCurrent ? (
                  <button disabled className="w-full py-3.5 rounded-2xl bg-white/20 text-white font-bold text-sm cursor-not-allowed border border-white/10">
                    Current Active Plan
                  </button>
                ) : (
                  <button className={`w-full py-3.5 rounded-2xl text-sm font-bold shadow-float transition-all hover:scale-[1.02] cursor-pointer ${p.btnBg}`}>
                    Request Upgrade
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
