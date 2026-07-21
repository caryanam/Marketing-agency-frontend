import { motion } from "motion/react";
import { LayoutTemplate, CheckCircle2, Clock, Plus, MessageCircle } from "lucide-react";

const TEMPLATES = [
  { name: "Welcome Message", category: "Onboarding", lang: "English", status: "Approved", uses: 1220, preview: "Hi {{name}}! Welcome to our family. Get 10% off your first order with code WELCOME10." },
  { name: "Order Confirmation", category: "Transactional", lang: "English + Hindi", status: "Approved", uses: 2410, preview: "Hi {{name}}, your order #{{orderId}} is confirmed. We'll notify you once it ships." },
  { name: "Festive Offer", category: "Marketing", lang: "English + Regional", status: "Approved", uses: 3320, preview: "🎉 Festive Sale is LIVE! Flat 30% off on our new collection. Shop now: {{link}}" },
  { name: "Cart Abandonment", category: "Marketing", lang: "English", status: "Approved", uses: 812, preview: "You left something behind! Complete your order in the next 24 hours and get free shipping." },
  { name: "Appointment Reminder", category: "Utility", lang: "English", status: "Approved", uses: 940, preview: "Reminder: Your appointment is scheduled for {{date}} at {{time}}. Reply YES to confirm." },
  { name: "Diwali Special", category: "Marketing", lang: "English + Hindi", status: "Pending", uses: 0, preview: "Wishing you a bright Diwali! Enjoy 40% off site-wide until midnight. Use code DIWALI40." },
];

export default function ClientTemplates() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">WhatsApp</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">Message Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Reusable, Meta-approved WhatsApp templates for every use case.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold text-sm shadow-glow hover:shadow-lg transition">
          <Plus className="h-4 w-4" /> Request Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {TEMPLATES.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-[28px] bg-white p-6 shadow-float">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-sun grid place-items-center text-emerald-deep shrink-0">
                  <LayoutTemplate className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-black text-lg text-emerald-deep">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.category} · {t.lang}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                t.status === "Approved" ? "bg-brand text-white" : "bg-sunny text-emerald-deep"
              }`}>
                {t.status === "Approved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                {t.status}
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-cream p-4 relative">
              <MessageCircle className="absolute top-3 right-3 h-4 w-4 text-brand/40" />
              <p className="text-sm text-emerald-deep leading-relaxed pr-8">{t.preview}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Used <span className="font-bold text-emerald-deep">{t.uses.toLocaleString()}</span> times</div>
              <button className="text-xs font-bold text-brand hover:text-emerald-deep transition">Use Template →</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
