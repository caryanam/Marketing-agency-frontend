import { motion } from "motion/react";
import { Blob } from "@/components/site/Decor";
import { Counter } from "@/components/site/Counter";
import { fadeUp } from "@/lib/animations";

export default function TrustStrip() {
  const stats = [
    { n: 500, s: "+", l: "Happy Brands" },
    { n: 12, s: "M+", l: "Messages Delivered" },
    { n: 98, s: "%", l: "Open Rate" },
    { n: 42, s: "%", l: "Avg. Click Rate" },
  ];

  return (
    <section className="relative bg-white -mt-1 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-[42px] bg-gradient-sun shadow-glow p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden">
          <Blob className="absolute -right-10 -top-10 w-56 h-56 text-white/25" />
          <Blob className="absolute -left-16 -bottom-16 w-64 h-64 text-emerald-deep/10" />
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="relative text-center">
              <div className="font-display font-black text-4xl md:text-5xl text-emerald-deep">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-1 text-sm font-semibold text-emerald-deep/70">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
