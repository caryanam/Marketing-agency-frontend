import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TrendingUp, MessageCircle, Users, Send, ArrowUpRight, CheckCheck, HelpCircle } from "lucide-react";
import { Counter } from "@/components/site/Counter";
import { Blob } from "@/components/site/Decor";
import { useClientSubscriptionUsage, useClientCampaigns } from "@/hooks/client/useClientSubscription";
import { useClientProfile } from "@/hooks/client/useClientProfile";
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

export default function ClientDashboard() {
  const { client, isLoading: isProfileLoading } = useClientProfile();
  const { data: usage, isLoading: isUsageLoading } = useClientSubscriptionUsage();
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useClientCampaigns();

  const isLoading = isProfileLoading || isUsageLoading || isCampaignsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-[32px] bg-gradient-to-r from-emerald-800/10 to-teal-800/10 p-8 h-56 flex flex-col justify-center">
          <div className="h-3 w-32 bg-emerald-800/20 rounded-md" />
          <div className="h-8 w-72 bg-emerald-800/20 rounded-lg mt-3" />
          <div className="h-4 w-96 bg-emerald-800/20 rounded-md mt-2" />
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-28 bg-white/40 rounded-2xl" />
            <div className="h-10 w-36 bg-white/20 rounded-2xl" />
          </div>
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

        {/* Graphs Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[28px] bg-white border border-cream p-6 h-80 flex flex-col justify-between shadow-xs">
            <div>
              <div className="h-3.5 w-24 bg-cream rounded-md" />
              <div className="h-5 w-48 bg-cream rounded-md mt-2" />
            </div>
            <div className="h-48 w-full bg-cream/40 rounded-2xl mt-4" />
          </div>
          <div className="rounded-[28px] bg-white border border-cream p-6 h-80 flex flex-col justify-between shadow-xs">
            <div>
              <div className="h-3.5 w-24 bg-cream rounded-md" />
              <div className="h-5 w-32 bg-cream rounded-md mt-2" />
            </div>
            <div className="h-48 w-full bg-cream/40 rounded-2xl mt-4" />
          </div>
        </div>

        {/* Active Marketing Campaigns Snippet Skeleton */}
        <div className="rounded-[28px] bg-white border border-cream p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 w-48 bg-cream rounded-md" />
            <div className="h-4 w-16 bg-cream rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl border border-cream bg-cream/30 h-[120px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-cream rounded-md" />
                  <div className="h-5 w-16 bg-cream rounded-full" />
                </div>
                <div className="h-1.5 rounded-full bg-cream w-full" />
                <div className="flex justify-between">
                  <div className="h-3.5 w-16 bg-cream rounded-md" />
                  <div className="h-3.5 w-24 bg-cream rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const clientName = client?.ownerName || "Customer";
  const messagesUsed = usage?.messagesUsed ?? 0;
  const messagesAllowed = usage?.totalMessagesAllowed ?? 0;
  const remainingMessages = usage?.remainingMessages ?? 0;
  const campaignsUsed = usage?.campaignsUsed ?? 0;
  const campaignsAllowed = usage?.totalCampaignsAllowed ?? 0;

  const liveCampaigns = campaigns.filter((c) => c.campaignStatus === "RUNNING");

  const engagementData = [
    { name: "Delivered", value: messagesUsed > 0 ? 98 : 0 },
    { name: "Read", value: messagesUsed > 0 ? 82 : 0 },
    { name: "Replied", value: messagesUsed > 0 ? 15 : 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/15" />
        <Blob className="absolute -left-10 -bottom-16 w-72 h-72 text-sunny/30" />
        <div className="relative">
          <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Welcome back, {clientName}</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Your WhatsApp workspace 💬</h1>
          <p className="mt-2 text-white/80 max-w-xl">
            {liveCampaigns.length} campaigns currently running. Active Plan:{" "}
            <span className="font-bold text-sunny">{usage?.planName || "None"}</span>. Validity days left:{" "}
            <span className="font-bold text-white">{usage?.daysRemaining || "0"}</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/client/campaigns"
              className="px-5 py-3 rounded-2xl bg-white text-emerald-deep font-bold text-sm shadow-float hover:shadow-lg transition"
            >
              My Campaigns
            </Link>
            <Link
              to="/client/plans"
              className="px-5 py-3 rounded-2xl bg-white/15 backdrop-blur text-white font-bold text-sm border border-white/20 hover:bg-white/25 transition"
            >
              Subscription Billing
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { i: MessageCircle, l: "Messages Dispatched", n: messagesUsed, s: "", tone: "bg-white text-emerald-deep", trend: "Volume" },
          { i: CheckCheck, l: "Remaining Allocation", n: remainingMessages, s: "", tone: "bg-gradient-sun text-emerald-deep", trend: "Left" },
          { i: Users, l: "Allowed Messages", n: messagesAllowed, s: "", tone: "bg-teal-deep text-white", trend: "Plan Cap" },
          { i: Send, l: "Campaigns Dispatched", n: campaignsUsed, s: ` / ${campaignsAllowed}`, tone: "bg-emerald-deep text-white", trend: "Limits" },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-[28px] p-6 shadow-float ${k.tone}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
                <k.i className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20">{k.trend}</span>
            </div>
            <div className="mt-5 font-display font-black text-3xl flex items-baseline">
              <Counter to={k.n} />
              {k.s && <span className="text-sm font-semibold opacity-85 ml-1">{k.s}</span>}
            </div>
            <div className="text-xs opacity-70 mt-1 font-semibold">{k.l}</div>
          </motion.div>
        ))}
      </div>

      {/* Graphs - Stacked in separate rows */}
      <div className="space-y-6">
        {/* Row 1: Messaging Usage Chart */}
        <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">Usage chart</div>
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

        {/* Row 2: Delivery Quality Funnel */}
        <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/30">
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Delivery Quality</div>
          <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Quality funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} layout="vertical" margin={{ left: 8, right: 24 }}>
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

      {/* Campaigns list snippet */}
      <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-black text-xl text-emerald-deep">Active Marketing Campaigns</h3>
          <Link to="/client/campaigns" className="text-sm font-bold text-brand inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {campaigns.slice(0, 3).map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-cream border border-cream/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-deep text-sm truncate max-w-[120px]">{c.campaignName}</div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${c.campaignStatus === "RUNNING"
                    ? "bg-brand text-white"
                    : "bg-sunny text-emerald-deep"
                    }`}
                >
                  {c.campaignStatus}
                </span>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-white overflow-hidden">
                <div className="h-full bg-gradient-brand" style={{ width: c.campaignStatus === "RUNNING" ? "65%" : "0%" }} />
              </div>
              <div className="mt-2.5 flex justify-between text-[11px] text-muted-foreground font-semibold">
                <span>{c.messagesSent.toLocaleString()} sent</span>
                <span className="font-bold text-emerald-deep">Status: {c.campaignStatus}</span>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <p className="md:col-span-3 text-sm text-muted-foreground italic font-medium p-4 text-center">
              No campaigns dispatched under this active subscription yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
