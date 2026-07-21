import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { HelpCircle, ChevronDown, MessageSquare, Zap, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "meta", label: "Meta & Setup" },
  { id: "campaigns", label: "Campaigns & Broadcasts" },
  { id: "pricing", label: "Pricing & Billing" },
  { id: "security", label: "Security & Opt-Ins" },
];

const faqs = [
  {
    category: "meta",
    q: "How long does Meta Business Verification and Green Tick approval take?",
    a: "Meta Business Verification usually takes 2–5 business days once all required registration documents are submitted. The Green Badge (Green Tick) verification application is submitted right after and takes 24–48 hours."
  },
  {
    category: "meta",
    q: "Do I need an existing WhatsApp Business account or phone number?",
    a: "You can use a brand new phone number or migrate your existing business number to official Meta WhatsApp Cloud API. Our onboarding team handles the migration process without downtime."
  },
  {
    category: "campaigns",
    q: "What is the delivery rate for WhatsApp broadcast campaigns?",
    a: "Unlike traditional SMS or email (which average 10–20% open rates), official Meta WhatsApp broadcasts boast a 98% open rate and 45%+ click-through rate when sent to opted-in contact lists."
  },
  {
    category: "campaigns",
    q: "Can I schedule automated drip campaigns and auto-replies?",
    a: "Yes! Our agency portal supports multi-step automated workflows, custom interactive buttons, list options, dynamic template variables, and instant auto-replies."
  },
  {
    category: "pricing",
    q: "Are Meta conversation charges separate from plan subscription fees?",
    a: "Yes. Agency subscription plans cover platform access, custom template design, CRM integrations, and dedicated campaign strategy. Official Meta conversation rates (charged per 24-hour window) are billed directly based on exact message volume."
  },
  {
    category: "pricing",
    q: "Is there a free trial or 14-day satisfaction guarantee?",
    a: "We offer a 14-day 100% money-back satisfaction guarantee on all Starter and Growth plans. You can also request a free live demo with our campaign strategists."
  },
  {
    category: "security",
    q: "Will my WhatsApp Business number get blocked for broadcasting?",
    a: "No. By broadcasting official Meta-approved message templates to opted-in subscribers through official WhatsApp Cloud API, your account complies 100% with Meta rules, preventing number bans."
  },
  {
    category: "security",
    q: "How is subscriber data secured on your platform?",
    a: "We enforce end-to-end encryption (TLS 1.3 / AES-256) and store contact data in isolated database instances. We never share or sell client contact lists."
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = activeCategory === "all"
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Hero Banner (Matching Legal/Pricing/Contact Pages) */}
        <section className="pt-32 pb-16 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 text-emerald-deep">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Everything You <span className="text-gradient-sun italic">Need To Know</span>
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Got questions about Meta verification, campaign setup, pricing, or broadcast deliverability? Find answers below.
            </p>
          </div>
        </section>

        {/* FAQ Filter & Content Section */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {faqCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "bg-white text-emerald-deep border border-emerald-100 hover:bg-emerald-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-3xl bg-white border border-emerald-100/80 shadow-float overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-emerald-deep cursor-pointer hover:bg-cream/40 transition"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-brand shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-emerald-deep shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-cream pl-14">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Need More Help Banner */}
          <div className="mt-16 rounded-[36px] bg-gradient-brand p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-glow">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sunny mb-2">
                <MessageSquare className="h-3.5 w-3.5" /> Have a specific question?
              </div>
              <h3 className="font-display font-black text-2xl">Can't find what you're looking for?</h3>
              <p className="text-white/80 text-sm mt-1">Our WhatsApp campaign strategists are online and ready to answer your questions.</p>
            </div>
            <a
              href="/contact"
              className="px-7 py-3.5 rounded-full bg-gradient-sun text-emerald-deep font-bold text-sm shadow-float hover:shadow-glow hover:-translate-y-0.5 transition shrink-0 inline-flex items-center gap-2"
            >
              <span>Contact Support</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
