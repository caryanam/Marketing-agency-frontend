import { motion } from "motion/react";
import { Sparkles, ArrowRight, PhoneCall, Star, CheckCircle2, TrendingUp, Users, BarChart3 } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";
import { Blob, TornPaper } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-40 lg:pb-56">
      {/* decorative bg */}
      <div className="absolute inset-0 -z-10 bg-gradient-cream" />
      <Blob className="absolute -top-20 -left-20 w-[420px] h-[420px] text-brand/15 -z-10 animate-pulse" />
      <Blob className="absolute top-40 right-0 w-[380px] h-[380px] text-sunny/40 -z-10" />
      <div className="absolute top-24 right-24 w-6 h-6 rounded-full bg-tangerine -z-10" />
      <div className="absolute bottom-40 left-16 w-4 h-4 rounded-full bg-brand -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="h-4 w-4 text-tangerine" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-deep">Official Meta WhatsApp Partner</span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-emerald-deep">
            Turn WhatsApp <br />
            into your <span className="text-gradient-brand italic font-black inline-block pr-3 pb-1">growth engine</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="mt-6 text-lg text-muted-foreground max-w-xl">
            Premium campaigns, verified Meta API and hand-crafted automations that put your brand
            inside every customer's pocket — with a 98% open rate that email will never touch.
          </motion.p>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="group px-7 py-4 rounded-full bg-brand text-white font-bold shadow-glow hover:-translate-y-1 transition-all inline-flex items-center gap-2">
              Launch a Campaign
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </a>
            <a href="#pricing" className="px-7 py-4 rounded-full bg-white border border-border font-bold text-emerald-deep hover:bg-cream shadow-float transition-all inline-flex items-center gap-2">
              <PhoneCall className="h-4 w-4" /> Talk to Sales
            </a>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="mt-10 flex items-center gap-6 flex-wrap">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-brand grid place-items-center text-white text-xs font-bold shadow-float">{"CDMSA"[i]}</div>
              ))}
            </div>
            <div>
              <div className="flex text-tangerine">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <div className="text-sm font-semibold text-emerald-deep">Trusted by 500+ Indian brands</div>
            </div>
          </motion.div>
        </div>

        {/* Right: illustration + floating cards */}
        <div className="relative h-[560px] lg:h-[640px]">
          {/* backdrop shape */}
          <div className="absolute inset-6 rounded-[60px] bg-gradient-brand -rotate-3 shadow-glow" />
          <div className="absolute inset-6 rounded-[60px] bg-gradient-teal rotate-2 opacity-70" />

          <motion.img
            src={heroImg}
            alt="WhatsApp marketing illustration"
            width={1200}
            height={1200}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -bottom-10 -right-4 lg:-right-16 w-[520px] max-w-[110%] object-contain drop-shadow-2xl"
          />

          {/* floating glass cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="absolute top-6 left-2 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-brand grid place-items-center text-white"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Delivery Rate</div>
              <div className="font-black text-emerald-deep">98%</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="absolute top-1/2 left-0 glass-card rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-sun grid place-items-center text-emerald-deep"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Leads this month</div>
              <div className="font-black text-emerald-deep">15,240</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="absolute bottom-24 -left-4 lg:-left-10 glass-card rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-teal-deep grid place-items-center text-white"><Users className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Brands using Caryanam</div>
              <div className="font-black text-emerald-deep">500+</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="absolute top-10 -right-2 glass-card rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              <div className="text-xs font-bold text-emerald-deep">Live Campaign</div>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">Diwali Blast · sending 8,200</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="absolute bottom-4 right-2 lg:right-0 glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center text-white"><BarChart3 className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Analytics · CTR</div>
              <div className="font-black text-emerald-deep">42.8%</div>
            </div>
          </motion.div>
        </div>
      </div>

      <TornPaper className="absolute bottom-0 left-0 right-0 h-16 text-white" />
    </section>
  );
}
