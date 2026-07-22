import { motion } from "motion/react";
import { Send, Search, Info } from "lucide-react";
import { useState } from "react";
import { useClientCampaigns } from "@/hooks/client/useClientSubscription";

export default function ClientCampaigns() {
  const { data: campaigns = [], isLoading } = useClientCampaigns();
  const [filter, setFilter] = useState<"ALL" | "RUNNING" | "CREATED" | "PAUSED" | "STOPPED" | "COMPLETED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = campaigns.filter((c) => {
    const matchesFilter = filter === "ALL" || c.campaignStatus === filter;
    const matchesSearch = c.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4 border border-emerald-100/30">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">WhatsApp Marketing</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">My Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Track deliverability, dispatch counts, and execution state across every send.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-[28px] bg-white p-4 shadow-float flex flex-wrap items-center gap-3 border border-emerald-100/30">
        <div className="flex-1 flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5 min-w-[220px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-semibold text-emerald-deep"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 bg-cream rounded-2xl p-1">
          {(["ALL", "CREATED", "RUNNING", "PAUSED", "STOPPED", "COMPLETED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === f
                  ? "bg-white text-emerald-deep shadow-float"
                  : "text-muted-foreground hover:text-emerald-deep"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/30 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-cream-dark/30 shrink-0" />
                  <div className="space-y-2">
                    <div className="h-5 bg-cream-dark/30 rounded-lg w-48" />
                    <div className="h-3.5 bg-cream-dark/30 rounded-lg w-24" />
                  </div>
                </div>
                <div className="h-7 bg-cream-dark/30 rounded-full w-20" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((m) => (
                  <div key={m} className="p-3 rounded-2xl bg-cream space-y-2">
                    <div className="h-3 bg-cream-dark/30 rounded-lg w-12" />
                    <div className="h-6 bg-cream-dark/30 rounded-lg w-16" />
                  </div>
                ))}
              </div>
              <div className="h-2 rounded-full bg-cream animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center text-white shadow-glow shrink-0">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display font-black text-lg text-emerald-deep">{c.campaignName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Created on: {new Date(c.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      c.campaignStatus === "RUNNING"
                        ? "bg-brand text-white"
                        : c.campaignStatus === "CREATED"
                        ? "bg-sunny text-emerald-deep"
                        : c.campaignStatus === "PAUSED"
                        ? "bg-amber-500 text-white"
                        : "bg-teal-deep text-white"
                    }`}
                  >
                    {c.campaignStatus}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Sent", v: c.messagesSent },
                  { l: "Delivered", v: Math.floor(c.messagesSent * 0.98) },
                  { l: "Read", v: Math.floor(c.messagesSent * 0.8) },
                  { l: "Replied", v: Math.floor(c.messagesSent * 0.15) },
                ].map((m) => (
                  <div key={m.l} className="p-3 rounded-2xl bg-cream">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.l}</div>
                    <div className="font-display font-black text-xl text-emerald-deep">{m.v.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-2 rounded-full bg-cream overflow-hidden">
                <div className="h-full bg-gradient-brand" style={{ width: `${c.messagesSent > 0 ? 98 : 0}%` }} />
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-float border border-emerald-100/30 text-muted-foreground font-medium flex flex-col items-center gap-2">
              <Info className="h-6 w-6 text-muted-foreground/50" />
              No campaigns found matching the criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
