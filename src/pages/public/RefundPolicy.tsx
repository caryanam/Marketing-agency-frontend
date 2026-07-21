import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { CreditCard, ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Hero Banner */}
        <section className="pt-32 pb-16 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/80 border border-red-200 text-xs font-bold uppercase tracking-wider mb-6 text-red-700">
              <ShieldAlert className="h-4 w-4" />
              No Refund Policy & Billing Terms
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              No Refund Policy
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Please read our billing terms carefully. All service purchases, monthly/daily subscriptions, and Meta WhatsApp charges are final and non-refundable.
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">Last Updated: July 2026</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-float border border-emerald-100/60 space-y-10 text-foreground/80 leading-relaxed text-sm sm:text-base">
            
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
              <div className="font-display font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                Strict No-Refund Declaration
              </div>
              <p className="text-sm leading-relaxed text-red-800/90">
                All fees paid to Caryanam Marketing Agency for subscription plans (Monthly Basis or Daily Basis), Meta Green-Tick setup, and WhatsApp conversation API credits are <strong>strictly non-refundable</strong> under any circumstances once processed.
              </p>
            </div>

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                1. Subscription Plan Payments (Monthly & Daily Basis)
              </h2>
              <p className="mb-3">
                Upon subscribing to any plan (Starter, Growth, or Enterprise) on either a Monthly Basis or Daily Basis, digital access to our campaign platform, server infrastructure, and dedicated strategist allocation is provisioned immediately.
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>No partial or prorated refunds are issued for unused days or remaining billing cycles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>You may cancel future auto-renewals at any time from your client portal before the next billing date.</span>
                </li>
              </ul>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                2. Meta WhatsApp Conversation API Charges
              </h2>
              <p>
                Meta WhatsApp Business API conversation charges for delivered broadcast messages are remitted directly to Meta infrastructure. Once messages are dispatched or queued, these charges are strictly non-refundable and non-transferable.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                3. Duplicate Charges & Billing Glitches
              </h2>
              <p>
                In the rare event of a technical payment gateway error resulting in duplicate charges for the same invoice, the extra payment will be refunded to your original payment method within 5–7 business days upon verification by our billing team at <a href="mailto:support@caryanam.com" className="text-brand font-bold underline">support@caryanam.com</a>.
              </p>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
