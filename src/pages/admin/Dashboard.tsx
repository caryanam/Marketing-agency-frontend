import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, MessageCircle, Users, Send, ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/site/Counter";
import { Blob } from "@/components/site/Decor";
import { CLIENTS, CAMPAIGNS } from "@/lib/admin-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const chartData = [
  { d: "Mon", sent: 4200, replied: 620 },
  { d: "Tue", sent: 6100, replied: 810 },
  { d: "Wed", sent: 5300, replied: 705 },
  { d: "Thu", sent: 7800, replied: 990 },
  { d: "Fri", sent: 9400, replied: 1250 },
  { d: "Sat", sent: 8200, replied: 1080 },
  { d: "Sun", sent: 6900, replied: 902 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/15" />
        <Blob className="absolute -left-10 -bottom-16 w-72 h-72 text-sunny/30" />
        <div className="relative">
          <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Welcome back, Aarav</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Your Sunday snapshot ☀️</h1>
          <p className="mt-2 text-white/80 max-w-xl">5 campaigns running, 3 pending approvals and a fresh batch of leads waiting for their first message.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { i: MessageCircle, l: "Messages Sent", n: 47800, s: "", tone: "bg-white text-emerald-deep", trend: "+12.4%" },
          { i: TrendingUp, l: "Delivery Rate", n: 98, s: "%", tone: "bg-gradient-sun text-emerald-deep", trend: "+0.6%" },
          { i: Users, l: "Active Clients", n: 42, s: "", tone: "bg-teal-deep text-white", trend: "+3" },
          { i: Send, l: "Campaigns Live", n: 8, s: "", tone: "bg-emerald-deep text-white", trend: "+2" },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-[28px] p-6 shadow-float ${k.tone}`}>
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur grid place-items-center"><k.i className="h-5 w-5" /></div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20">{k.trend}</span>
            </div>
            <div className="mt-5 font-display font-black text-4xl"><Counter to={k.n} suffix={k.s} /></div>
            <div className="text-xs opacity-70 mt-1 font-semibold">{k.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="w-full">
        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">This Week</div>
              <h3 className="font-display font-black text-xl text-emerald-deep">Messaging Volume</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                <Area dataKey="sent" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-xl text-emerald-deep">Top Clients</h3>
            <Link to="/admin/clients" className="text-sm font-bold text-brand inline-flex items-center gap-1">See all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-3">
            {CLIENTS.slice(0, 4).map((c) => (
              <Link key={c.id} to={`/admin/clients/${c.id}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream transition">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.logoTone} grid place-items-center text-xl shadow-float`}>{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-emerald-deep truncate">{c.company}</div>
                  <div className="text-xs text-muted-foreground">{c.category} · {c.campaigns} campaigns</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-deep">₹{(c.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-brand font-semibold">{c.lastActivity}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-xl text-emerald-deep">Live Campaigns</h3>
            <Link to="/admin/campaigns" className="text-sm font-bold text-brand inline-flex items-center gap-1">See all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-3">
            {CAMPAIGNS.slice(0, 4).map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-cream">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-deep">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.client}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === "Running" ? "bg-brand text-white" : c.status === "Scheduled" ? "bg-sunny text-emerald-deep" : "bg-teal-deep text-white"
                  }`}>{c.status}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white overflow-hidden">
                  <div className="h-full bg-gradient-brand" style={{ width: `${(c.delivered / c.sent) * 100}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{c.delivered.toLocaleString()} / {c.sent.toLocaleString()} delivered</span>
                  <span className="font-bold text-emerald-deep">{c.replied} replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
