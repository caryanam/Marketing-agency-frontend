import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";

export default function Pricing() {
  const [billingBasis, setBillingBasis] = useState<"monthly" | "daily">("monthly");

  const plans = [
    {
      name: "Starter",
      price: billingBasis === "daily" ? "₹499" : "₹14,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "For small businesses",
      features: ["Up to 10K messages/mo", "1 campaign per week", "Basic templates", "Email support", "Standard analytics"],
      tone: "bg-white text-emerald-deep",
      cta: "Start Small",
      highlight: false,
    },
    {
      name: "Growth",
      price: billingBasis === "daily" ? "₹1,199" : "₹34,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "Most popular choice",
      highlight: true,
      features: ["Up to 50K messages/mo", "Unlimited campaigns", "Meta green-tick setup", "Dedicated strategist", "Advanced analytics", "CRM integration"],
      tone: "bg-gradient-brand text-white",
      cta: "Grow Fast",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      tag: "For 100+ locations",
      features: ["Unlimited messages", "White-glove onboarding", "Custom integrations", "24/7 SLA support", "Dedicated infra", "Quarterly business reviews"],
      tone: "bg-emerald-deep text-white",
      cta: "Talk to Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-32 bg-cream overflow-hidden">
      <Blob className="absolute -top-20 left-1/4 w-80 h-80 text-brand/10" />
      <Blob className="absolute bottom-0 right-0 w-96 h-96 text-sunny/30" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Pricing</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-black text-emerald-deep">
            Simple plans. <span className="text-gradient-sun italic">Serious returns.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Flexible billing options. Strict no-refund policy. Cancel auto-renewals any time.</p>
        </motion.div>

        {/* Monthly / Daily Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white p-1.5 rounded-2xl border border-emerald-100/80 shadow-float">
            <button
              onClick={() => setBillingBasis("monthly")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingBasis === "monthly"
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "text-emerald-deep hover:bg-cream"
              }`}
            >
              Monthly Basis
            </button>
            <button
              onClick={() => setBillingBasis("daily")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingBasis === "daily"
                  ? "bg-gradient-brand text-white shadow-glow"
                  : "text-emerald-deep hover:bg-cream"
              }`}
            >
              Daily Basis
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-[36px] p-8 ${p.tone} ${p.highlight ? "shadow-glow md:-translate-y-6 scale-[1.02]" : "shadow-float"} transition hover:-translate-y-1`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sunny text-emerald-deep text-xs font-black uppercase tracking-widest">
                  {p.tag}
                </div>
              )}
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="font-display font-black text-5xl">{p.price}</div>
                <div className="opacity-70 font-semibold">{p.period}</div>
              </div>
              <div className="text-sm opacity-80 mt-1">{p.tag}</div>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href="/contact" className={`mt-8 inline-flex w-full justify-center items-center gap-2 px-6 py-4 rounded-full font-bold transition ${p.highlight ? "bg-white text-emerald-deep hover:bg-cream" : "bg-gradient-sun text-emerald-deep hover:shadow-glow"}`}>
                {p.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
