import { motion } from "motion/react";
import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import supportImg from "@/assets/support-illustration.png";
import { Blob } from "@/components/site/Decor";
import { MessageSquare, PhoneCall, Mail, MapPin, ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between overflow-x-hidden">
      <div>
        <Navbar />
        
        {/* Top Hero Banner */}
        <section className="pt-32 pb-14 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 text-emerald-deep">
              <MessageSquare className="h-4 w-4" />
              Reach Us — Campaign Strategists
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Contact <span className="text-gradient-brand italic">Caryanam</span>
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Have questions about WhatsApp Business API integration, Meta verification, or scaling broadcasts? We're online and ready to assist.
            </p>
          </div>
        </section>

        {/* Core Contact Content */}
        <section id="contact" className="py-16 relative overflow-hidden">
          <Blob className="absolute -left-20 top-20 w-96 h-96 text-brand/15" />
          <Blob className="absolute right-0 bottom-10 w-[450px] h-[450px] text-sunny/30" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
            
            {/* Top Side: 3 Quick Contact Info Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white shadow-float border border-emerald-100/80 flex items-center gap-4 hover:shadow-glow transition">
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-white grid place-items-center shrink-0 shadow-glow">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Phone Support</div>
                  <a href="tel:+917755994123" className="font-bold text-emerald-deep text-base mt-0.5 block hover:text-brand transition">
                    +91 7755994123
                  </a>
                  <div className="text-[11px] text-brand font-semibold">Mon – Sat, 9 AM – 8 PM IST</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white shadow-float border border-emerald-100/80 flex items-center gap-4 hover:shadow-glow transition">
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-white grid place-items-center shrink-0 shadow-glow">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Email Us</div>
                  <a href="mailto:support@caryanam.com" className="font-bold text-emerald-deep text-base mt-0.5 block hover:text-brand transition">
                    support@caryanam.com
                  </a>
                  <div className="text-[11px] text-brand font-semibold">Average reply under 15 mins</div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white shadow-float border border-emerald-100/80 flex items-center gap-4 hover:shadow-glow transition">
                <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-white grid place-items-center shrink-0 shadow-glow">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Headquarters</div>
                  <div className="font-bold text-emerald-deep text-base mt-0.5">Kharadi, Pune</div>
                  <div className="text-[11px] text-brand font-semibold">Pin Code: 411014, Maharashtra</div>
                </div>
              </div>
            </div>

            {/* Main Grid: Left = Support Illustration, Right = Contact Form */}
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
              
              {/* Left Column: Support Illustration + Floating Badges */}
              <motion.div {...fadeUp} className="relative">
                <div className="absolute inset-8 rounded-[48px] bg-gradient-teal -rotate-3 shadow-glow" />
                <img
                  src={supportImg}
                  alt="Support Team"
                  width={1000}
                  height={1000}
                  loading="lazy"
                  className="relative w-full object-contain drop-shadow-2xl"
                />
                <div className="absolute -bottom-4 left-6 glass-card rounded-2xl px-4 py-3 shadow-float">
                  <div className="text-xs text-muted-foreground">Reply time</div>
                  <div className="font-black text-emerald-deep text-sm">under 15 min</div>
                </div>
                <div className="absolute top-4 right-4 glass-card rounded-2xl px-4 py-3 flex items-center gap-2 shadow-float">
                  <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-xs font-bold text-emerald-deep">We're online</span>
                </div>
              </motion.div>

              {/* Right Column: Contact Form */}
              <motion.div {...fadeUp} className="rounded-[42px] glass-card p-8 md:p-10 shadow-glow">
                <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Reach Us</div>
                <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep">
                  Hi there! <span className="italic text-gradient-brand">What can we build</span> for you today?
                </h2>

                <form className="mt-8 grid sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
                  <input placeholder="Your Name" className="col-span-1 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
                  <input placeholder="Phone Number" className="col-span-1 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
                  <input placeholder="Email Address" className="col-span-2 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium" />
                  <textarea placeholder="Tell us about your goals..." rows={4} className="col-span-2 rounded-2xl bg-white/70 backdrop-blur border border-border/60 px-5 py-4 outline-none focus:border-brand transition font-medium resize-none" />
                  <button type="button" className="col-span-2 mt-2 px-7 py-4 rounded-full bg-brand text-white font-bold shadow-glow hover:-translate-y-0.5 transition inline-flex items-center justify-center gap-2 cursor-pointer">
                    Send Message <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/40 grid sm:grid-cols-3 gap-3 text-xs text-emerald-deep font-semibold">
                  <div className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-brand shrink-0" /> +91 7755994123</div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand shrink-0" /> support@caryanam.com</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand shrink-0" /> Kharadi, Pune, 411014</div>
                </div>
              </motion.div>

            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
