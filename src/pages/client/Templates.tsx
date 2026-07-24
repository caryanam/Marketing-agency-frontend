import { motion } from "motion/react";
import { LayoutTemplate, CheckCircle2, MessageCircle, Image as ImageIcon } from "lucide-react";
import { useWhatsAppTemplates } from "@/hooks/useWhatsAppTemplates";
import { WhatsAppTemplate } from "@/lib/templates-data";

export default function ClientTemplates() {
  const { data: templates = [], isLoading } = useWhatsAppTemplates();

  const renderPreview = (t: WhatsAppTemplate) => {
    let text = t.bodyTemplate || "";
    t.variables?.forEach((v, index) => {
      const val = v.defaultValue || `[${v.label}]`;
      text = text.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), val);
    });
    return text;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">WhatsApp Cloud API</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">Message Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Available Meta-approved WhatsApp Cloud API message templates for your marketing campaigns.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-5 animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="rounded-[28px] bg-white p-6 shadow-float space-y-4">
              <div className="h-10 bg-cream-dark/30 rounded-xl w-1/2" />
              <div className="h-20 bg-cream-dark/20 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {templates.map((t, i) => (
            <motion.div key={t.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-[28px] bg-white p-6 shadow-float flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-sun grid place-items-center text-emerald-deep shrink-0 font-bold">
                      #{t.id}
                    </div>
                    <div>
                      <div className="font-display font-black text-lg text-emerald-deep">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 font-semibold">
                        {t.headerType === "IMAGE" ? <ImageIcon className="h-3 w-3 text-brand" /> : <LayoutTemplate className="h-3 w-3 text-brand" />}
                        {t.category} · {t.headerType === "IMAGE" ? "Image Header" : "Text Only"}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand/15 text-brand">
                    <CheckCircle2 className="h-3 w-3" /> Approved
                  </span>
                </div>

                <div className="mt-4 rounded-2xl bg-[#efeae2] p-4 relative border border-[#e0dcd5]">
                  <MessageCircle className="absolute top-3 right-3 h-4 w-4 text-emerald-600/40" />
                  <div className="bg-[#d9fdd3] text-zinc-900 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed shadow-xs">
                    {t.headerType === "IMAGE" && t.defaultHeaderUrl && (
                      <img src={t.defaultHeaderUrl} alt="Header" className="w-full h-24 object-cover rounded-xl mb-2" />
                    )}
                    <div className="whitespace-pre-wrap font-medium text-slate-800">{renderPreview(t)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cream flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>{t.variables?.length || 0} Dynamic Variables</span>
                <span className="text-brand font-bold">Ready for Campaign</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
