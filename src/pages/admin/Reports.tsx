import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Blob } from "@/components/site/Decor";
import { Counter } from "@/components/site/Counter";

const monthly = [
  { m: "Jan", sent: 24000 },
  { m: "Feb", sent: 28000 },
  { m: "Mar", sent: 34000 },
  { m: "Apr", sent: 41000 },
  { m: "May", sent: 46000 },
  { m: "Jun", sent: 52000 },
  { m: "Jul", sent: 61000 },
  { m: "Aug", sent: 68000 },
];

const industryMix = [
  { name: "Automotive", value: 34, color: "oklch(0.72 0.19 148)" },
  { name: "Healthcare", value: 22, color: "oklch(0.55 0.14 195)" },
  { name: "Real Estate", value: 18, color: "oklch(0.9 0.17 92)" },
  { name: "Finance", value: 14, color: "oklch(0.35 0.09 165)" },
  { name: "Other", value: 12, color: "oklch(0.72 0.18 55)" },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-teal text-white p-8 shadow-glow relative overflow-hidden">
        <Blob className="absolute -right-20 -top-20 w-80 h-80 text-brand/30" />
        <div className="relative">
          <div className="text-white/70 text-xs uppercase tracking-widest font-bold">Performance</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Reports & Analytics</h1>
          <p className="mt-2 text-white/70 max-w-lg">Your agency's health, at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { l: "Total Sent (YTD)", n: 354000, s: "", tone: "bg-white text-emerald-deep" },
          { l: "Avg. CTR", n: 42, s: "%", tone: "bg-emerald-deep text-white" },
          { l: "Client Retention", n: 96, s: "%", tone: "bg-gradient-sun text-emerald-deep" },
        ].map((k, i) => (
          <div key={i} className={`rounded-[24px] p-6 shadow-float ${k.tone}`}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">{k.l}</div>
            <div className="mt-3 font-display font-black text-3xl"><Counter to={k.n} suffix={k.s} /></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[28px] bg-white p-6 shadow-float">
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Messages Sent Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="rs" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.02 150)" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
                <Area dataKey="sent" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#rs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Industry Mix</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={industryMix} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={4}>
                  {industryMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {industryMix.map((e) => (
              <div key={e.name} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
                <span className="flex-1 text-emerald-deep">{e.name}</span>
                <span className="font-black text-emerald-deep">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-float">
        <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Monthly Sends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.02 150)" />
              <XAxis dataKey="m" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
              <Legend />
              <Bar dataKey="sent" fill="oklch(0.72 0.19 148)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
