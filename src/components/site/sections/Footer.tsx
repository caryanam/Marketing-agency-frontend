import { Link } from "react-router-dom";
import { MessageCircle, Instagram, Facebook, Linkedin, Twitter, PhoneCall, Mail, MapPin } from "lucide-react";
import { Blob } from "@/components/site/Decor";

export default function Footer() {
  return (
    <footer className="relative bg-emerald-deep text-white pt-20 pb-8 overflow-hidden font-sans">
      <Blob className="absolute -bottom-20 -left-20 w-96 h-96 text-brand/20" />
      <Blob className="absolute -top-10 right-1/4 w-64 h-64 text-teal-deep/60" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow">
                <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-black text-2xl">Caryanam</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Marketing Agency</div>
              </div>
            </div>
            <p className="mt-6 text-white/70 text-sm leading-relaxed max-w-sm">
              Premium WhatsApp marketing for ambitious Indian brands. Meta-verified, human-led, ROI-obsessed.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Linkedin, Twitter].map((I, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/10 grid place-items-center hover:bg-brand transition"><I className="h-4 w-4" /></a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-display font-black text-lg mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-sunny transition-colors">Home</Link></li>
              <li><a href="/#about" className="hover:text-sunny transition-colors">About Us</a></li>
              <li><a href="/#industries" className="hover:text-sunny transition-colors">Industries</a></li>
              <li><a href="/#whyus" className="hover:text-sunny transition-colors">Why Choose Us</a></li>
              <li><a href="/#testimonials" className="hover:text-sunny transition-colors">Testimonials</a></li>
              <li><Link to="/pricing" className="hover:text-sunny transition-colors">Pricing Plans</Link></li>
              <li><Link to="/faq" className="hover:text-sunny transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-sunny transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-display font-black text-lg mb-4">Legal</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/privacy-policy" className="hover:text-sunny transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-sunny transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-sunny transition-colors">Refund Policy</Link></li>
              <li><Link to="/delete-account" className="hover:text-sunny transition-colors">Delete My Account</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-display font-black text-lg mb-4">Reach Us</div>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                <a href="tel:+917755994123" className="hover:text-sunny transition">+91 7755994123</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                <a href="mailto:support@caryanam.com" className="hover:text-sunny transition">support@caryanam.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                <span>Kharadi, Pune, 411014</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-sm text-white/60">
          <div>© {new Date().getFullYear()} Caryanam Marketing Agency. All rights reserved.</div>
          <div>Kharadi, Pune, 411014</div>
        </div>
      </div>
    </footer>
  );
}
