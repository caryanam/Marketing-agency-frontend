import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCheck, Eye, MessageCircle, Plus } from "lucide-react";
import { CAMPAIGNS, CLIENTS, TEMPLATES } from "@/lib/admin-data";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [targetSize, setTargetSize] = useState("5000");
  const [templateId, setTemplateId] = useState("");
  const [status, setStatus] = useState("Running");

  // Only display Approved templates for selection
  const approvedTemplates = TEMPLATES.filter(t => t.status === "Approved");

  // Simulation: Increase numbers for "Running" campaigns every few seconds for interactive dashboard feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(c => {
        if (c.status === "Running") {
          // Increment sent, delivered, read, replied proportionally
          const newSent = Math.min(c.sent + Math.floor(Math.random() * 5) + 1, 100000);
          const newDelivered = Math.min(Math.floor(newSent * 0.98), newSent);
          const newRead = Math.min(Math.floor(newDelivered * 0.8), newDelivered);
          const newReplied = Math.min(Math.floor(newRead * 0.15), newRead);
          return {
            ...c,
            sent: newSent,
            delivered: newDelivered,
            read: newRead,
            replied: newReplied
          };
        }
        return c;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client || !targetSize || !templateId) return;

    const newCampaign = {
      id: campaigns.length + 1,
      name,
      client,
      sent: parseInt(targetSize) || 1000,
      delivered: 0,
      read: 0,
      replied: 0,
      status: status as "Running" | "Scheduled" | "Completed"
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsOpen(false);
    
    // Reset form
    setName("");
    setClient("");
    setTargetSize("5000");
    setTemplateId("");
    setStatus("Running");
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-emerald-deep text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-64 h-64 rounded-full bg-sunny/20 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/70 text-xs uppercase tracking-widest font-bold">Active</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">WhatsApp Campaigns</h1>
            <p className="mt-2 text-white/70 max-w-lg">Track every message you send across every client, in real time.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5">
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
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Select Client</label>
                  <select
                    required
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose a client...</option>
                    {CLIENTS.map(c => (
                      <option key={c.id} value={c.company}>{c.company}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Target Size</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 5000"
                      value={targetSize}
                      onChange={e => setTargetSize(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Start Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="Running">Running Now</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
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
                    className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-5">
        <AnimatePresence initial={false}>
          {campaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="rounded-[28px] bg-white p-6 shadow-float hover:shadow-glow transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center text-white shadow-glow">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display font-black text-lg text-emerald-deep leading-snug">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.client}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === "Running" ? "bg-brand text-white" : c.status === "Scheduled" ? "bg-sunny text-emerald-deep" : "bg-teal-deep text-white"
                }`}>{c.status}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { i: Send, l: "Sent", v: c.sent, tone: "bg-cream text-emerald-deep" },
                  { i: CheckCheck, l: "Delivered", v: c.delivered, tone: "bg-brand/10 text-brand" },
                  { i: Eye, l: "Read", v: c.read, tone: "bg-teal-deep/10 text-teal-deep" },
                  { i: MessageCircle, l: "Replied", v: c.replied, tone: "bg-sunny/40 text-emerald-deep" },
                ].map((s) => (
                  <div key={s.l} className={`rounded-2xl p-4 ${s.tone}`}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-80"><s.i className="h-3 w-3" /> {s.l}</div>
                    <div className="mt-2 font-display font-black text-2xl">{s.v.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-2 rounded-full bg-cream overflow-hidden">
                <div 
                  className="h-full bg-gradient-brand transition-all duration-500 ease-out" 
                  style={{ width: `${c.sent > 0 ? (c.delivered / c.sent) * 100 : 0}%` }} 
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
