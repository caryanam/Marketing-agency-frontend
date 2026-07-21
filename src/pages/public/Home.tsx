import { Navbar } from "@/components/site/Navbar";
import Hero from "@/components/site/sections/Hero";
import TrustStrip from "@/components/site/sections/TrustStrip";
import About from "@/components/site/sections/About";
import Industries from "@/components/site/sections/Industries";
import WhyUs from "@/components/site/sections/WhyUs";
import Process from "@/components/site/sections/Process";
import Pricing from "@/components/site/sections/Pricing";
import Testimonials from "@/components/site/sections/Testimonials";
import Contact from "@/components/site/sections/Contact";
import Footer from "@/components/site/sections/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-cream text-foreground font-sans">
      <Navbar />
      <Hero />
      <TrustStrip />
      <About />
      <Industries />
      <WhyUs />
      <Process />

      <Testimonials />

      <Footer />
    </div>
  );
}
