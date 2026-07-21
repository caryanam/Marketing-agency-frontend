import { motion } from "motion/react";
import { LayoutTemplate, LayoutGrid, List } from "lucide-react";
import { TEMPLATES } from "@/lib/admin-data";
import { useState } from "react";

const TEMPLATE_CONTENT: Record<number, { body: string; preview: string; mediaUrl?: string }> = {
  1: {
    body: "Hi {{1}}, thanks for reaching out to {{2}}. Reply YES to know more about our latest offers 🎉",
    preview: "Hi Rohan Malhotra, thanks for reaching out to AutoZone Motors. Reply YES to know more about our latest offers 🎉"
  },
  2: {
    body: "Hello {{1}}! Your test drive for {{2}} at {{3}} is confirmed for {{4}}. Please bring your valid driving license.",
    preview: "Hello Aditya! Your test drive for Thar LX at AutoZone Motors is confirmed for Sunday, 4 PM. Please bring your valid driving license.",
    mediaUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400&auto=format&fit=crop&q=60"
  },
  3: {
    body: "Dear {{1}}, this is a reminder for your upcoming appointment at {{2}} on {{3}} at {{4}}. To reschedule, reply to this message.",
    preview: "Dear Priya Nair, this is a reminder for your upcoming appointment at GreenLeaf Hospitals on July 20th at 10:30 AM. To reschedule, reply to this message."
  },
  4: {
    body: "Hi {{1}}! Thank you for scheduling a site visit to {{2}} on {{3}}. Our sales executive {{4}} will call you shortly.",
    preview: "Hi Amit! Thank you for scheduling a site visit to Sharma Realty Green Vista on Saturday. Our sales executive Aditya Sharma will call you shortly."
  },
  5: {
    body: "✨ Festive Sale is Live! Hi {{1}}, enjoy up to {{2}}% off on {{3}} at {{4}}. Limited time offer, click below to shop now!",
    preview: "✨ Festive Sale is Live! Hi Deepa, enjoy up to 30% off on premium packages at Caryanam. Limited time offer, click below to shop now!",
    mediaUrl: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop&q=60"
  },
  6: {
    body: "Success! We have received your payment of ₹{{1}} for invoice {{2}}. Thank you for choosing {{3}}.",
    preview: "Success! We have received your payment of ₹45,000 for invoice #INV-9281. Thank you for choosing Delta Finance."
  }
};

export default function AdminTemplates() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const approvedTemplates = TEMPLATES.filter((t) => t.status === "Approved");

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-sunny/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Meta approved</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">WhatsApp Templates</h1>
            <p className="mt-2 text-white/80 max-w-lg">Reusable, high-converting message templates across every category.</p>
          </div>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="flex items-center justify-between bg-white/40 backdrop-blur p-4 rounded-3xl border border-white/50">
        <div className="text-sm font-bold text-emerald-deep">
          Showing {approvedTemplates.length} Approved Templates
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-float border border-cream">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "grid" ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-cream"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "list" ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-cream"
            }`}
            title="List (Row) View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates List/Grid Container */}
      <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
        {approvedTemplates.map((t, i) => {
          const detail = TEMPLATE_CONTENT[t.id] || { body: "", preview: "" };
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-[28px] bg-white p-6 shadow-float hover:shadow-glow transition flex ${
                viewMode === "grid" 
                  ? "flex-col gap-4" 
                  : "flex-col lg:flex-row lg:items-stretch gap-6"
              }`}
            >
              {/* Header / Info Section */}
              <div className={`flex flex-col justify-between ${viewMode === "grid" ? "w-full" : "w-full lg:w-64 lg:border-r lg:border-cream lg:pr-6 shrink-0"}`}>
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-cream grid place-items-center text-emerald-deep">
                    <LayoutTemplate className="h-6 w-6" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-display font-black text-lg text-emerald-deep leading-snug">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold">{t.category} · {t.lang}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cream lg:border-t-0 lg:pt-0">
                  <span className="text-xs text-muted-foreground font-semibold">
                    Used <span className="font-black text-emerald-deep">{t.uses.toLocaleString()}</span> times
                  </span>
                </div>
              </div>

              {/* Contents Section (Raw Code & Preview) */}
              <div className={`flex-1 flex ${viewMode === "grid" ? "flex-col gap-4" : "flex-col md:flex-row gap-6"}`}>
                {/* Raw Template Code */}
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Raw Template Code</span>
                  <div className="flex-1 p-4 rounded-2xl bg-cream text-xs text-emerald-deep font-mono leading-relaxed border border-cream/50 break-words h-full min-h-[80px]">
                    {detail.body}
                  </div>
                </div>

                {/* WhatsApp Message Preview */}
                <div className={`${viewMode === "grid" ? "w-full" : "w-full md:w-80 shrink-0"} flex flex-col`}>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">WhatsApp Message Preview</span>
                  <div className="flex-1 p-4 rounded-2xl bg-[#efeae2] relative border border-[#e0dcd5] shadow-inner flex flex-col justify-center min-h-[160px]">
                    {/* Chat Bubble styling mimicking WhatsApp */}
                    <div className="bg-[#d9fdd3] text-zinc-900 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed w-full relative shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
                      {detail.mediaUrl && (
                        <img 
                          src={detail.mediaUrl} 
                          alt="Template Header Media" 
                          className="w-full h-24 object-cover rounded-xl mb-2.5 shadow-sm border border-black/5"
                        />
                      )}
                      <div className="break-words">{detail.preview}</div>
                      {/* Timestamp & read double tick indicators */}
                      <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-zinc-500/80 font-semibold select-none">
                        <span>12:00 PM</span>
                        <svg viewBox="0 0 16 15" width="13" height="13" className="fill-[#53bdeb]">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033L5.438 7.164a.365.365 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.702-8.358a.364.364 0 0 0-.06-.508zM6.425 10.354a.321.321 0 0 1-.48.02L2.73 7.214a.365.365 0 0 0-.513.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l1.36-1.696a.364.364 0 0 0-.06-.508l-.42-.326z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
