import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  CheckCheck,
  Eye,
  MessageCircle,
  Plus,
  Lock,
  LayoutTemplate,
  Users,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Play,
  Pause,
  XCircle,
  Activity
} from "lucide-react";
import {
  useAdminCampaigns,
  useCreateCampaign,
  useStartCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useCancelCampaign,
  useCampaignStats,
  CampaignDetailResponseDTO
} from "@/hooks/admin/useAdminCampaign";
import { useAdminClients, useAdminClientUsage, useAdminCustomerData } from "@/hooks/admin";
import { WHATSAPP_TEMPLATES } from "@/lib/templates-data";
import { useWhatsAppTemplates } from "@/hooks/useWhatsAppTemplates";
import { useImageUpload } from "@/hooks/useImageUpload";

// Sub-component to fetch and render stats for a single campaign
function CampaignStatsView({ campaign }: { campaign: CampaignDetailResponseDTO }) {
  const { data: stats } = useCampaignStats(campaign.id);
  const displayStats = stats || campaign; // Fallback to initial campaign data

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { l: "Total", v: displayStats.totalRecipients || 0, tone: "bg-slate-100 text-slate-700" },
          { l: "Queued", v: displayStats.queued || 0, tone: "bg-blue-50 text-blue-700" },
          { l: "Processing", v: displayStats.processing || 0, tone: "bg-sunny/40 text-emerald-deep" },
          { l: "Sent", v: displayStats.sent || displayStats.messagesSent || 0, tone: "bg-cream text-emerald-deep" },
          { l: "Delivered", v: displayStats.delivered || 0, tone: "bg-brand/10 text-brand" },
          { l: "Failed", v: displayStats.failed || 0, tone: "bg-red-50 text-red-600" },
        ].map((s) => (
          <div key={s.l} className={`rounded-2xl p-3 ${s.tone}`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase opacity-80">
               {s.l}
            </div>
            <div className="mt-1 font-display font-black text-xl">{s.v.toLocaleString()}</div>
          </div>
        ))}
      </div>
      
      <div className="h-2 rounded-full bg-cream overflow-hidden relative">
        <div
          className="absolute left-0 top-0 h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${displayStats.completionPercentage || 0}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
        <span>{displayStats.completionPercentage || 0}% Completed</span>
        <span>{displayStats.deliveryRate || 0}% Delivery Rate</span>
      </div>
    </div>
  );
}

export default function AdminCampaigns() {
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useAdminCampaigns();
  const { clients = [], isLoading: isClientsLoading } = useAdminClients();
  const { data: whatsappTemplates = WHATSAPP_TEMPLATES } = useWhatsAppTemplates();

  const createCampaignMutation = useCreateCampaign();
  const startCampaignMutation = useStartCampaign();
  const pauseCampaignMutation = usePauseCampaign();
  const resumeCampaignMutation = useResumeCampaign();
  const cancelCampaignMutation = useCancelCampaign();

  // View state: "list" or "create" full page
  const [view, setView] = useState<"list" | "create">("list");
  const [name, setName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);

  // Dynamic template inputs state
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

  const imageUploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 20MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setHeaderImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Query selected client's live usage and database contacts count
  const { data: usageData } = useAdminClientUsage(selectedClientId);
  const { customerData } = useAdminCustomerData(selectedClientId);

  const selectedTemplate = whatsappTemplates.find((t) => Number(t.id) === Number(selectedTemplateId)) || whatsappTemplates[0] || WHATSAPP_TEMPLATES[0];

  useEffect(() => {
    if (selectedTemplate) {
      if (selectedTemplate.defaultHeaderUrl) {
        setHeaderImageUrl(selectedTemplate.defaultHeaderUrl);
      } else {
        setHeaderImageUrl("");
      }
      const initialValues: Record<string, string> = {};
      selectedTemplate.variables?.forEach((v) => {
        if (v.defaultValue) {
          initialValues[v.name] = v.defaultValue;
        }
      });
      setTemplateValues(initialValues);
    }
  }, [selectedTemplateId, selectedTemplate]);

  const totalClientContacts = customerData ? customerData.length : 0;
  const remainingQuota = usageData?.remainingMessages ?? 0;
  const totalQuota = usageData?.totalMessagesAllowed ?? 0;
  const campaignsUsed = usageData?.campaignsUsed ?? 0;
  const totalCampaignsAllowed = usageData?.totalCampaignsAllowed ?? 0;

  // Auto-filled message target limit
  const autoTargetCount = totalClientContacts > 0
    ? (remainingQuota > 0 ? Math.min(totalClientContacts, remainingQuota) : totalClientContacts)
    : 0;

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedClientId) return;

    // Convert flat templateValues to mapping array
    const variableMappings = selectedTemplate.variables?.map((v, index) => {
      // Hardcode Variable 1 (usually {{1}}) to auto-fetch the customer name
      if (index === 0) {
        return {
          variableIndex: 1,
          variableType: "DYNAMIC" as const,
          fieldName: "name"
        };
      }

      const val = templateValues[v.name] || v.defaultValue || "";
      // Simple heuristic: if it looks like {FieldName}, we treat it as dynamic
      if (val.startsWith("{") && val.endsWith("}")) {
        return {
          variableIndex: index + 1,
          variableType: "DYNAMIC" as const,
          fieldName: val.replace(/[{}]/g, "")
        };
      }
      return {
        variableIndex: index + 1,
        variableType: "STATIC" as const,
        staticValue: val
      };
    }) || [];

    await createCampaignMutation.mutateAsync({
      clientId: parseInt(selectedClientId, 10),
      campaignName: name.trim(),
      templateId: selectedTemplateId,
      headerImageUrl: headerImageUrl || undefined,
      variableMappings,
      messageLimit: autoTargetCount // Optional based on the backend
    });

    setView("list");
    setName("");
    setSelectedClientId("");
    setTemplateValues({});
  };

  const renderBodyPreview = () => {
    let text = selectedTemplate?.bodyTemplate || "";
    selectedTemplate?.variables?.forEach((v, index) => {
      let val = templateValues[v.name] || v.placeholder || `{{${index + 1}}}`;
      if (index === 0) {
        val = "{Customer Name}";
      }
      text = text.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), val);
    });
    return text;
  };

  const isLoading = isCampaignsLoading || isClientsLoading;

  if (view === "create") {
    return (
      <div className="space-y-6 font-sans">
        {/* Full Page Header Banner */}
        <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-sunny/20 blur-2xl pointer-events-none" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-white/80 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4 text-sunny" /> Campaign Studio
              </div>
              <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">Create WhatsApp Campaign</h1>
              <p className="mt-2 text-white/80 max-w-lg font-medium">Design and launch high-converting WhatsApp messages with dynamic templates and auto-calculated audience limits.</p>
            </div>

            <button
              onClick={() => setView("list")}
              className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold backdrop-blur transition cursor-pointer flex items-center gap-2 border border-white/20 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Campaigns List
            </button>
          </div>
        </div>

        {/* Full Page 2-Column Form Layout */}
        <form onSubmit={handleLaunch} className="grid lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-6 rounded-[32px] bg-white p-6 md:p-8 shadow-float border border-emerald-100/50">
            <h2 className="font-display font-black text-xl text-emerald-deep flex items-center gap-2 pb-3 border-b border-cream">
              <Sparkles className="h-5 w-5 text-brand" /> 1. Campaign & Client Configuration
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Flash Sale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Select Target Client</label>
                <select
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.companyName} ({c.ownerName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedClientId && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-brand" /> Client Plan & Audience Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                    CLIENT #{selectedClientId}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/90 border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Imported Contacts</div>
                    <div className="font-display font-black text-emerald-deep text-lg mt-0.5">
                      {totalClientContacts.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Messages Remaining</div>
                    <div className="font-display font-black text-brand text-lg mt-0.5">
                      {remainingQuota.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-emerald-100 shadow-2xs">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Campaigns Used</div>
                    <div className="font-display font-black text-teal-deep text-lg mt-0.5">
                      {campaignsUsed} / {totalCampaignsAllowed}
                    </div>
                  </div>
                </div>

                {/* Auto-filled Target Contacts Message Limit (Non-editable) */}
                <div className="pt-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-brand" /> Target Audience Dispatch Count (Auto-filled)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={`${autoTargetCount.toLocaleString()} Contacts (Auto-calculated)`}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-emerald-300 text-emerald-deep font-black text-sm outline-none cursor-not-allowed shadow-2xs"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-emerald-700">
                      🔒 Non-editable
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1.5 ml-1 leading-relaxed font-medium">
                    ℹ️ <strong>System Note:</strong> The target message dispatch limit is automatically bound to the selected client's saved audience contact count ({totalClientContacts.toLocaleString()}) and available subscription quota ({remainingQuota.toLocaleString()}).
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp Template Selection */}
            <div className="pt-2 border-t border-cream space-y-4">
              <h2 className="font-display font-black text-xl text-emerald-deep flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-brand" /> 2. WhatsApp Template & Variables
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1 flex items-center gap-1.5">
                  Select Meta Approved Template
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-semibold appearance-none cursor-pointer"
                >
                  {whatsappTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.category}] {t.name} ({t.headerType === "IMAGE" ? "📷 Image Header" : "📝 Text Only"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Fields */}
              <div className="space-y-4 p-5 rounded-2xl bg-cream/50 border border-cream">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-deep flex items-center justify-between">
                  <span>Template Variable Mapping</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand/15 text-brand text-[10px] font-bold">
                    {selectedTemplate?.headerType === "IMAGE" ? "IMAGE HEADER" : "TEXT HEADER"}
                  </span>
                </div>

                {selectedTemplate?.headerType === "IMAGE" && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase text-emerald-800 ml-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3.5 w-3.5 text-brand" /> Header Image (.PNG, .JPEG, .JPG — Max 20MB)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">Formats: PNG, JPG, JPEG (≤ 20MB)</span>
                    </label>

                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="https://example.com/banner.jpg or click browse"
                        value={headerImageUrl}
                        onChange={(e) => setHeaderImageUrl(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-xs text-foreground font-medium outline-none focus:border-brand"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".png,.jpeg,.jpg"
                        onChange={handleHeaderImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 rounded-2xl bg-brand text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" /> Browse Image (20MB)
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="col-span-full mb-1">
                    <span className="text-[10px] text-emerald-600 block">💡 Use <code>{'{FieldName}'}</code> to dynamically map from uploaded Excel columns (e.g. <code>{'{firstName}'}</code>, <code>{'{city}'}</code>). Otherwise, plain text will be sent statically.</span>
                  </div>
                  {selectedTemplate?.variables?.map((v, index) => {
                    // Variable 1 is auto-mapped to Customer Name
                    if (index === 0) {
                      return (
                        <div key={v.name}>
                          <label className="block text-[11px] font-bold text-emerald-800 mb-1 ml-1 truncate" title={v.label}>
                            {v.label} (Receiver Name)
                          </label>
                          <input
                            type="text"
                            disabled
                            value="[ Auto-fetched from database ]"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-cream/70 border border-emerald-100/50 text-emerald-700 font-bold outline-none cursor-not-allowed text-xs"
                          />
                        </div>
                      );
                    }

                    return (
                      <div key={v.name}>
                        <label className="block text-[11px] font-bold text-emerald-800 mb-1 ml-1 truncate" title={v.label}>
                          {v.label}
                        </label>
                        <input
                          type="text"
                          placeholder={v.placeholder}
                          value={templateValues[v.name] || ""}
                          onChange={(e) => setTemplateValues({ ...templateValues, [v.name]: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-100 text-xs text-foreground font-medium outline-none focus:border-brand"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Action Bar */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-float border border-emerald-100/50 space-y-4">
              <h2 className="font-display font-black text-xl text-emerald-deep flex items-center gap-2 pb-3 border-b border-cream">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Live WhatsApp Preview
              </h2>

              <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-sans shadow-glow border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Meta Approved Template
                  </span>
                  <span className="uppercase text-[10px] text-slate-400">{selectedTemplate?.category}</span>
                </div>

                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-3 text-xs">
                  {selectedTemplate?.headerType === "IMAGE" && headerImageUrl && (
                    <div className="h-44 rounded-xl bg-slate-700 overflow-hidden relative border border-slate-600">
                      <img src={headerImageUrl} alt="Header" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-medium">
                    {renderBodyPreview()}
                  </div>
                  <div className="text-[10px] text-slate-400 text-right font-mono pt-1">10:45 AM ✓✓</div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="rounded-[32px] bg-white p-6 shadow-float border border-emerald-100/50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-6 py-3.5 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createCampaignMutation.isPending || !selectedClientId || !name.trim()}
                className="px-8 py-3.5 rounded-2xl bg-gradient-brand text-white font-black shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                {createCampaignMutation.isPending ? "Creating..." : "Save Campaign Draft"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-sunny/20 blur-2xl pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Campaigns Control</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">WhatsApp Campaigns</h1>
            <p className="mt-2 text-white/80 max-w-lg font-medium">Track campaign deliveries, dispatch messages, and manage campaigns in real time.</p>
          </div>

          <button
            onClick={() => setView("create")}
            className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5 border-transparent"
          >
            <Plus className="h-5 w-5" /> New Campaign
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[28px] bg-white p-6 shadow-float border border-cream space-y-6">
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
        <div className="grid gap-5">
          <AnimatePresence initial={false}>
            {campaigns.map((c) => {
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/40 hover:border-emerald-100 transition space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center text-white shadow-glow">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-display font-black text-lg text-emerald-deep leading-snug">{c.campaignName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                          <Link to={`/admin/clients/${c.clientId}`} className="hover:underline hover:text-brand transition font-bold">
                            {c.clientName || c.companyName || `Client #${c.clientId}`}
                          </Link>
                          {" • "}
                          Template: <span className="font-semibold text-emerald-800">{c.templateName || `T-${c.templateId}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          c.campaignStatus === "PROCESSING"
                            ? "bg-brand text-white animate-pulse"
                            : c.campaignStatus === "CREATED"
                            ? "bg-sunny text-emerald-deep"
                            : c.campaignStatus === "COMPLETED"
                            ? "bg-teal-deep text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {c.campaignStatus === "PROCESSING" && <Activity className="h-3.5 w-3.5" />}
                        {c.campaignStatus}
                      </span>
                      
                      {/* Lifecycle Action Buttons */}
                      {c.campaignStatus === "CREATED" && (
                        <button
                          onClick={() => startCampaignMutation.mutate(c.id)}
                          disabled={startCampaignMutation.isPending}
                          className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5" /> Start
                        </button>
                      )}
                      {c.campaignStatus === "PROCESSING" && (
                        <button
                          onClick={() => pauseCampaignMutation.mutate(c.id)}
                          disabled={pauseCampaignMutation.isPending}
                          className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Pause className="h-3.5 w-3.5" /> Pause
                        </button>
                      )}
                      {c.campaignStatus === "PAUSED" && (
                        <button
                          onClick={() => resumeCampaignMutation.mutate(c.id)}
                          disabled={resumeCampaignMutation.isPending}
                          className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5" /> Resume
                        </button>
                      )}
                      {(c.campaignStatus === "CREATED" || c.campaignStatus === "PROCESSING" || c.campaignStatus === "PAUSED") && (
                        <button
                          onClick={() => {
                            if(window.confirm("Are you sure you want to cancel this campaign? Pending messages will be discarded.")) {
                              cancelCampaignMutation.mutate(c.id);
                            }
                          }}
                          disabled={cancelCampaignMutation.isPending}
                          className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Stats Component */}
                  <CampaignStatsView campaign={c} />
                  
                </motion.div>
              );
            })}
            {campaigns.length === 0 && (
              <p className="text-sm text-muted-foreground italic font-medium p-8 text-center bg-white rounded-3xl border border-emerald-100 shadow-float">
                No campaigns created yet. Click "New Campaign" above.
              </p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
