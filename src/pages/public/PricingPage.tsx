import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { Blob } from "@/components/site/Decor";
import { CreditCard, HelpCircle, Zap, CheckCircle2, ArrowRight, ShieldAlert } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const pricingFaqs = [
  {
    q: "How does the Monthly vs. Daily billing basis work?",
    a: "You can choose between a standard Monthly subscription or a flexible Daily pay-as-you-go plan. Daily plans offer short-term campaign flexibility, while Monthly plans deliver maximum cost savings."
  },
  {
    q: "Are Meta conversation charges included in plan prices?",
    a: "Our plans cover agency management, strategy, dashboard access, and broadcast automation tools. Official Meta WhatsApp conversation charges (e.g. ₹0.78 for utility/marketing messages in India) are billed separately based on actual message volume."
  },
  {
    q: "What is your refund policy?",
    a: "All subscription payments (Monthly or Daily basis) and Meta API credits are strictly non-refundable once activated. You can cancel future auto-renewals at any time from your client portal."
  },
  {
    q: "How does the Meta Green Tick verification assistance work?",
    a: "Our Growth and Enterprise plans include end-to-end guidance for Meta Green Badge verification, including business manager verification and document submission support."
  }
];

export default function PricingPage() {
  const [billingBasis, setBillingBasis] = useState<"monthly" | "daily">("monthly");

  const plans = [
    {
      name: "Starter",
      price: billingBasis === "daily" ? "₹499" : "₹14,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "For growing businesses",
      features: [
        "Up to 10K messages/mo",
        "1 broadcast campaign per week",
        "Standard WhatsApp message templates",
        "Email & ticket customer support",
        "Standard deliverability analytics"
      ],
      tone: "bg-white text-emerald-deep",
      cta: "Start Starter Plan",
      highlight: false,
    },
    {
      name: "Growth",
      price: billingBasis === "daily" ? "₹1,199" : "₹34,999",
      period: billingBasis === "daily" ? "/day" : "/mo",
      tag: "Most popular choice",
      features: [
        "Up to 50K messages/mo",
        "Unlimited broadcast campaigns",
        "Official Meta Green-Tick setup assistance",
        "Dedicated WhatsApp campaign strategist",
        "Advanced real-time analytics & CTR reports",
        "Custom CRM & webhook integration"
      ],
      tone: "bg-gradient-brand text-white",
      cta: "Start Growth Plan",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      tag: "For 100+ business locations",
      features: [
        "Unlimited message throughput SLA",
        "White-glove 1-on-1 account onboarding",
        "Custom API & ERP database integrations",
        "24/7 priority SLA support helpline",
        "Dedicated Cloud API server infra",
        "Quarterly ROI business review meetings"
      ],
      tone: "bg-emerald-deep text-white",
      cta: "Talk to Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between overflow-x-hidden">
      <div>
        <Navbar />
        
        {/* Top Hero Banner */}
        <section className="pt-32 pb-14 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 text-emerald-deep">
              <CreditCard className="h-4 w-4" />
              Transparent Pricing & Service Plans
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Simple Plans. <span className="text-gradient-sun italic">Serious Returns.</span>
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Scale your enterprise WhatsApp marketing with Meta-verified technology, human campaign strategists, and flexible billing options.
            </p>
          </div>
        </section>

        {/* Pricing Cards Grid Section */}
        <section className="py-20 bg-cream relative overflow-hidden">
          <Blob className="absolute -top-20 left-1/4 w-80 h-80 text-brand/10" />
          <Blob className="absolute bottom-0 right-0 w-96 h-96 text-sunny/30" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Billing Basis Toggle (Monthly / Daily) */}
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

            {/* 3 Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {plans.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative rounded-[36px] p-8 flex flex-col justify-between ${p.tone} ${
                    p.highlight ? "shadow-glow md:-translate-y-4 scale-[1.02]" : "shadow-float"
                  } transition hover:-translate-y-1`}
                >
                  {p.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-sunny text-emerald-deep text-xs font-black uppercase tracking-widest shadow-md">
                      {p.tag}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{p.name}</div>
                    <div className="flex items-baseline gap-1">
                      <div className="font-display font-black text-5xl">{p.price}</div>
                      <div className="opacity-70 font-semibold">{p.period}</div>
                    </div>
                    <div className="text-xs opacity-80 mt-1">{p.tag}</div>

                    <hr className="my-6 border-current opacity-15" />

                    <ul className="space-y-3.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm font-medium">
                          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 opacity-90" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className={`mt-8 inline-flex w-full justify-center items-center gap-2 px-6 py-4 rounded-full font-bold transition ${
                      p.highlight
                        ? "bg-white text-emerald-deep hover:bg-cream"
                        : "bg-gradient-sun text-emerald-deep hover:shadow-glow"
                    }`}
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* No Refund Policy Notice Bar */}
            <div className="mt-12 p-6 rounded-3xl bg-white shadow-float border border-emerald-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-700 grid place-items-center shrink-0">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="font-display font-bold text-base text-emerald-deep">Billing Policy & Terms</div>
                  <div className="text-xs text-muted-foreground">All subscription plans (Monthly or Daily basis) and Meta API credits operate under a strict <strong>No Refund Policy</strong> once activated.</div>
                </div>
              </div>
              <Link to="/refund-policy" className="text-xs font-bold text-brand hover:underline shrink-0">
                Read No Refund Policy →
              </Link>
            </div>

          </div>
        </section>

        {/* Pricing FAQs & Enterprise Section */}
        <section className="py-20 bg-white border-t border-emerald-100/60">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="text-xs font-black uppercase tracking-[0.3em] text-brand">Got Questions?</div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-black text-emerald-deep">
                Frequently Asked <span className="text-gradient-sun italic">Questions</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pricingFaqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-3xl bg-cream/70 border border-emerald-100/60 space-y-3">
                  <div className="font-display font-bold text-lg text-emerald-deep flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Enterprise Banner CTA */}
            <div className="mt-16 rounded-[36px] bg-gradient-brand p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sunny mb-3">
                  <Zap className="h-3.5 w-3.5" /> Need Custom Enterprise Limits?
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl">Have over 100K WhatsApp Subscribers?</h3>
                <p className="text-white/80 text-sm mt-1">Get custom SLA contracts, dedicated server infrastructure, and volume discounts.</p>
              </div>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-full bg-gradient-sun text-emerald-deep font-bold text-sm shadow-float hover:shadow-glow hover:-translate-y-0.5 transition shrink-0"
              >
                Request Enterprise Quote
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
