import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  CheckCheck,
  Eye,
  MessageCircle,
  Plus,
  Play,
  Pause,
  StopCircle,
  PlayCircle,
  Users,
} from "lucide-react";
import {
  useAdminCampaigns,
  useCreateCampaign,
  useRunCampaign,
  usePauseCampaign,
  useResumeCampaign,
  useStopCampaign,
} from "@/hooks/admin/useAdminCampaign";
import { useAdminClients } from "@/hooks/admin/useAdminClients";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminCampaigns() {
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useAdminCampaigns();
  const { clients = [], isLoading: isClientsLoading } = useAdminClients();

  const createCampaignMutation = useCreateCampaign();
  const runCampaignMutation = useRunCampaign();
  const pauseCampaignMutation = usePauseCampaign();
  const resumeCampaignMutation = useResumeCampaign();
  const stopCampaignMutation = useStopCampaign();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");

  // Run Campaign Modal State
  const [runCampaignId, setRunCampaignId] = useState<number | null>(null);
  const [messagesToSend, setMessagesToSend] = useState("100");
  const [isRunOpen, setIsRunOpen] = useState(false);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedClientId) return;

    await createCampaignMutation.mutateAsync({
      clientId: parseInt(selectedClientId, 10),
      campaignName: name.trim(),
    });

    setIsOpen(false);
    setName("");
    setSelectedClientId("");
  };

  const handleOpenRun = (campaignId: number) => {
    setRunCampaignId(campaignId);
    setMessagesToSend("100");
    setIsRunOpen(true);
  };

  const handleRunSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runCampaignId) return;

    await runCampaignMutation.mutateAsync({
      campaignId: runCampaignId,
      messagesToSend: parseInt(messagesToSend, 10) || 1,
    });
    setIsRunOpen(false);
  };

  const handlePause = async (id: number) => {
    await pauseCampaignMutation.mutateAsync(id);
  };

  const handleResume = async (id: number) => {
    await resumeCampaignMutation.mutateAsync(id);
  };

  const handleStop = async (id: number) => {
    if (window.confirm("Are you sure you want to stop this campaign completely? This action cannot be undone.")) {
      await stopCampaignMutation.mutateAsync(id);
    }
  };

  const isLoading = isCampaignsLoading || isClientsLoading;

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-sunny/20 blur-2xl pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Campaigns Control</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">WhatsApp Campaigns</h1>
            <p className="mt-2 text-white/80 max-w-lg">Track campaign deliveries, dispatch messages, and control states in real time.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5 border-transparent">
                <Plus className="h-5 w-5" /> New Campaign
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
              <DialogHeader>
                <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Create WhatsApp Campaign</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLaunch} className="space-y-4 mt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diwali Blast Offer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Assign Client</label>
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

                <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createCampaignMutation.isPending}
                    className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm"
                  >
                    Create Campaign
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
              const clientObj = clients.find((cl) => cl.id === c.clientId);
              const companyName = clientObj ? clientObj.companyName : `Client #${c.clientId}`;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100/40 hover:border-emerald-100 transition"
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
                            {companyName}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                      {/* State Action Buttons */}
                      <div className="flex items-center gap-1.5 bg-cream/70 p-1 rounded-xl border border-cream">
                        {c.campaignStatus !== "RUNNING" && c.campaignStatus !== "COMPLETED" && c.campaignStatus !== "STOPPED" && (
                          <button
                            onClick={() => handleOpenRun(c.id)}
                            className="p-1.5 rounded-lg bg-white border border-emerald-100 hover:bg-emerald-50 text-emerald-deep cursor-pointer flex items-center gap-1 font-bold text-[10px] shadow-xs"
                            title="Run Campaign"
                          >
                            <Play className="h-3 w-3" /> Run
                          </button>
                        )}
                        {c.campaignStatus === "RUNNING" && (
                          <button
                            onClick={() => handlePause(c.id)}
                            className="p-1.5 rounded-lg bg-white border border-amber-100 hover:bg-amber-50 text-amber-600 cursor-pointer flex items-center gap-1 font-bold text-[10px] shadow-xs"
                            title="Pause Campaign"
                          >
                            <Pause className="h-3 w-3" /> Pause
                          </button>
                        )}
                        {c.campaignStatus === "PAUSED" && (
                          <button
                            onClick={() => handleResume(c.id)}
                            className="p-1.5 rounded-lg bg-white border border-emerald-100 hover:bg-emerald-50 text-emerald-deep cursor-pointer flex items-center gap-1 font-bold text-[10px] shadow-xs"
                            title="Resume Campaign"
                          >
                            <PlayCircle className="h-3 w-3" /> Resume
                          </button>
                        )}
                        {c.campaignStatus !== "COMPLETED" && c.campaignStatus !== "STOPPED" && (
                          <button
                            onClick={() => handleStop(c.id)}
                            className="p-1.5 rounded-lg bg-white border border-red-100 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-1 font-bold text-[10px] shadow-xs"
                            title="Stop Campaign"
                          >
                            <StopCircle className="h-3 w-3" /> Stop
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { i: Send, l: "Sent Count", v: c.messagesSent, tone: "bg-cream text-emerald-deep" },
                      { i: CheckCheck, l: "Delivered", v: Math.floor(c.messagesSent * 0.98), tone: "bg-brand/10 text-brand" },
                      { i: Eye, l: "Read", v: Math.floor(c.messagesSent * 0.8), tone: "bg-teal-deep/10 text-teal-deep" },
                      { i: MessageCircle, l: "Replied", v: Math.floor(c.messagesSent * 0.15), tone: "bg-sunny/40 text-emerald-deep" },
                    ].map((s) => (
                      <div key={s.l} className={`rounded-2xl p-4 ${s.tone}`}>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-80">
                          <s.i className="h-3 w-3" /> {s.l}
                        </div>
                        <div className="mt-2 font-display font-black text-2xl">{s.v.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="h-full bg-gradient-brand transition-all duration-500 ease-out"
                      style={{ width: `${c.messagesSent > 0 ? 98 : 0}%` }}
                    />
                  </div>
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

      {/* DISPATCH MESSAGES MODAL */}
      <Dialog open={isRunOpen} onOpenChange={setIsRunOpen}>
        <DialogContent className="max-w-sm rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Run Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRunSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                Messages to Send
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 500"
                value={messagesToSend}
                onChange={(e) => setMessagesToSend(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
              />
              <p className="text-[11px] text-muted-foreground mt-1 ml-1">
                This will trigger WhatsApp dispatch and consume from the client's remaining message limit.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-cream">
              <button
                type="button"
                onClick={() => setIsRunOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={runCampaignMutation.isPending}
                className="px-5 py-2.5 rounded-2xl bg-brand text-white font-bold shadow-glow hover:shadow-lg transition cursor-pointer text-xs"
              >
                Dispatch Messages
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
