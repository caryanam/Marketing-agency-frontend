import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, TrendingUp, Users, Send, Calendar, Upload, Plus } from "lucide-react";
import { CLIENTS, TEMPLATES } from "@/lib/admin-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { Blob } from "@/components/site/Decor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useAdminClientDetails, useAdminClientUsage, useAdminClientCampaigns, useAdminClientSubscription } from "@/hooks/admin/useAdminClients";
import { useCreateCampaign } from "@/hooks/admin/useAdminCampaign";

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Car Dealers",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Hospitals",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance Agents",
  FINANCE_COMPANIES: "Finance Companies",
  SCHOOLS_AND_COLLEGES: "Schools And Colleges",
  HOTELS_AND_RESTAURANTS: "Hotels And Restaurants",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  USED_CAR_DEALERS: "🚗",
  CAR_SHOWROOMS: "🏎️",
  HOSPITALS: "🩺",
  GARAGES: "🔧",
  REAL_ESTATE: "🏡",
  INSURANCE_AGENTS: "🛡️",
  FINANCE_COMPANIES: "💰",
  SCHOOLS_AND_COLLEGES: "🎓",
  HOTELS_AND_RESTAURANTS: "🏨",
};

const perfData = [
  { d: "W1", v: 2200 }, { d: "W2", v: 3200 }, { d: "W3", v: 4100 }, { d: "W4", v: 5800 },
  { d: "W5", v: 5100 }, { d: "W6", v: 7200 }, { d: "W7", v: 8400 }, { d: "W8", v: 9600 },
];

const tabs = ["Overview", "Contacts", "Campaigns", "Plans"];

const INITIAL_CONTACTS = [
  { name: "Ananya Sharma", phone: "+91 98100 12011", status: "Active" },
  { name: "Kabir Mehta", phone: "+91 98200 13022", status: "Active" },
  { name: "Pooja Patel", phone: "+91 98300 14033", status: "Active" },
  { name: "Rohan Gupta", phone: "+91 98400 15044", status: "Active" },
  { name: "Siddharth Rao", phone: "+91 98500 16055", status: "Active" },
  { name: "Divya Nair", phone: "+91 98600 17066", status: "Active" },
];

const INITIAL_CAMPAIGNS = [
  { id: 1, name: "Diwali Blast", sent: 8200, status: "Completed" },
  { id: 2, name: "Weekend Special", sent: 4800, status: "Completed" },
  { id: 3, name: "New Model Launch", sent: 3600, status: "Completed" },
  { id: 4, name: "Test Drive Nudge", sent: 1200, status: "Completed" },
];

export default function AdminClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client: apiData, isLoading: isApiLoading } = useAdminClientDetails(id || "");
  const { data: usageData, isLoading: isUsageLoading } = useAdminClientUsage(id || "");
  const { data: campaignsData, isLoading: isCampaignsLoading, refetch: refetchCampaigns } = useAdminClientCampaigns(id || "");
  const { data: activeSub, isLoading: isActiveSubLoading, refetch: refetchSub } = useAdminClientSubscription(id || "");
  
  const createCampaignMutation = useCreateCampaign();

  const msgPercent = usageData && usageData.totalMessagesAllowed ? Math.min(Math.round((usageData.messagesUsed / usageData.totalMessagesAllowed) * 100), 100) : 0;
  const campPercent = usageData && usageData.totalCampaignsAllowed ? Math.min(Math.round((usageData.campaignsUsed / usageData.totalCampaignsAllowed) * 100), 100) : 0;

  const [client, setClient] = useState<any>(null);
  const [tab, setTab] = useState("Overview");

  // Contacts and Campaigns States
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [contactsCount, setContactsCount] = useState(12450);

  // Dialog Controls
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [isCampOpen, setIsCampOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // CSV Import Form States
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Campaign Form States
  const [campName, setCampName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [campTarget, setCampTarget] = useState("3500");

  // Edit Client States
  const [editStatus, setEditStatus] = useState("active");
  const [editPlan, setEditPlan] = useState("Growth");
  const [editBillingBasis, setEditBillingBasis] = useState("monthly");

  useEffect(() => {
    if (apiData) {
      setClient({
        id: String(apiData.id),
        company: apiData.companyName,
        owner: apiData.ownerName,
        category: apiData.category,
        phone: apiData.phoneNumber,
        whatsapp: apiData.whatsappNumber || apiData.phoneNumber,
        email: apiData.email,
        revenue: 0,
        campaigns: 0,
        status: activeSub?.subscriptionStatus === "ACTIVE" ? "active" : "inactive",
        lastActivity: activeSub?.subscriptionStatus ? `Subscription: ${activeSub.subscriptionStatus}` : "No Active Subscription",
        plan: activeSub?.plan?.planName || "No Plan",
        billingBasis: activeSub?.plan?.planType || "monthly",
      });
      setEditStatus(activeSub?.subscriptionStatus === "ACTIVE" ? "active" : "inactive");
      setEditPlan(activeSub?.plan?.planName || "Growth");
      setEditBillingBasis(activeSub?.plan?.planType || "monthly");
      return;
    }

    const found = CLIENTS.find((x) => x.id === id);
    if (found) {
      setClient(found);
      setEditStatus(found.status);
      setEditPlan(found.plan || "Growth");
      setEditBillingBasis(found.billingBasis || "monthly");
    }
  }, [id, apiData, activeSub]);

  const approvedTemplates = TEMPLATES.filter(t => t.status === "Approved");

  // CSV Import Simulator
  const handleCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    const importedContacts = [
      { name: "Amit Kumar (CSV)", phone: "+91 99000 88201", status: "Active" },
      { name: "Neha Singh (CSV)", phone: "+91 99000 88202", status: "Active" },
      { name: "Rajesh Varma (CSV)", phone: "+91 99000 88203", status: "Active" },
    ];

    setContacts(prev => [...importedContacts, ...prev]);
    setContactsCount(prev => prev + importedContacts.length);
    setIsCsvOpen(false);
    setCsvFile(null);
  };

  // Launch Campaign
  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !id) return;

    try {
      await createCampaignMutation.mutateAsync({
        clientId: parseInt(id, 10),
        campaignName: campName.trim(),
      });
      refetchCampaigns();
      setIsCampOpen(false);
      setCampName("");
    } catch (err) {
      // error is already toasted inside the hook
    }
  };

  // Edit Client details
  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClient((prev: any) => ({ ...prev, plan: editPlan, status: editStatus, billingBasis: editBillingBasis }));
    setIsEditOpen(false);
  };

  // Campaign Metrics Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(camp => {
        if (camp.status === "Running") {
          const increment = Math.floor(Math.random() * 8) + 1;
          const target = parseInt(campTarget) || 5000;
          const nextSent = Math.min(camp.sent + increment, target);
          const nextStatus = nextSent >= target ? "Completed" : "Running";
          return {
            ...camp,
            sent: nextSent,
            status: nextStatus
          };
        }
        return camp;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [campTarget]);

  if (isApiLoading || !client) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-4 bg-cream-dark/30 rounded-lg w-24" />
        
        {/* Cover Skeleton */}
        <div className="rounded-[36px] h-56 bg-cream-dark/30 relative overflow-hidden shadow-glow" />

        {/* Profile Card Skeleton */}
        <div className="-mt-20 relative">
          <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6">
            <div className="h-32 w-32 rounded-[32px] bg-cream-dark/30 border-4 border-white shadow-2xl -mt-16 shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="h-7 bg-cream-dark/30 rounded-lg w-1/3" />
              <div className="h-4 bg-cream-dark/30 rounded-lg w-1/2" />
            </div>
          </div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[28px] bg-white p-6 shadow-float space-y-4">
            <div className="h-5 bg-cream-dark/30 rounded-lg w-1/4 mb-6" />
            <div className="space-y-3">
              <div className="h-36 bg-cream rounded-2xl w-full" />
              <div className="h-10 bg-cream rounded-2xl w-full" />
            </div>
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-float space-y-6">
            <div className="h-5 bg-cream-dark/30 rounded-lg w-1/3" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-full bg-cream-dark/30 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-cream-dark/30 rounded-lg w-1/2" />
                    <div className="h-3 bg-cream-dark/30 rounded-lg w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/clients" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-deep hover:text-brand transition">
        <ArrowLeft className="h-4 w-4" /> Back to clients
      </Link>

      {/* Cover */}
      <div className="relative rounded-[36px] h-56 bg-gradient-brand overflow-hidden shadow-glow">
        <Blob className="absolute -right-16 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/20" />
        <div className="absolute top-5 right-5 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === "active" ? "bg-white text-brand" : "bg-white/80 text-emerald-deep"}`}>{client.status.toUpperCase()}</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/30 backdrop-blur text-white">
            {REVERSE_CATEGORY_MAP[client.category] || client.category}
          </span>
        </div>
      </div>

      {/* Profile card */}
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="h-28 w-28 rounded-3xl bg-gradient-brand grid place-items-center text-5xl shadow-glow -mt-16 md:-mt-14 shrink-0 mx-auto md:mx-0">
            {CATEGORY_EMOJIS[client.category] || "💼"}
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="font-display font-black text-2xl md:text-4xl text-emerald-deep capitalize">{client.company}</h1>
            <div className="mt-2 flex flex-col md:flex-row md:flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-3 text-xs md:text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1 capitalize"><Users className="h-3.5 w-3.5 text-brand" /> {client.owner}</span>
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-brand" /> {client.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-brand" /> {client.phone}</span>
              <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5 text-brand" /> {client.whatsapp}</span>
              <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-brand" /> {client.lastActivity}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap w-full md:w-auto">
            <a
              href={`tel:${client.phone ? client.phone.replace(/\D/g, "") : ""}`}
              className="p-3.5 rounded-2xl bg-cream hover:bg-secondary transition flex-1 md:flex-initial text-center"
              title="Call Client"
            >
              <Phone className="h-4 w-4 text-emerald-deep mx-auto" />
            </a>
            <a
              href={`mailto:${client.email}`}
              className="p-3.5 rounded-2xl bg-cream hover:bg-secondary transition flex-1 md:flex-initial text-center"
              title="Email Client"
            >
              <Mail className="h-4 w-4 text-emerald-deep mx-auto" />
            </a>
            <a
              href={`https://wa.me/${client.whatsapp ? (client.whatsapp.replace(/\D/g, "").length === 10 ? "91" + client.whatsapp.replace(/\D/g, "") : client.whatsapp.replace(/\D/g, "")) : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow inline-flex items-center justify-center gap-2 cursor-pointer flex-2 md:flex-initial"
              title="WhatsApp Client"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Analytics (No Revenue metrics, 3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { l: "Campaigns Run", v: usageData ? usageData.campaignsUsed : 0, tone: "bg-white text-emerald-deep" },
          { l: "Messages Sent", v: usageData ? usageData.messagesUsed : 0, tone: "bg-teal-deep text-white" },
          { l: "Remaining Messages", v: usageData ? `${usageData.remainingMessages} / ${usageData.totalMessagesAllowed}` : "N/A", tone: "bg-sky-soft text-emerald-deep" },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`rounded-[24px] p-5 shadow-float ${k.tone}`}>
            <div className="text-xs uppercase tracking-widest opacity-70 font-bold">{k.l}</div>
            <div className="mt-2 font-display font-black text-3xl">{k.v}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-[28px] bg-white p-6 shadow-float">
        <div className="flex gap-2 flex-wrap border-b border-border pb-4">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition cursor-pointer ${tab === t ? "bg-emerald-deep text-white" : "text-muted-foreground hover:bg-cream"
                }`}>{t}</button>
          ))}
        </div>

        {tab === "Overview" && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6">
            {/* Left Hand: Message Volume Area Chart */}
            <div className="lg:col-span-2 rounded-[28px] border border-emerald-100/50 bg-white p-6 shadow-float flex flex-col justify-between">
              <div>
                <h3 className="font-display font-black text-xl text-emerald-deep">Message Dispatch Activity</h3>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Weekly aggregate traffic patterns over the last 8 weeks</p>
              </div>
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfData} margin={{ left: -20, right: 10, top: 10 }}>
                    <defs>
                      <linearGradient id="cd" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }} />
                    <Area dataKey="v" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#cd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Hand: Client Account Metadata */}
            <div className="space-y-4">
              {/* Onboarding Box */}
              <div className="rounded-[24px] border border-emerald-100/40 bg-white p-5 shadow-float flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-deep grid place-items-center shrink-0">
                  <Calendar className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Account Onboarded</div>
                  <div className="font-display font-black text-emerald-deep text-lg mt-0.5">
                    {apiData?.createdAt ? new Date(apiData.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently"}
                  </div>
                </div>
              </div>

              {/* Current Active Plan Card */}
              <div className="rounded-[24px] border border-emerald-100/40 bg-white p-5 shadow-float flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-deep grid place-items-center shrink-0">
                  <Users className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Billing Tier</div>
                  <div className="font-display font-black text-brand text-lg mt-0.5">
                    {activeSub?.plan?.planName ? `${activeSub.plan.planName} Plan` : "No Active Plan"}
                  </div>
                </div>
              </div>

              {/* Message Consumption Summary */}
              <div className="rounded-[24px] border border-emerald-100/40 bg-white p-5 shadow-float space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-deep">
                  <span>Usage Progress</span>
                  <span className="font-mono text-brand">{msgPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-cream overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${msgPercent}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground font-semibold">
                  <span>{usageData?.messagesUsed?.toLocaleString() || 0} sent</span>
                  <span>{usageData?.remainingMessages?.toLocaleString() || 0} left</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Contacts" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-cream/50 p-4 rounded-2xl border border-cream">
              <span className="text-xs text-muted-foreground font-bold text-center sm:text-left">Import CSV list to quickly sync customer data</span>

              <Dialog open={isCsvOpen} onOpenChange={setIsCsvOpen}>
                <DialogTrigger asChild>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" /> Import CSV
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
                  <DialogHeader>
                    <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Import Contacts CSV</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCsvSubmit} className="space-y-5 mt-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-brand/30 hover:border-brand rounded-2xl p-6 text-center cursor-pointer bg-cream/40 transition flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-brand" />
                      <span className="text-sm font-semibold text-emerald-deep">
                        {csvFile ? csvFile.name : "Click to select contacts CSV"}
                      </span>
                      <span className="text-xs text-muted-foreground">Supported format: .csv</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={e => setCsvFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCsvOpen(false);
                          setCsvFile(null);
                        }}
                        className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!csvFile}
                        className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Upload & Sync
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream border border-cream/35">
                  <div className="h-10 w-10 rounded-full bg-gradient-brand grid place-items-center text-white font-bold">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-emerald-deep truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.phone}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand/15 text-brand font-bold shrink-0">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Campaigns" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-cream/50 p-4 rounded-2xl border border-cream">
              <span className="text-xs text-muted-foreground font-bold text-center sm:text-left">Run custom marketing triggers directly to WhatsApp list</span>

              <Dialog open={isCampOpen} onOpenChange={setIsCampOpen}>
                <DialogTrigger asChild>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Create Campaign
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
                  <DialogHeader>
                    <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Create Client Campaign</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLaunchCampaign} className="space-y-4 mt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Campaign Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Clearance Sale Promo"
                        value={campName}
                        onChange={e => setCampName(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                      <button
                        type="button"
                        onClick={() => setIsCampOpen(false)}
                        className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createCampaignMutation.isPending}
                        className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer"
                      >
                        Create Campaign
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {isCampaignsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-deep"></div>
                </div>
              ) : campaignsData && campaignsData.length > 0 ? (
                campaignsData.map((c, i) => (
                  <div key={c.id || i} className="p-4 rounded-2xl bg-cream border border-cream/35 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-deep capitalize">{c.campaignName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Send className="h-3 w-3" /> {(c.messagesSent ?? 0).toLocaleString()} sent
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      c.campaignStatus === "RUNNING" ? "bg-brand text-white" : "bg-teal-deep text-white"
                    }`}>
                      {c.campaignStatus}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground font-semibold">
                  No campaigns run yet.
                </div>
              )}
            </div>
          </div>
        )}


        {tab === "Plans" && (
          <div className="mt-6 space-y-6">
            {isActiveSubLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-deep"></div>
              </div>
            ) : activeSub ? (
              <div className="rounded-[32px] bg-white border border-emerald-100 shadow-float p-6 md:p-8 space-y-8">
                {/* Header Hero Area */}
                <div className="rounded-3xl bg-gradient-brand p-6 md:p-8 text-white relative overflow-hidden shadow-glow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-sunny/20 rounded-full blur-2xl" />
                  <div className="relative space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                      {(activeSub.subscriptionStatus || "INACTIVE").toUpperCase()}
                    </span>
                    <h3 className="font-display font-black text-2xl md:text-3xl">
                      {activeSub.plan?.planName || "Starter"} Plan
                    </h3>
                    <p className="text-xs text-white/80 font-medium">
                      Service Plan Code: <span className="font-mono">{activeSub.plan?.planCode}</span>
                    </p>
                  </div>
                  <div className="relative text-left md:text-right">
                    <div className="text-[10px] uppercase font-black tracking-wider text-white/70">Subscription Cost</div>
                    <div className="font-display font-black text-3xl mt-1">₹{activeSub.amount?.toLocaleString()}</div>
                    <div className="text-[11px] font-semibold text-white/80 mt-1">
                      Valid for {activeSub.plan?.validityDays || 30} days · {activeSub.plan?.planType}
                    </div>
                  </div>
                </div>

                {/* Progress Bars and Resource Quota */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Messages Quota Progress */}
                  <div className="p-6 rounded-2xl bg-cream border border-cream/50 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-deep">Message Consumption</span>
                      <span className="font-mono text-muted-foreground">{msgPercent}% Used</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-emerald-100/50 overflow-hidden">
                      <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${msgPercent}%` }} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Used</div>
                        <div className="font-display font-black text-emerald-deep text-lg mt-0.5">{usageData?.messagesUsed?.toLocaleString() || 0}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Remaining</div>
                        <div className="font-display font-black text-brand text-lg mt-0.5">{usageData?.remainingMessages?.toLocaleString() || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Campaigns Quota Progress */}
                  <div className="p-6 rounded-2xl bg-cream border border-cream/50 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-deep">Campaigns Run Limit</span>
                      <span className="font-mono text-muted-foreground">{campPercent}% Used</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-emerald-100/50 overflow-hidden">
                      <div className="h-full bg-teal-deep rounded-full transition-all duration-500" style={{ width: `${campPercent}%` }} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Used</div>
                        <div className="font-display font-black text-emerald-deep text-lg mt-0.5">{usageData?.campaignsUsed || 0}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Limit</div>
                        <div className="font-display font-black text-teal-deep text-lg mt-0.5">{usageData?.totalCampaignsAllowed || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Plan Metadata */}
                <div className="p-6 rounded-2xl border border-cream bg-white space-y-4">
                  <h4 className="font-display font-black text-emerald-deep text-lg">Subscription Timeline</h4>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs font-semibold text-muted-foreground">
                    <div className="p-4 rounded-xl bg-cream">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Purchase Date</div>
                      <div className="font-black text-emerald-deep mt-1">
                        {activeSub.purchaseDate ? new Date(activeSub.purchaseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }) : "—"}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-cream">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Approved Date</div>
                      <div className="font-black text-emerald-deep mt-1">
                        {activeSub.approvedDate ? new Date(activeSub.approvedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }) : "—"}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-cream">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Expiry Date</div>
                      <div className="font-black text-red-600 mt-1">
                        {activeSub.expiryDate ? new Date(activeSub.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }) : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground font-semibold bg-cream rounded-3xl border border-brand/5">
                Client has no active subscription plans currently.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
