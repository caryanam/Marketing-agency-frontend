import { motion } from "motion/react";
import supportImg from "@/assets/support-illustration.png";
import { Blob } from "@/components/site/Decor";
import { ArrowRight, PhoneCall, Mail, MapPin } from "lucide-react";
import { fadeUp } from "@/lib/animations";

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 bg-gradient-cream overflow-hidden">
      <Blob className="absolute -left-16 -top-10 w-80 h-80 text-brand/15" />
      <Blob className="absolute -right-16 bottom-0 w-96 h-96 text-sunny/40" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center relative">
        <motion.div {...fadeUp} className="relative">
          <div className="absolute inset-8 rounded-[48px] bg-gradient-teal -rotate-3 shadow-glow" />
          <img src={supportImg} alt="Support" width={1000} height={1000} loading="lazy" className="relative w-full object-contain drop-shadow-2xl" />
          <div className="absolute -bottom-4 left-6 glass-card rounded-2xl px-4 py-3">
            <div className="text-xs text-muted-foreground">Reply time</div>
            <div className="font-black text-emerald-deep">under 15 min</div>
          </div>
          <div className="absolute top-4 right-4 glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-bold text-emerald-deep">We're online</span>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="rounded-[42px] glass-card p-8 md:p-10 shadow-glow">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Reach out</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep">
            Hi there! <span className="italic text-gradient-brand">What can we build</span> for you today?
          </h2>

          <form className="mt-8 grid sm:grid-cols-2 gap-4">
            <input placeholder="Your Name" className="col-span-1 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
            <input placeholder="Phone Number" className="col-span-1 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
            <input placeholder="Email Address" className="col-span-2 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
            <textarea placeholder="Tell us about your goals..." rows={4} className="col-span-2 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium resize-none" />
            <button type="button" className="col-span-2 mt-2 px-7 py-4 rounded-full bg-brand text-white font-bold shadow-glow hover:-translate-y-0.5 transition inline-flex items-center justify-center gap-2">
              Send Message <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2 text-emerald-deep"><PhoneCall className="h-4 w-4 text-brand shrink-0" /> +91 7755994123</div>
            <div className="flex items-center gap-2 text-emerald-deep"><Mail className="h-4 w-4 text-brand shrink-0" /> support@caryanam.com</div>
            <div className="flex items-center gap-2 text-emerald-deep"><MapPin className="h-4 w-4 text-brand shrink-0" /> Kharadi, Pune, 411014</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
