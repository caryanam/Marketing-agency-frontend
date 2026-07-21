import { motion } from "motion/react";
import { Quote, Star, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";

const quotes = [
  {
    n: "Rohan Malhotra",
    role: "Founder · AutoZone Motors",
    industry: "Automotive Dealership",
    q: "Caryanam turned our WhatsApp into our #1 revenue channel. We booked 320 test drives in just one month with zero spam complaints.",
    result: "320 Test Drives Booked",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60",
    rating: 5,
  },
  {
    n: "Priya Nair",
    role: "Marketing Head · GreenLeaf Healthcare",
    industry: "Healthcare & OPD",
    q: "The templates and Meta Green-Tick setup were completely seamless. OPD appointments grew 3x and patient no-shows dropped by 40%.",
    result: "3x Appointment Lift",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60",
    rating: 5,
  },
  {
    n: "Aditya Sharma",
    role: "CEO · Sharma Luxury Realty",
    industry: "Real Estate & Housing",
    q: "They treat every broadcast campaign like their own product launch. Our cost-per-lead dropped from ₹480 down to ₹110 within 3 weeks.",
    result: "₹110 Cost-Per-Lead",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-32 bg-white overflow-hidden font-sans">
      <Blob className="absolute -left-20 top-20 w-96 h-96 text-brand/10" />
      <Blob className="absolute -right-20 bottom-10 w-96 h-96 text-sunny/20" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header (Matching Process & Industries Left-Aligned Layout) */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-20">
          <motion.div {...fadeUp}>
            <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Verified Client Success Stories</div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-emerald-deep tracking-tight leading-tight">
              Loved by ambitious <span className="text-gradient-brand italic">Indian Brands</span>
            </h2>
          </motion.div>

        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative pt-6">
          {quotes.map((q, i) => (
            <motion.div
              key={q.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`group relative rounded-[36px] bg-cream/70 border border-emerald-100/80 p-8 pt-14 flex flex-col justify-between shadow-float hover:shadow-glow hover:bg-white transition-all duration-300 ${i === 1 ? "md:-translate-y-4" : ""
                }`}
            >
              {/* Floating Top Avatar Badge */}
              <div className="absolute -top-8 left-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-brand blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                  <img
                    src={q.img}
                    alt={q.n}
                    className="relative h-16 w-16 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-brand text-white grid place-items-center border-2 border-white shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              {/* Watermark Quote Icon */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-emerald-900/10 group-hover:text-brand/20 transition-colors" />

              <div>
                {/* Rating & Result Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-sunny">
                    {[...Array(q.rating)].map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-deep text-[11px] font-extrabold shadow-sm">
                    <TrendingUp className="h-3 w-3 text-brand" />
                    <span>{q.result}</span>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-emerald-deep/90 text-sm sm:text-base leading-relaxed font-medium italic">
                  "{q.q}"
                </p>
              </div>

              {/* Author Details */}
              <div className="mt-8 pt-6 border-t border-emerald-100/60 flex items-center justify-between">
                <div>
                  <div className="font-display font-black text-emerald-deep text-base">
                    {q.n}
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                    {q.role}
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cream text-brand border border-emerald-200/60">
                  {q.industry.split(" ")[0]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <motion.div {...fadeUp} className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-emerald-100 shadow-float">
            <span className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-emerald-deep">
              Over 500+ Indian Enterprise Brands Trust Caryanam for WhatsApp Revenue Growth
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
