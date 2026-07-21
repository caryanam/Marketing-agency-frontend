import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import process1 from "@/assets/process1.png";
import process2 from "@/assets/process2.png";
import process3 from "@/assets/process3.png";
import process4 from "@/assets/process4.png";
import { fadeUp } from "@/lib/animations";
import { Calendar, Puzzle, PenTool, Rocket, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: "01",
    stepTag: "STEP 01",
    t: "Discovery Call",
    subtitle: "Phase 01 · 30-Min Strategy",
    d: "We map your funnel, audience and goals in a 30-min strategy call.",
    fullDesc: "Our senior WhatsApp strategists dive deep into your business sales funnel, target customer demographics, and revenue targets to construct a custom conversation blueprint.",
    img: process1,
    icon: Calendar,
    cardBg: "bg-[linear-gradient(135deg,#FF7A8A_0%,#E11D48_100%)]",
    activeBg: "bg-[linear-gradient(135deg,#FF7A8A_0%,#E11D48_100%)]",
    textColor: "text-[#E11D48]",
    highlights: [
      { t: "Funnel Audit", desc: "Strategy session" },
      { t: "Audience Target", desc: "Subscriber mapping" },
      { t: "ROI Roadmap", desc: "Revenue targets" },
    ],
  },
  {
    id: "02",
    stepTag: "STEP 02",
    t: "Meta API Setup",
    subtitle: "Phase 02 · Green-Tick Setup",
    d: "Green-tick verification, templates and integrations — done for you.",
    fullDesc: "We handle the entire Meta Cloud API onboarding process, business verification, Green-Tick badge submission, and direct database webhook routing without any downtime.",
    img: process2,
    icon: Puzzle,
    cardBg: "bg-[linear-gradient(135deg,#3B82F6_0%,#1D4ED8_100%)]",
    activeBg: "bg-[linear-gradient(135deg,#3B82F6_0%,#1D4ED8_100%)]",
    textColor: "text-[#1D4ED8]",
    highlights: [
      { t: "Meta Cloud API", desc: "Official verification" },
      { t: "Green Tick", desc: "Badge approval" },
      { t: "Webhook Routing", desc: "CRM sync" },
    ],
  },
  {
    id: "03",
    stepTag: "STEP 03",
    t: "Campaign Design",
    subtitle: "Phase 03 · Copy & Automation",
    d: "Copy, creatives and journeys built by senior WhatsApp strategists.",
    fullDesc: "Our creative team crafts high-converting interactive templates, CTA button flows, automated drip messages, and multi-language copy tuned specifically for Indian audiences.",
    img: process3,
    icon: PenTool,
    cardBg: "bg-[linear-gradient(135deg,#22C55E_0%,#047857_100%)]",
    activeBg: "bg-[linear-gradient(135deg,#22C55E_0%,#047857_100%)]",
    textColor: "text-[#047857]",
    highlights: [
      { t: "Interactive CTA", desc: "Button templates" },
      { t: "Copywriting", desc: "Regional messaging" },
      { t: "Auto Drips", desc: "Flow automation" },
    ],
  },
  {
    id: "04",
    stepTag: "STEP 04",
    t: "Launch & Scale",
    subtitle: "Phase Details Active",
    d: "We ship, measure and optimize weekly — you watch revenue grow.",
    fullDesc: "We broadcast official Meta-approved messages, monitor real-time delivery rates and click-through metrics, and perform continuous weekly optimization to maximize sales.",
    img: process4,
    icon: Rocket,
    cardBg: "bg-[linear-gradient(135deg,#8B5CF6_0%,#5B21B6_100%)]",
    activeBg: "bg-[linear-gradient(135deg,#8B5CF6_0%,#5B21B6_100%)]",
    textColor: "text-[#5B21B6]",
    highlights: [
      { t: "Live Broadcast", desc: "98% open rate" },
      { t: "Analytics Log", desc: "CTR tracking" },
      { t: "Weekly Review", desc: "ROI optimization" },
    ],
  },
];

export default function Process() {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const active = selectedStep !== null ? steps[selectedStep] : null;

  return (
    <section id="process" className="relative py-32 bg-white overflow-hidden font-sans">

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">

        {/* Section Header */}
        <motion.div {...fadeUp} className="max-w-xl">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">4 easy steps</div>
          <h2 className="mt-3 font-display font-black text-4xl sm:text-5xl text-emerald-deep leading-tight">
            From kickoff to <span className="text-gradient-brand italic">first sale</span> in a week.
          </h2>
        </motion.div>

        {/* 4 Process Cards Grid (Exact Design from Reference Image) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const isSelected = selectedStep === i;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedStep(isSelected ? null : i)}
                className={`group relative rounded-[32px] ${s.cardBg} text-white pb-5 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer overflow-hidden ${isSelected ? "ring-4 ring-brand scale-[1.03]" : ""
                  }`}
              >
                <div>
                  {/* Card 3D Illustration Image */}
                  <div className="w-full h-44 sm:h-48 overflow-hidden mb-4">
                    <img
                      src={s.img}
                      alt={s.t}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-display font-black px-6 sm:px-7 text-xl sm:text-2xl text-white tracking-tight leading-tight">
                    {s.t}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm px-6 sm:px-7 text-white/90 font-medium leading-relaxed">
                    {s.d}
                  </p>
                </div>

                {/* Card Footer: Step Tag on Left & Arrow Button on Right */}
                <div className="mt-5 pt-3 border-t border-white/20 px-6 sm:px-7 flex items-center justify-between text-xs font-bold">
                  <span className="font-black text-[11px] uppercase tracking-widest text-white/80">
                    {s.stepTag}
                  </span>

                  <div className={`h-8 w-8 shrink-0 rounded-full bg-white ${s.textColor} grid place-items-center shadow-md group-hover:scale-110 transition-transform`}>
                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Step Expanded Details Showcase Card */}
        <AnimatePresence mode="wait">
          {selectedStep !== null && active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className={`rounded-[42px] ${active.activeBg} text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center border border-white/20`}
            >
              {/* Hide Details Button (Top Right) */}
              <button
                onClick={() => setSelectedStep(null)}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 text-xs font-bold transition cursor-pointer text-white border border-white/20 shadow-lg"
              >
                <span>Hide Details</span>
                <X className="h-4 w-4" />
              </button>

              {/* Left Side: 3D Illustration Container (End-to-End Left Side) */}
              <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] flex items-center justify-center rounded-[28px] overflow-hidden">
                <img
                  src={active.img}
                  alt={active.t}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Side: Detailed Phase Info */}
              <div className="space-y-6 pt-4 lg:pt-0">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-black uppercase tracking-wider mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-sunny" />
                    {active.subtitle}
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight pr-28 lg:pr-0">
                    {active.t}
                  </h2>
                </div>

                <p className="text-white/90 text-sm sm:text-base leading-relaxed font-medium">
                  {active.fullDesc}
                </p>

                {/* Phase Highlights */}
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-white/70 mb-3">
                    Phase Highlights & Deliverables
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {active.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/15 space-y-1"
                      >
                        <div className="flex items-center gap-1 font-bold text-xs truncate">
                          <CheckCircle2 className="h-3 w-3 text-sunny shrink-0" />
                          <span className="truncate">{h.t}</span>
                        </div>
                        <div className="text-[10px] opacity-70 truncate">{h.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-4">
                  <Link
                    to="/contact"
                    className="px-8 py-4 rounded-full bg-white text-emerald-deep font-display font-black text-sm shadow-xl hover:bg-cream transition hover:scale-105 inline-flex items-center gap-2"
                  >
                    <span>Start Phase {active.id}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => setSelectedStep((selectedStep + 1) % steps.length)}
                    className="px-5 py-4 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition cursor-pointer"
                  >
                    Next Phase →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
