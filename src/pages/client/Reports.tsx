import { Download, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const monthly = [
  { m: "Jan", sent: 12400, replied: 1820 },
  { m: "Feb", sent: 15800, replied: 2210 },
  { m: "Mar", sent: 18200, replied: 2540 },
  { m: "Apr", sent: 21100, replied: 3020 },
  { m: "May", sent: 24800, replied: 3540 },
  { m: "Jun", sent: 28900, replied: 4120 },
  { m: "Jul", sent: 32400, replied: 4680 },
];

const channels = [
  { name: "Marketing", value: 62, color: "oklch(0.72 0.19 148)" },
  { name: "Utility", value: 24, color: "oklch(0.82 0.16 85)" },
  { name: "Authentication", value: 14, color: "oklch(0.55 0.13 200)" },
];

const topCampaigns = [
  { name: "Diwali Blast", rate: 92 },
  { name: "Product Launch", rate: 88 },
  { name: "Flash Sale", rate: 79 },
  { name: "Cart Reminder", rate: 74 },
  { name: "Monsoon Offer", rate: 68 },
];

export default function ClientReports() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Analytics</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep insights across your WhatsApp performance.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-glow hover:shadow-lg transition">
          <Download className="h-4 w-4" /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { l: "Total Messages", v: "153,600", t: "+21% vs last 6mo" },
          { l: "Avg. Delivery", v: "98.2%", t: "+0.6%" },
          { l: "Avg. Read Rate", v: "82.4%", t: "+3.1%" },
          { l: "Reply Rate", v: "14.6%", t: "+1.4%" },
        ].map((k) => (
          <div key={k.l} className="rounded-[24px] bg-white p-5 shadow-float">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-2 font-display font-black text-3xl text-emerald-deep">{k.v}</div>
            <div className="mt-1 text-xs text-brand font-bold flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {k.t}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[28px] bg-white p-6 shadow-float">
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Monthly Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rg1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
                <Area dataKey="sent" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#rg1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Message mix</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channels} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {channels.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {channels.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /><span className="font-semibold text-emerald-deep">{c.name}</span></div>
                <span className="font-bold text-emerald-deep">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-float">
        <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Top campaigns by engagement</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCampaigns} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="rate" fill="oklch(0.72 0.19 148)" radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
