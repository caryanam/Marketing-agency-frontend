import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-32 pb-16 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 text-emerald-deep">
              <FileText className="h-4 w-4" />
              Service Terms & Usage Agreement
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Terms of Service
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Please review the terms and conditions governing the use of Caryanam WhatsApp marketing platform and agency services.
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">Last Updated: July 2026</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-float border border-emerald-100/60 space-y-10 text-foreground/80 leading-relaxed text-sm sm:text-base">

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account, accessing the Caryanam platform, or subscribing to our marketing services, you agree to be bound by these Terms of Service and all applicable Meta WhatsApp Business Policies.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-brand shrink-0" />
                2. Acceptable Use Policy for WhatsApp Messaging
              </h2>
              <p className="mb-3">
                Clients must comply with Meta's Official WhatsApp Commerce & Business Policies. The following activities are strictly prohibited:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>Sending unsolicited bulk spam messages to non-consenting recipients.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>Promoting prohibited goods, illegal services, gambling, or deceptive offers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>Falsifying identity, headers, or business verification details.</span>
                </li>
              </ul>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                3. Service Availability & SLA
              </h2>
              <p>
                We strive for 99.9% platform uptime for broadcast scheduling and template submissions. Service delivery is subject to Meta's WhatsApp Cloud API infrastructure availability and rate limits.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                4. Subscription & Payments
              </h2>
              <p>
                Subscriptions are billed on a recurring monthly or annual basis depending on your selected plan. Meta WhatsApp conversation charges are billed separately according to official tier rates.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                5. Contact Legal Team
              </h2>
              <p>
                For questions regarding terms of service or compliance, email <a href="mailto:legal@caryanam.com" className="text-brand font-bold underline">legal@caryanam.com</a>.
              </p>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
