import { motion } from "motion/react";
import {
  Car, Building2, TrendingUp, Stethoscope, Calendar, Sparkles, Wrench,
  Home as HomeIcon, Shield, Landmark, Send, CheckCircle2, GraduationCap, Hotel,
} from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";
import { Link } from "react-router-dom";

export default function Industries() {
  return (
    <section id="industries" className="relative py-32 bg-white overflow-hidden font-sans">
      <Blob className="absolute -left-24 top-40 w-96 h-96 text-sunny/30" />
      <Blob className="absolute -right-24 bottom-20 w-[420px] h-[420px] text-brand/10" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div {...fadeUp} className="max-w-2xl mb-16">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Industries we love</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep">
            Built for the businesses <span className="text-gradient-brand italic">India runs on.</span>
          </h2>
        </motion.div>

        {/* Asymmetric Grid for all 9 Industries individually */}
        <div className="space-y-8">

          {/* Row 1: Used Car Dealers & Car Showrooms */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 1: Used Car Dealers (2/3 width horizontal split) */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-2 rounded-[32px] bg-white border border-border/60 shadow-float overflow-hidden grid md:grid-cols-2 min-h-[360px]"
            >
              <div className="relative min-h-[240px] md:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=60"
                  alt="Used car dealership"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand/40 via-black/20 to-transparent" />
              </div>
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-brand/15 grid place-items-center text-brand mb-4">
                    <Car className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-emerald-deep leading-tight">Used Car Dealers</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    Automate enquiries, share vehicle catalogues, and close deals faster directly inside WhatsApp chat.
                  </p>
                </div>
                <ul className="space-y-3 text-sm font-bold text-emerald-deep">
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Automated Catalogue Sharing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Instant Trade-in Valuations
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Broadcast Stock Alerts
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Card 2: Car Showrooms (1/3 width dark success card) */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-[32px] bg-[#0f2130] text-white p-8 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-brand/20 grid place-items-center text-brand mb-4">
                  <Building2 className="h-5 w-5 text-brand" />
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight">Car Showrooms</h3>
                <p className="text-sm text-white/70 mt-3 leading-relaxed">
                  Book test drives and send premium brochures to hot prospects instantly after their showroom visits.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-brand/20 grid place-items-center text-brand">
                  <TrendingUp className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="font-black text-white text-lg">35% Booking Lift</div>
                  <div className="text-xs text-white/50 font-bold">In Test Drive Conversions</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 2: Hospitals & Garages */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 3: Hospitals (1/3 width list card) */}
            <motion.div
              {...fadeUp}
              className="rounded-[32px] bg-[#eff6ff] border border-blue-100 p-8 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 grid place-items-center text-blue-600 mb-4">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-2xl text-emerald-deep leading-tight">Hospitals</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Deliver patient care updates and manage OPD appointments securely under HIPAA-compliant protocols.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="rounded-2xl bg-white p-4 flex items-center gap-3 border border-blue-50 shadow-sm">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-emerald-deep">Appointment Reminders & Rescheduling</span>
                </div>
                <div className="rounded-2xl bg-white p-4 flex items-center gap-3 border border-blue-50 shadow-sm">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-emerald-deep">Secure Lab Result Delivery</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="lg:col-span-2 rounded-[32px] overflow-hidden relative h-[380px] shadow-float border border-border/60"
            >
              <img
                src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=800&auto=format&fit=crop&q=60"
                alt="Garage workshop"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/95 via-black/30 to-black/10" />

              <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
                <div className="h-9 w-9 rounded-lg bg-white/20 backdrop-blur grid place-items-center mb-3 text-white">
                  <Wrench className="h-4 w-4" />
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight">Garages</h3>
                <p className="text-sm text-white/80 mt-2 italic font-semibold leading-relaxed">
                  "Caryanam's automated service alerts and updates increased our garage service bookings by 40%."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Row 3: Real Estate & Insurance Agents */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 5: Real Estate (2/3 width horizontal split) */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-2 rounded-[32px] bg-white border border-border/60 shadow-float overflow-hidden grid md:grid-cols-2 min-h-[360px]"
            >
              <div className="relative min-h-[240px] md:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60"
                  alt="Real Estate interior"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-brand/15 grid place-items-center text-brand mb-4">
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-emerald-deep leading-tight">Real Estate</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    Send property brochures, schedule physical site visits, and nurture buyers automatically to scale booking rates.
                  </p>
                </div>
                <ul className="space-y-3 text-sm font-bold text-emerald-deep">
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Instant Virtual Walkthroughs
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Automated Site Visit Reminders
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Post-Visit Pricing Nudges
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Card 6: Insurance Agents (1/3 width dark success card) */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-[32px] bg-[#0c1f20] text-white p-8 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-brand/20 grid place-items-center text-brand mb-4">
                  <Shield className="h-5 w-5 text-brand" />
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight">Insurance Agents</h3>
                <p className="text-sm text-white/70 mt-3 leading-relaxed">
                  Simplify policy renewals, send premium alerts, and collect claim documents instantly on chat.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-brand/20 grid place-items-center text-brand">
                  <TrendingUp className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <div className="font-black text-white text-lg">55% Faster Renewals</div>
                  <div className="text-xs text-white/50 font-bold">Via Direct Chat Payments</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 4: Finance Companies & Schools & Colleges */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 7: Finance Companies (1/3 width list card) */}
            <motion.div
              {...fadeUp}
              className="rounded-[32px] bg-[#f0fdf4] border border-green-100 p-8 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-green-600/10 grid place-items-center text-green-600 mb-4">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-2xl text-emerald-deep leading-tight">Finance Companies</h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Send secure EMI reminders, account balances, and run instant credit checks.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="rounded-2xl bg-white p-4 flex items-center gap-3 border border-green-50 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-bold text-emerald-deep">EMI Payment Alerts & Reminders</span>
                </div>
                <div className="rounded-2xl bg-white p-4 flex items-center gap-3 border border-green-50 shadow-sm">
                  <Send className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-bold text-emerald-deep">Instant Loan Eligibility Checks</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="lg:col-span-2 rounded-[32px] overflow-hidden relative h-[380px] shadow-float border border-border/60"
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60"
                alt="Student graduating"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/95 via-black/30 to-black/10" />

              <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
                <div className="h-9 w-9 rounded-lg bg-white/20 backdrop-blur grid place-items-center mb-3 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h3 className="font-display font-black text-2xl tracking-tight">Schools & Colleges</h3>
                <p className="text-sm text-white/80 mt-2 italic font-semibold leading-relaxed">
                  "By switching to WhatsApp notifications for homework and fee receipts, parent response rates soared to 85%."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Row 5: Hotels & Restaurants & Custom CTA */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Card 9: Hotels & Restaurants (2/3 width horizontal split) */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-2 rounded-[32px] bg-white border border-border/60 shadow-float overflow-hidden grid md:grid-cols-2 min-h-[360px]"
            >
              <div className="relative min-h-[240px] md:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60"
                  alt="Hotel concierge desk"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-brand/15 grid place-items-center text-brand mb-4">
                    <Hotel className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-emerald-deep leading-tight">Hotels & Restaurants</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    Manage guest reservations, share dining menus, and handle concierge service requests smoothly.
                  </p>
                </div>
                <ul className="space-y-3 text-sm font-bold text-emerald-deep">
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    24/7 Guest Support Chatbots
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Interactive Table & Room Bookings
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-brand/15 text-brand grid place-items-center text-xs">✓</span>
                    Post-Stay Review Collections
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Custom CTA Card (1/3 width dotted card) */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="rounded-[32px] p-8 bg-gradient-cream border-2 border-dashed border-brand/40 flex flex-col justify-center text-center items-center"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-display font-black text-xl text-emerald-deep leading-tight">Need a custom layout?</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-[240px]">
                We can build custom funnel integrations suited specifically for your operations.
              </p>
              <Link to="/contact" className="mt-5 px-6 py-3 rounded-full bg-gradient-brand text-white font-bold text-xs shadow-glow hover:shadow-lg transition">
                Consult strategist
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
