import { motion } from "motion/react";
import { PhoneCall } from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { Counter } from "@/components/site/Counter";
import { fadeUp } from "@/lib/animations";

export default function WhyUs() {
  return (
    <section id="whyus" className="relative py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div {...fadeUp} className="relative order-2 lg:order-1">
          <div className="rounded-[48px] bg-gradient-teal shadow-glow p-10 relative overflow-hidden">
            <Blob className="absolute -top-10 -right-10 w-64 h-64 text-white/10" />
            <div className="text-white/80 text-xs uppercase tracking-[0.3em] font-bold">Why Caryanam</div>
            <h3 className="mt-3 font-display text-3xl md:text-4xl font-black text-white">
              We answer to your <span className="text-sunny italic">ROI</span>, not to vanity metrics.
            </h3>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { n: 24, s: "/7", l: "Support" },
                { n: 3, s: "x", l: "Avg. ROI lift" },
                { n: 15, s: "min", l: "Response SLA" },
                { n: 100, s: "%", l: "Meta compliant" },
              ].map((k, i) => (
                <div key={i} className="rounded-2xl bg-white/10 backdrop-blur px-4 py-4">
                  <div className="font-display font-black text-3xl text-sunny"><Counter to={k.n} suffix={k.s} /></div>
                  <div className="text-white/80 text-xs font-semibold mt-1">{k.l}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl bg-white/95 p-5 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand grid place-items-center text-white shrink-0">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-semibold">Call our strategist</div>
                <div className="font-black text-emerald-deep text-lg">+91 98765 43210</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="order-1 lg:order-2">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Why choose us</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep leading-tight">
            Premium agency craft. <br />Startup <span className="text-gradient-brand italic">speed.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Every account gets a strategist, a copywriter and a data analyst — not a ticket queue.
            You'll ship your first campaign in under 72 hours.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { t: "Meta green-tick verification handled", d: "We manage documentation, review and approval end-to-end." },
              { t: "Copy engineered for Indian audiences", d: "Hindi, English & 8 regional languages, tuned for CTR." },
              { t: "Enterprise-grade delivery", d: "99.9% uptime, dedicated numbers, redundant infrastructure." },
            ].map((r, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="flex gap-4 bg-white rounded-2xl p-5 shadow-float">
                <div className="h-10 w-10 rounded-xl bg-gradient-sun grid place-items-center text-emerald-deep shrink-0 font-black">{i + 1}</div>
                <div>
                  <div className="font-black text-emerald-deep">{r.t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{r.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
