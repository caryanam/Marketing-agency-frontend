import { motion } from "motion/react";
import { Quote, Star, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { Blob } from "@/components/site/Decor";
import { fadeUp } from "@/lib/animations";
import { usePublicFeedbacks } from "@/hooks/public/usePublicFeedback";

const EMOJIS = ["🧑‍💻", "👩‍💻", "🧑‍💼", "👩‍💼", "🚀", "💡", "🎯", "🌟", "🦁", "🦊", "🐼", "🦄"];

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Cars",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Healthcare",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance",
  FINANCE_COMPANIES: "Finance",
  SCHOOLS_AND_COLLEGES: "Education",
  HOTELS_AND_RESTAURANTS: "Hospitality",
};

const CardSkeleton = () => (
  <div className="w-full h-[230px] rounded-[28px] bg-cream/30 border border-emerald-100/50 p-5 sm:p-6 flex flex-col justify-between animate-pulse">
    <div className="space-y-3">
      <div className="h-6 w-6 rounded-md bg-emerald-100/40" />
      <div className="h-4 w-3/4 rounded bg-emerald-100/30" />
      <div className="h-4 w-5/6 rounded bg-emerald-100/30" />
      <div className="h-4 w-2/3 rounded bg-emerald-100/30" />
    </div>
    <div className="mt-3 pt-3 border-t border-emerald-100/40 flex items-center gap-3">
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-100/40 shrink-0" />
      <div className="space-y-2 w-full">
        <div className="h-3.5 w-1/3 rounded bg-emerald-100/40" />
        <div className="h-2.5 w-1/2 rounded bg-emerald-100/30" />
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  const { feedbacks, isLoading } = usePublicFeedbacks();

  const displayTestimonials = feedbacks.map((fb, idx) => ({
    n: fb.clientName,
    role: fb.designation ? `${fb.designation} · ${fb.companyName}` : fb.companyName,
    industry: REVERSE_CATEGORY_MAP[fb.serviceName] || fb.serviceName,
    q: fb.comment,
    result: fb.rating === 5 ? "Highly Satisfied" : "Verified Client",
    emoji: EMOJIS[idx % EMOJIS.length],
    rating: fb.rating,
  }));

  // Use all testimonials in both rows but in different orders for a varied mix
  const row1Items = [...displayTestimonials];
  const row2Items = displayTestimonials.length > 1
    ? [...displayTestimonials].reverse()
    : [...displayTestimonials];

  // Repeat items to ensure the rows cover at least twice the viewport width for seamless looping
  const fillRow = (items: typeof displayTestimonials, minCount = 8) => {
    if (items.length === 0) return [];
    let result = [...items];
    while (result.length < minCount) {
      result = [...result, ...items];
    }
    // Duplicate once for seamless infinite scrolling loop
    return [...result, ...result];
  };

  const finalRow1 = fillRow(row1Items);
  const finalRow2 = fillRow(row2Items);

  return (
    <section id="testimonials" className="relative py-32 bg-white overflow-hidden font-sans">
      <Blob className="absolute -left-20 top-20 w-96 h-96 text-brand/10 pointer-events-none" />
      <Blob className="absolute -right-20 bottom-10 w-96 h-96 text-sunny/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          <motion.div {...fadeUp}>
            <div className="text-sm font-black uppercase tracking-[0.3em] text-brand">Verified Client Success Stories</div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-emerald-deep tracking-tight leading-tight mt-2">
              Loved by ambitious <span className="text-gradient-brand italic">Indian Brands</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Marquee Container */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 relative z-10">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : displayTestimonials.length === 0 ? (
        <div className="max-w-xl mx-auto px-6 relative z-10">
          <div className="rounded-[36px] bg-cream/40 border border-emerald-100/60 p-10 text-center shadow-float">
            <Quote className="h-8 w-8 text-brand/40 mx-auto mb-4" />
            <p className="text-emerald-deep font-semibold text-sm leading-relaxed">
              We are currently compiling new success stories from our brand partners. Check back shortly to see verified growth testimonials!
            </p>
          </div>
        </div>
      ) : (
        <div className="marquee-container relative w-full overflow-hidden flex flex-col gap-6 py-6 cursor-default">
          {/* Fading gradient overlays on edges */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          {/* Row 1: Left-to-Right (Scrolls Right) */}
          <div className="w-full overflow-hidden flex">
            <div className="animate-marquee-right flex gap-6 pr-6">
              {finalRow1.map((q, i) => (
                <div
                  key={`row1-${q.n}-${i}`}
                  className="w-[280px] sm:w-[350px] h-[230px] shrink-0 rounded-[28px] bg-cream/40 border border-emerald-100/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-glow hover:bg-cream/10 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <Quote className="h-6 w-6 text-brand/75 mb-2" />
                    <p className="text-emerald-deep/90 text-xs sm:text-sm leading-relaxed font-semibold italic line-clamp-3">
                      "{q.q}"
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 border border-emerald-100 flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0">
                      {q.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-black text-emerald-deep text-xs sm:text-sm capitalize truncate">
                        {q.n}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold truncate">
                        {q.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right-to-Left (Scrolls Left) */}
          <div className="w-full overflow-hidden flex">
            <div className="animate-marquee-left flex gap-6 pr-6">
              {finalRow2.map((q, i) => (
                <div
                  key={`row2-${q.n}-${i}`}
                  className="w-[280px] sm:w-[350px] h-[230px] shrink-0 rounded-[28px] bg-cream/40 border border-emerald-100/80 p-5 sm:p-6 flex flex-col justify-between  hover:shadow-glow hover:bg-cream/10 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <Quote className="h-6 w-6 text-brand/75 mb-2" />
                    <p className="text-emerald-deep/90 text-xs sm:text-sm leading-relaxed font-semibold italic line-clamp-3">
                      "{q.q}"
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-100/60 flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/90 border border-emerald-100 flex items-center justify-center text-xl sm:text-2xl shadow-sm shrink-0">
                      {q.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-black text-emerald-deep text-xs sm:text-sm capitalize truncate">
                        {q.n}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-muted-foreground font-semibold truncate">
                        {q.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Trust Banner */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
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




