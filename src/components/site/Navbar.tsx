import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Industries", to: "/#industries" },
  { label: "Testimonials", to: "/#testimonials" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export function Navbar({ darkTheme = false }: { darkTheme?: boolean }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? darkTheme
            ? "backdrop-blur-xl bg-emerald-deep/90 border-b border-white/10 shadow-glow"
            : "backdrop-blur-xl bg-background/70 border-b border-border/60 shadow-float"
          : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-11 w-11 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow group-hover:rotate-6 transition-transform">
            <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className={`font-display font-black text-xl ${darkTheme ? "text-white" : "text-emerald-deep"}`}>
              Caryanam
            </div>
            <div className={`text-[10px] uppercase tracking-[0.2em] ${darkTheme ? "text-white/60" : "text-muted-foreground"}`}>
              Marketing Agency
            </div>
          </div>
        </Link>

        <div className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-2 ${darkTheme ? "bg-white/10 backdrop-blur border border-white/10" : "glass-card"}`}>
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                darkTheme
                  ? "text-white/80 hover:text-white hover:bg-white/15"
                  : "text-foreground/70 hover:text-emerald-deep hover:bg-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className={`text-sm font-semibold transition ${
              darkTheme ? "text-white/90 hover:text-sunny" : "text-emerald-deep hover:text-brand"
            }`}
          >
            Sign in
          </Link>
          <Link
            to="/contact"
            className="px-5 py-3 rounded-full bg-gradient-sun text-emerald-deep font-bold text-sm shadow-float hover:shadow-glow hover:-translate-y-0.5 transition-all"
          >
            Start Free Demo
          </Link>
        </div>

        <button
          className={`lg:hidden p-2 rounded-full ${darkTheme ? "bg-white/10 text-white" : "glass-card"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:hidden mx-4 mb-4 rounded-3xl p-6 flex flex-col gap-2 ${
            darkTheme ? "bg-emerald-deep/95 backdrop-blur border border-white/10 text-white" : "glass-card"
          }`}
        >
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              onClick={() => setOpen(false)}
              className={`py-2 font-semibold ${darkTheme ? "text-white" : "text-emerald-deep"}`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className={`py-2 font-semibold ${darkTheme ? "text-white" : "text-emerald-deep"}`}
          >
            Sign in
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 px-5 py-3 text-center rounded-full bg-gradient-sun text-emerald-deep font-bold"
          >
            Start Free Demo
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
