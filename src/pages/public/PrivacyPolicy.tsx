import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-32 pb-16 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 text-emerald-deep">
              <ShieldCheck className="h-4 w-4" />
              Data Protection & Privacy
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Privacy Policy
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              At Caryanam Marketing Agency, your privacy and data security are our top priorities. Learn how we handle your personal and business information.
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">Last Updated: July 2026</p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-float border border-emerald-100/60 space-y-10 text-foreground/80 leading-relaxed text-sm sm:text-base">

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6 text-brand shrink-0" />
                1. Information We Collect
              </h2>
              <p className="mb-3">
                We collect information necessary to provide enterprise WhatsApp marketing, campaign coordination, and workflow management services. This includes:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span><strong>Account Information:</strong> Name, business email, phone number, company name, and login credentials.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span><strong>Campaign Data:</strong> WhatsApp contact subscriber lists, broadcast campaign templates, message metrics, and deliverability logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span><strong>Payment & Transaction Details:</strong> Billing records, subscription plan selections, and invoice history.</span>
                </li>
              </ul>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4 flex items-center gap-3">
                <Lock className="h-6 w-6 text-brand shrink-0" />
                2. How We Use Your Data
              </h2>
              <p className="mb-3">
                Your data is utilized strictly for executing your marketing workflows and delivering platform functionality:
              </p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>To broadcast official Meta-approved WhatsApp messages to your opted-in subscribers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>To measure campaign performance, delivery rates, and generate analytics reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                  <span>To communicate account updates, technical alerts, and customer support responses.</span>
                </li>
              </ul>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-brand shrink-0" />
                3. Data Sharing & Meta API Compliance
              </h2>
              <p className="mb-3">
                We respect your audience privacy. We never sell, rent, or lease client phone lists or personal data to third parties. Data is shared strictly with official Meta WhatsApp Business Cloud APIs to facilitate message routing.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                4. Data Retention & Security
              </h2>
              <p>
                We employ enterprise-grade encryption (TLS/SSL and AES-256) to safeguard subscriber data at rest and in transit. Campaign logs and subscriber data are retained for as long as your account remains active or until explicit deletion requests are submitted.
              </p>
            </div>

            <hr className="border-cream" />

            <div>
              <h2 className="font-display font-black text-2xl text-emerald-deep mb-4">
                5. Contact Privacy Officer
              </h2>
              <p>
                If you have questions regarding our privacy practices or data processing, please contact us at <a href="mailto:privacy@caryanam.com" className="text-brand font-bold underline">privacy@caryanam.com</a>.
              </p>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
