import { useEffect, useState } from "react";
import { CLIENTS } from "@/lib/admin-data";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function AdminPlans() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    let clientsList = CLIENTS;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          clientsList = JSON.parse(stored);
        } catch (e) {}
      }
    }
    setClients(clientsList);
  }, []);

  const starterCount = clients.filter((c: any) => c.plan === "Starter").length;
  const growthCount = clients.filter((c: any) => c.plan === "Growth" || !c.plan).length;
  const enterpriseCount = clients.filter((c: any) => c.plan === "Enterprise").length;

  const planTiers = [
    {
      name: "Starter Plan",
      price: "₹14,999/mo",
      tag: "Ideal for small businesses",
      subscribers: starterCount,
      revenue: `₹${(starterCount * 14999).toLocaleString()}/mo`,
      features: ["Up to 10K messages/mo", "1 campaign per week", "Basic templates", "Standard analytics", "Email support"],
      color: "from-tangerine to-sunny",
      textCol: "text-tangerine"
    },
    {
      name: "Growth Plan",
      price: "₹34,999/mo",
      tag: "Most popular choice",
      subscribers: growthCount,
      revenue: `₹${(growthCount * 34999).toLocaleString()}/mo`,
      features: ["Up to 50K messages/mo", "Unlimited campaigns", "Meta green-tick setup", "Dedicated strategist", "Advanced analytics", "CRM integration"],
      color: "from-brand to-teal-deep",
      textCol: "text-brand"
    },
    {
      name: "Enterprise Plan",
      price: "Custom",
      tag: "For 100+ locations",
      subscribers: enterpriseCount,
      revenue: "Negotiated contracts",
      features: ["Unlimited messages", "White-glove onboarding & dedicated strategist", "Custom integrations & API access", "24/7 SLA support", "Dedicated infra & server capacity", "Quarterly business reviews"],
      color: "from-emerald-deep to-brand",
      textCol: "text-emerald-deep"
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Administration</div>
            <h1 className="font-display font-black text-3xl md:text-4xl mt-1">Caryanam Service Plans</h1>
            <p className="text-white/80 text-sm mt-1">Monitor plan distribution, subscribers, and monthly recurring revenue (MRR).</p>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 shrink-0">
            <CreditCard className="h-5 w-5 text-sunny" />
            <span className="text-sm font-bold">3 Tier Packages</span>
          </div>
        </div>
      </div>

      {/* Plan Distribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {planTiers.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[24px] bg-white p-6 shadow-float flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-cream ${p.textCol}`}>{p.name}</span>
                <span className="text-xs text-muted-foreground font-bold">{p.price}</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display font-black text-3xl text-emerald-deep">{p.subscribers}</span>
                <span className="text-xs text-muted-foreground font-semibold">active clients</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-cream flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-bold">Estimated Revenue:</span>
              <span className="font-extrabold text-emerald-deep">{p.revenue}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Subscriptions Roster */}
      <div className="rounded-[28px] bg-white p-6 shadow-float border border-cream mt-4">
        <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Active Subscriptions Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Client / Company</th>
                <th className="pb-3">Subscribed Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Start Date</th>
                <th className="pb-3">Renewal / End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/60">
              {clients.map(c => (
                <tr key={c.id} className="text-sm font-semibold text-emerald-deep hover:bg-cream/20 transition">
                  <td className="py-3.5 pl-2">
                    <div>{c.company}</div>
                    <div className="text-xs text-muted-foreground font-medium">{c.owner}</div>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold">{c.plan || "Growth"}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.status === "active" ? "bg-brand/15 text-brand" : c.status === "trial" ? "bg-sunny/45 text-emerald-deep" : "bg-muted text-muted-foreground"
                    }`}>{c.status}</span>
                  </td>
                  <td className="py-3.5 font-mono text-xs">{c.planStartDate || "2026-01-01"}</td>
                  <td className="py-3.5 font-mono text-xs">{c.planEndDate || "2027-01-01"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Plan Packages Cards */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {planTiers.map((p, i) => (
          <motion.div
            key={p.name + "-detail"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.1 }}
            className="rounded-[28px] bg-white border border-cream shadow-float overflow-hidden flex flex-col justify-between"
          >
            <div className={`p-6 bg-gradient-to-br ${p.color} text-white relative`}>
              <div className="absolute right-4 top-4 opacity-15">
                <CreditCard className="h-16 w-16" />
              </div>
              <h3 className="font-display font-black text-2xl">{p.name}</h3>
              <p className="text-white/80 text-xs mt-1 font-semibold">{p.tag}</p>
              <div className="mt-4">
                <span className="font-display font-black text-3xl">{p.price}</span>
                {p.price !== "Custom" && <span className="text-xs text-white/70"> / month</span>}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="font-display font-black text-emerald-deep text-sm uppercase tracking-wider">Features Included:</h4>
                <ul className="space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-cream">
                <div className="text-xs text-muted-foreground font-bold">Subscribed Clients:</div>
                <div className="mt-2 space-y-2">
                  {clients.filter(c => c.plan === p.name.split(" ")[0] || (p.name.startsWith("Growth") && !c.plan)).map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-cream/70 px-3 py-2 rounded-xl border border-emerald-deep/5 text-xs">
                      <div>
                        <span className="font-bold text-emerald-deep block">{c.company}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">Owner: {c.owner}</span>
                      </div>
                      <div className="text-right text-[10px] font-semibold text-emerald-deep/80">
                        <div>Start: {c.planStartDate || "2026-01-01"}</div>
                        <div>End: {c.planEndDate || "2027-01-01"}</div>
                      </div>
                    </div>
                  ))}
                  {clients.filter(c => c.plan === p.name.split(" ")[0] || (p.name.startsWith("Growth") && !c.plan)).length === 0 && (
                    <span className="text-xs text-muted-foreground italic font-semibold flex items-center gap-1">No clients subscribed</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
