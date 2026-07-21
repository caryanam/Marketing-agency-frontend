import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { TrendingUp, MessageCircle, Users, Send, ArrowUpRight, CheckCheck } from "lucide-react";
import { Counter } from "@/components/site/Counter";
import { Blob } from "@/components/site/Decor";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar, CartesianGrid, YAxis } from "recharts";

const weekData = [
  { d: "Mon", sent: 1200, replied: 180 },
  { d: "Tue", sent: 1850, replied: 264 },
  { d: "Wed", sent: 1420, replied: 210 },
  { d: "Thu", sent: 2340, replied: 388 },
  { d: "Fri", sent: 2810, replied: 442 },
  { d: "Sat", sent: 2210, replied: 315 },
  { d: "Sun", sent: 1620, replied: 240 },
];

const engagementData = [
  { name: "Delivered", value: 98 },
  { name: "Read", value: 82 },
  { name: "Replied", value: 14 },
  { name: "Clicked", value: 21 },
];

const myCampaigns = [
  { name: "Diwali Festival Blast", sent: 4200, delivered: 4115, replied: 512, status: "Running" },
  { name: "New Product Launch", sent: 2800, delivered: 2755, replied: 340, status: "Running" },
  { name: "Weekend Flash Sale", sent: 1900, delivered: 1878, replied: 221, status: "Scheduled" },
];

export default function ClientDashboard() {
  const [name, setName] = useState("there");
  useEffect(() => {
    setName((localStorage.getItem("userName") || "there").split(" ")[0]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/15" />
        <Blob className="absolute -left-10 -bottom-16 w-72 h-72 text-sunny/30" />
        <div className="relative">
          <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Welcome back, {name}</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Your WhatsApp workspace 💬</h1>
          <p className="mt-2 text-white/80 max-w-xl">2 campaigns are running, engagement is up 12% this week and your delivery rate is holding steady above 98%.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/client/campaigns" className="px-5 py-3 rounded-2xl bg-white text-emerald-deep font-bold text-sm shadow-float hover:shadow-lg transition">View campaigns</Link>
            <Link to="/client/reports" className="px-5 py-3 rounded-2xl bg-white/15 backdrop-blur text-white font-bold text-sm border border-white/20 hover:bg-white/25 transition">View reports</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { i: MessageCircle, l: "Messages Sent", n: 14260, s: "", tone: "bg-white text-emerald-deep", trend: "+18%" },
          { i: CheckCheck, l: "Delivery Rate", n: 98, s: "%", tone: "bg-gradient-sun text-emerald-deep", trend: "+0.4%" },
          { i: Users, l: "Total Contacts", n: 8420, s: "", tone: "bg-teal-deep text-white", trend: "+312" },
          { i: Send, l: "Active Campaigns", n: 2, s: "", tone: "bg-emerald-deep text-white", trend: "Live" },
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">This Week</div>
              <h3 className="font-display font-black text-xl text-emerald-deep">Messages sent vs replies</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="cg1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cg2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.16 85)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.82 0.16 85)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                <Area dataKey="sent" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#cg1)" />
                <Area dataKey="replied" stroke="oklch(0.82 0.16 85)" strokeWidth={3} fill="url(#cg2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Engagement</div>
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Funnel breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={70} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" fill="oklch(0.72 0.19 148)" radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-float">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-black text-xl text-emerald-deep">My live campaigns</h3>
          <Link to="/client/campaigns" className="text-sm font-bold text-brand inline-flex items-center gap-1">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {myCampaigns.map((c) => (
            <div key={c.name} className="p-4 rounded-2xl bg-cream">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-deep">{c.name}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === "Running" ? "bg-brand text-white" : "bg-sunny text-emerald-deep"
                }`}>{c.status}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full bg-gradient-brand" style={{ width: `${(c.delivered / c.sent) * 100}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{c.delivered.toLocaleString()} / {c.sent.toLocaleString()}</span>
                <span className="font-bold text-emerald-deep">{c.replied} replies</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
