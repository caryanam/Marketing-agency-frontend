import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, TrendingUp, Users, Send, Calendar, Upload, Plus } from "lucide-react";
import { CLIENTS, TEMPLATES } from "@/lib/admin-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { Blob } from "@/components/site/Decor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useAdminClientDetails } from "@/hooks/admin/useAdminClients";

const perfData = [
  { d: "W1", v: 2200 }, { d: "W2", v: 3200 }, { d: "W3", v: 4100 }, { d: "W4", v: 5800 },
  { d: "W5", v: 5100 }, { d: "W6", v: 7200 }, { d: "W7", v: 8400 }, { d: "W8", v: 9600 },
];

const tabs = ["Overview", "Contacts", "Campaigns", "Notes", "Timeline", "Plans"];

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
        revenue: 15000,
        campaigns: 4,
        status: "active",
        lastActivity: "Active now",
        plan: "Growth",
        billingBasis: "monthly",
      });
      setEditStatus("active");
      setEditPlan("Growth");
      setEditBillingBasis("monthly");
      return;
    }

    const found = CLIENTS.find((x) => x.id === id);
    if (found) {
      setClient(found);
      setEditStatus(found.status);
      setEditPlan(found.plan || "Growth");
      setEditBillingBasis(found.billingBasis || "monthly");
    }
  }, [id, apiData]);

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
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !templateId) return;

    const newCamp = {
      id: campaigns.length + 1,
      name: campName,
      sent: parseInt(campTarget) || 1000,
      status: "Running"
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setIsCampOpen(false);

    setCampName("");
    setTemplateId("");
    setCampTarget("3500");
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

  if (!client) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-deep"></div>
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
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/30 backdrop-blur text-white">{client.category}</span>
        </div>
      </div>

      {/* Profile card */}
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6">
          <div className="h-28 w-28 rounded-3xl bg-gradient-brand grid place-items-center text-5xl shadow-glow -mt-14">{client.emoji}</div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-black text-3xl md:text-4xl text-emerald-deep">{client.company}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-brand" /> {client.owner}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-brand" /> Bengaluru</span>
              <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-brand" /> {client.lastActivity}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-secondary font-bold transition text-sm cursor-pointer">
                  Edit Plan & Status
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
                <DialogHeader>
                  <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Edit Client Plan & Status</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateClient} className="space-y-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="trial">Trial</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Subscription Plan</label>
                    <select
                      value={editPlan}
                      onChange={e => setEditPlan(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Growth">Growth</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Billing Basis</label>
                    <select
                      value={editBillingBasis}
                      onChange={e => setEditBillingBasis(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <a href={`tel:${client.phone}`} className="p-3 rounded-2xl bg-cream hover:bg-secondary transition"><Phone className="h-4 w-4 text-emerald-deep" /></a>
            <a href={`mailto:${client.email}`} className="p-3 rounded-2xl bg-cream hover:bg-secondary transition"><Mail className="h-4 w-4 text-emerald-deep" /></a>
            <a href="#" className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow inline-flex items-center gap-2 cursor-pointer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Analytics (No Revenue metrics, 3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { l: "Campaigns", v: campaigns.length, tone: "bg-white text-emerald-deep" },
          { l: "Contacts", v: contactsCount.toLocaleString(), tone: "bg-teal-deep text-white" },
          { l: "Reply Rate", v: "18.2%", tone: "bg-sky-soft text-emerald-deep" },
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
            <div className="lg:col-span-2">
              <h3 className="font-display font-black text-xl text-emerald-deep mb-3">Message Volume — Last 8 Weeks</h3>
              <div className="h-64 rounded-2xl bg-cream p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfData}>
                    <defs>
                      <linearGradient id="cd" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.72 0.19 148)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
                    <Area dataKey="v" stroke="oklch(0.72 0.19 148)" strokeWidth={3} fill="url(#cd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-cream p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase">Onboarded</div>
                <div className="font-black text-emerald-deep">March 12, 2024</div>
              </div>
              <div className="rounded-2xl bg-cream p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase">Account Owner</div>
                <div className="font-black text-emerald-deep">Aarav Menon</div>
              </div>
              <div className="rounded-2xl bg-cream p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase">Plan</div>
                <div className="font-black text-emerald-deep">
                  {client.plan || "Growth"} {client.plan === "Starter" ? (client.billingBasis === "daily" ? "(₹499/day)" : "(₹14,999/mo)") : client.plan === "Enterprise" ? "(Custom)" : (client.billingBasis === "daily" ? "(₹1,199/day)" : "(₹34,999/mo)")}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Contacts" && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center bg-cream/50 p-4 rounded-2xl border border-cream">
              <span className="text-xs text-muted-foreground font-bold">Import CSV list to quickly sync customer data</span>

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
            <div className="flex justify-between items-center bg-cream/50 p-4 rounded-2xl border border-cream">
              <span className="text-xs text-muted-foreground font-bold">Run custom marketing triggers directly to WhatsApp list</span>

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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Target Size</label>
                        <input
                          type="number"
                          required
                          min="1"
                          placeholder="e.g. 3500"
                          value={campTarget}
                          onChange={e => setCampTarget(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">WhatsApp Template</label>
                        <select
                          required
                          value={templateId}
                          onChange={e => setTemplateId(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select message template...</option>
                          {approvedTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
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
                        className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer"
                      >
                        Launch Campaign
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {campaigns.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-cream border border-cream/35 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-deep">{c.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Send className="h-3 w-3" /> {c.sent.toLocaleString()} sent
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${c.status === "Running" ? "bg-brand text-white" : "bg-teal-deep text-white"
                    }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Notes" && (
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-2xl bg-cream">
              <div className="text-xs text-muted-foreground">Aug 12</div>
              <div className="mt-1 text-emerald-deep">Client wants to launch a monsoon promo mid-August. Coordinating creatives with in-house team.</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream">
              <div className="text-xs text-muted-foreground">Jul 30</div>
              <div className="mt-1 text-emerald-deep">Quarterly review call scheduled. Aim to upsell to Enterprise plan.</div>
            </div>
          </div>
        )}

        {tab === "Timeline" && (
          <div className="mt-6 relative pl-6 border-l-2 border-dashed border-brand/40 space-y-6">
            {[
              { t: "Campaign launched", d: "Diwali Blast · 8,200 recipients", w: "2 min ago" },
              { t: "Template approved", d: "New offer template cleared Meta review", w: "yesterday" },
              { t: "Contacts imported", d: "1,240 new contacts synced from CRM", w: "3 days ago" },
              { t: "Payment received", d: "₹34,999 · Growth plan", w: "a week ago" },
            ].map((e, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[30px] top-1 h-4 w-4 rounded-full bg-gradient-brand shadow-glow" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> {e.w}</div>
                <div className="mt-1 font-bold text-emerald-deep">{e.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{e.d}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "Plans" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-[24px] bg-cream p-6 border border-brand/10">
              <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Subscription & Plan Details</h3>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl shadow-float">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Plan</div>
                  <div className="font-black text-brand text-2xl mt-1">{client.plan || "Growth"} Plan</div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-float">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pricing Tier</div>
                  <div className="font-black text-emerald-deep text-2xl mt-1">
                    {client.plan === "Starter"
                      ? (client.billingBasis === "daily" ? "₹499/day" : "₹14,999/month")
                      : client.plan === "Enterprise"
                        ? "Custom Pricing"
                        : (client.billingBasis === "daily" ? "₹1,199/day" : "₹34,999/month")}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-float">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Status</div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${client.status === "active" ? "bg-brand/15 text-brand" : client.status === "trial" ? "bg-sunny/45 text-emerald-deep" : "bg-muted text-muted-foreground"
                    }`}>{client.status}</span>
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-2xl shadow-float">
                <h4 className="font-display font-black text-lg text-emerald-deep mb-3">Included Features</h4>
                <ul className="space-y-3.5 text-sm text-muted-foreground font-semibold">
                  {client.plan === "Starter" ? (
                    <>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Up to 10K messages/mo</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ 1 campaign per week</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Basic templates</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Standard analytics</li>
                    </>
                  ) : client.plan === "Enterprise" ? (
                    <>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Unlimited messages</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ White-glove onboarding & dedicated strategist</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Meta green-tick setup</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Custom CRM integrations</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ 24/7 SLA Support</li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Up to 50K messages/mo</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Unlimited campaigns</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Meta green-tick setup</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Dedicated strategist</li>
                      <li className="flex items-center gap-2 text-emerald-deep">✓ Advanced analytics & CRM integration</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
