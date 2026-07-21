import { motion } from "motion/react";
import { Mail, Phone } from "lucide-react";
import { ENQUIRIES } from "@/lib/admin-data";

const toneFor = (s: string) =>
  s === "New" ? "bg-brand text-white" : s === "Contacted" ? "bg-sunny text-emerald-deep" :
  s === "Qualified" ? "bg-teal-deep text-white" : "bg-emerald-deep text-white";

export default function AdminEnquiries() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-sun p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-16 -top-10 w-64 h-64 rounded-full bg-white/40 blur-2xl" />
        <div className="relative">
          <div className="text-emerald-deep/70 text-xs uppercase tracking-widest font-bold">Inbox</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl text-emerald-deep">Contact Enquiries</h1>
          <p className="mt-2 text-emerald-deep/80 max-w-lg">Every lead from your website, in one warm workspace.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {ENQUIRIES.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-[24px] bg-white p-6 shadow-float hover:shadow-glow transition flex flex-wrap gap-6 items-start">
            <div className="h-14 w-14 rounded-2xl bg-gradient-brand text-white grid place-items-center font-black text-lg shadow-glow">
              {e.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-[240px]">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-display font-black text-lg text-emerald-deep">{e.name}</div>
                <span className="text-xs text-muted-foreground">· {e.company}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${toneFor(e.status)}`}>{e.status}</span>
              </div>
              <p className="mt-2 text-sm text-emerald-deep/80">"{e.message}"</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {e.phone}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {e.email}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{e.date}</div>
              <button className="mt-3 px-4 py-2 rounded-full bg-brand text-white text-xs font-bold shadow-float">Reply on WhatsApp</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
