import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, MessageCircle, Users, Send, ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/site/Counter";
import { Blob } from "@/components/site/Decor";
import { useAdminAnalytics } from "@/hooks/admin/useAdminSubscription";
import { useAdminClients } from "@/hooks/admin/useAdminClients";
import { useAdminCampaigns } from "@/hooks/admin/useAdminCampaign";
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

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Cars",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Healthcare",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance",
  FINANCE_COMPANIES: "Finance",
  SCHOOLS_AND_COLLEGES: "Education",
  HOTELS_AND_RESTAURANTS: "Hospitality",
};

export default function AdminDashboard() {
  const { data: analytics, isLoading: isAnalyticsLoading } = useAdminAnalytics();
  const { clients, isLoading: isClientsLoading } = useAdminClients();
  const { data: campaigns, isLoading: isCampaignsLoading } = useAdminCampaigns();

  if (isAnalyticsLoading || isClientsLoading || isCampaignsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-[32px] bg-gradient-to-r from-emerald-800/10 to-teal-800/10 p-8 h-48 flex flex-col justify-center">
          <div className="h-3 w-32 bg-emerald-800/20 rounded-md" />
          <div className="h-8 w-64 bg-emerald-800/20 rounded-lg mt-3" />
          <div className="h-4 w-96 bg-emerald-800/20 rounded-md mt-2" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-[28px] bg-white border border-cream p-6 h-36 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-2xl bg-cream" />
                <div className="h-5 w-12 bg-cream rounded-full" />
              </div>
              <div>
                <div className="h-7 w-24 bg-cream rounded-lg" />
                <div className="h-3 w-16 bg-cream/70 rounded-md mt-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="rounded-[28px] bg-white border border-cream p-6 h-80 flex flex-col justify-between shadow-xs">
          <div>
            <div className="h-3.5 w-24 bg-cream rounded-md" />
            <div className="h-5 w-48 bg-cream rounded-md mt-2" />
          </div>
          <div className="h-48 w-full bg-cream/40 rounded-2xl mt-4" />
        </div>

        {/* Bottom Row Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-[28px] bg-white border border-cream p-6 h-[340px] shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <div className="h-5 w-32 bg-cream rounded-md" />
                <div className="h-4 w-16 bg-cream rounded-md" />
              </div>
              <div className="space-y-3.5">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3 p-3 rounded-2xl border border-cream/20">
                    <div className="h-12 w-12 rounded-2xl bg-cream shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 bg-cream rounded-md" />
                      <div className="h-3 w-20 bg-cream/70 rounded-md" />
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-4 w-16 bg-cream rounded-md ml-auto" />
                      <div className="h-3 w-24 bg-cream/70 rounded-md ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalCount = analytics?.totalMessagesSent || 0;
  const activeSubs = analytics?.totalActiveSubscriptions || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const totalCampaigns = analytics?.totalCampaignsRun || 0;

  const stats = [
    { i: MessageCircle, l: "Messages Sent", n: totalCount, s: "", tone: "bg-white text-emerald-deep", trend: "Volume" },
    { i: TrendingUp, l: "Platform Revenue", n: totalRevenue, s: "", tone: "bg-gradient-sun text-emerald-deep", trend: "Revenue" },
    { i: Users, l: "Active Subscriptions", n: activeSubs, s: "", tone: "bg-teal-deep text-white", trend: "Clients" },
    { i: Send, l: "Campaigns Run", n: totalCampaigns, s: "", tone: "bg-emerald-deep text-white", trend: "Live" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/15" />
        <Blob className="absolute -left-10 -bottom-16 w-72 h-72 text-sunny/30" />
        <div className="relative">
          <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Welcome back, Aarav</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Platform Operations Dashboard</h1>
          <p className="mt-2 text-white/80 max-w-xl">
            Monitor real-time WhatsApp revenue, campaigns lifecycle operations, and payment receipts moderation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-[28px] p-6 shadow-float ${k.tone}`}>
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur grid place-items-center"><k.i className="h-5 w-5" /></div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20">{k.trend}</span>
            </div>
            <div className="mt-5 font-display font-black text-3xl">
              {k.l.includes("Revenue") ? "₹" : ""}
              <Counter to={k.n} suffix={k.s} />
            </div>
            <div className="text-xs opacity-70 mt-1 font-semibold">{k.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="w-full">
        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">Weekly Chart</div>
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
            {clients.slice(0, 4).map((c) => (
              <Link key={c.id} to={`/admin/clients/${c.id}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-cream transition">
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center text-xl font-bold uppercase shadow-float shrink-0">
                  {c.companyName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-emerald-deep truncate">{c.companyName}</div>
                  <div className="text-xs text-muted-foreground">{REVERSE_CATEGORY_MAP[c.category] || c.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-deep text-sm truncate">{c.ownerName}</div>
                  <div className="text-[10px] text-brand font-semibold truncate">{c.email}</div>
                </div>
              </Link>
            ))}
            {clients.length === 0 && (
              <p className="text-sm text-muted-foreground italic font-medium p-4 text-center">No active clients registered yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-xl text-emerald-deep">Live Campaigns</h3>
            <Link to="/admin/campaigns" className="text-sm font-bold text-brand inline-flex items-center gap-1">See all <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-3">
            {campaigns?.slice(0, 4).map((c) => {
              const clientObj = clients.find(cl => cl.id === c.clientId);
              const companyName = clientObj ? clientObj.companyName : `Client #${c.clientId}`;

              return (
                <div key={c.id} className="p-4 rounded-2xl bg-cream flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-deep text-sm">{c.campaignName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{companyName}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      c.campaignStatus === "RUNNING" ? "bg-brand text-white" : 
                      c.campaignStatus === "CREATED" ? "bg-sunny text-emerald-deep" : "bg-teal-deep text-white"
                    }`}>{c.campaignStatus}</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white overflow-hidden">
                    <div className="h-full bg-gradient-brand" style={{ width: c.campaignStatus === "RUNNING" ? "65%" : c.campaignStatus === "COMPLETED" ? "100%" : "0%" }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-muted-foreground font-semibold">
                    <span>{c.messagesSent.toLocaleString()} messages sent</span>
                    <span className="font-bold text-emerald-deep">Status: {c.campaignStatus}</span>
                  </div>
                </div>
              );
            })}
            {(!campaigns || campaigns.length === 0) && (
              <p className="text-sm text-muted-foreground italic font-medium p-4 text-center">No campaigns created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
