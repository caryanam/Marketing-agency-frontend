import { motion } from "motion/react";
import { Send, Search } from "lucide-react";
import { useState } from "react";

const MY_CAMPAIGNS = [
  { id: 1, name: "Diwali Festival Blast", audience: "All Customers", sent: 4200, delivered: 4115, read: 3480, replied: 512, status: "Running", when: "Today, 10:00" },
  { id: 2, name: "New Product Launch — Kurta Collection", audience: "Segment: Loyal buyers", sent: 2800, delivered: 2755, read: 2202, replied: 340, status: "Running", when: "Yesterday" },
  { id: 3, name: "Weekend Flash Sale", audience: "All Contacts", sent: 1900, delivered: 1878, read: 1420, replied: 221, status: "Scheduled", when: "Sat, 09:00" },
  { id: 4, name: "Cart Abandonment Reminder", audience: "Segment: Cart abandoned", sent: 820, delivered: 812, read: 604, replied: 88, status: "Completed", when: "3 days ago" },
  { id: 5, name: "Monsoon Offers", audience: "All Customers", sent: 3200, delivered: 3140, read: 2560, replied: 402, status: "Completed", when: "Last week" },
];

export default function ClientCampaigns() {
  const [filter, setFilter] = useState<"All" | "Running" | "Scheduled" | "Completed">("All");
  const list = MY_CAMPAIGNS.filter(c => filter === "All" || c.status === filter);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">WhatsApp</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">My Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Track deliverability, engagement and replies across every send.</p>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-4 shadow-float flex flex-wrap items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5 min-w-[220px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search campaigns..." className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex items-center gap-1 bg-cream rounded-2xl p-1">
          {(["All", "Running", "Scheduled", "Completed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === f ? "bg-white text-emerald-deep shadow-float" : "text-muted-foreground hover:text-emerald-deep"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {list.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-[28px] bg-white p-6 shadow-float">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center text-white shadow-glow shrink-0">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-black text-lg text-emerald-deep">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.audience} · {c.when}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === "Running" ? "bg-brand text-white" :
                  c.status === "Scheduled" ? "bg-sunny text-emerald-deep" :
                  "bg-teal-deep text-white"
                }`}>{c.status}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Sent", v: c.sent },
                { l: "Delivered", v: c.delivered },
                { l: "Read", v: c.read },
                { l: "Replied", v: c.replied },
              ].map((m) => (
                <div key={m.l} className="p-3 rounded-2xl bg-cream">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.l}</div>
                  <div className="font-display font-black text-xl text-emerald-deep">{m.v.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 h-2 rounded-full bg-cream overflow-hidden">
              <div className="h-full bg-gradient-brand" style={{ width: `${(c.delivered / c.sent) * 100}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
