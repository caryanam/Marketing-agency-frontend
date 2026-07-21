import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import aboutImg from "@/assets/about-illustration.png";
import { Blob, WavyDivider } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";

export default function About() {
  return (
    <section id="about" className="relative py-32 bg-white overflow-hidden">
      <Blob className="absolute top-20 -right-40 w-[500px] h-[500px] text-sky-soft/60 -z-0" />
      <div className="absolute top-40 right-20 text-6xl">🌿</div>
      <div className="absolute bottom-20 left-10 text-5xl opacity-70">☁️</div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative">
        <motion.div {...fadeUp} className="relative">
          <div className="absolute inset-8 rounded-[48px] bg-gradient-brand -rotate-6 opacity-90" />
          <div className="absolute inset-8 rounded-[48px] bg-sunny rotate-3 opacity-40" />
          <img src={aboutImg} alt="Team collaborating" width={1200} height={1000} loading="lazy" className="relative w-full object-contain drop-shadow-2xl" />
          <div className="absolute -bottom-4 left-6 glass-card rounded-2xl px-4 py-3 shadow-float">
            <div className="text-xs text-muted-foreground">Since</div>
            <div className="font-black text-2xl text-emerald-deep">2019</div>
          </div>
          <div className="absolute -top-2 right-6 glass-card rounded-2xl px-4 py-3 shadow-float">
            <div className="text-xs text-muted-foreground">Team</div>
            <div className="font-black text-2xl text-emerald-deep">40+ experts</div>
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">About Caryanam</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep leading-tight">
            A boutique agency<br />built for <span className="text-gradient-brand italic">conversation‑led</span> growth.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            We're not a bulk-SMS reseller. We design premium WhatsApp experiences — from the opt-in
            journey to the offer copy — for automotive, healthcare, real estate and hospitality brands
            across India.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { i: CheckCircle2, t: "Meta-verified API partner" },
              { i: CheckCircle2, t: "Human strategist per account" },
              { i: CheckCircle2, t: "Conversion-focused templates" },
              { i: CheckCircle2, t: "Weekly performance reviews" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3">
                <f.i className="h-5 w-5 text-brand shrink-0" />
                <span className="font-semibold text-emerald-deep text-sm">{f.t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <WavyDivider className="absolute bottom-0 left-0 right-0 h-20 text-cream" />
    </section>
  );
}
