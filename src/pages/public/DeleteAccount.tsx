import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import Footer from "@/components/site/sections/Footer";
import { UserX, Trash2, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== "DELETE") {
      toast.error("Please type DELETE to confirm account removal.");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Account deletion request submitted successfully.");

    // If logged-in user email matches, clear session
    const currentEmail = localStorage.getItem("userEmail");
    if (currentEmail && currentEmail.toLowerCase() === email.toLowerCase()) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    }
  };

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-32 pb-16 bg-cream text-foreground relative border-b border-emerald-100/60">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100/80 border border-red-200 text-xs font-bold uppercase tracking-wider mb-6 text-red-700">
              <UserX className="h-4 w-4" />
              Account Removal Request
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl mb-4 leading-tight text-emerald-deep">
              Delete My Account
            </h1>
            <p className="text-emerald-900/70 max-w-xl mx-auto text-sm sm:text-base">
              Submit a formal request to delete your Caryanam marketing account and associated business data.
            </p>
            <p className="text-xs text-muted-foreground mt-4 font-semibold">Last Updated: July 2026</p>
          </div>
        </section>

        {/* Content & Form Section */}
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 items-start">

            {/* Explanatory Info */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-float border border-emerald-100/60 space-y-6">
              <h2 className="font-display font-black text-xl text-emerald-deep flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                What Gets Deleted?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When your account deletion request is processed, the following data will be permanently purged within 30 days:
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Your profile credentials, company details, and team member accounts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>All uploaded contact lists, subscriber groups, and segmentation tags.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Broadcast campaign history, deliverability reports, and analytics logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Custom WhatsApp message templates and draft assets.</span>
                </li>
              </ul>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                ⚠️ <strong>Note:</strong> Active subscriptions will be cancelled immediately. Account deletion is permanent and cannot be undone.
              </div>
            </div>

            {/* Request Form */}
            <div className="md:col-span-3 bg-white rounded-3xl p-6 sm:p-10 shadow-float border border-emerald-100/60">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-deep rounded-full grid place-items-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-brand" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-emerald-deep">
                    Request Received
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your account deletion request has been logged. Our data protection team will verify your account details and complete removal within 30 business days.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-brand text-white font-bold text-sm shadow-glow mt-4 cursor-pointer"
                  >
                    <span>Back to Home</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-2xl bg-red-50 text-red-600 grid place-items-center shrink-0">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl text-emerald-deep">Submit Removal Request</h3>
                      <p className="text-xs text-muted-foreground">Fill in your registered email to request deletion</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2">
                      Registered Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-emerald-200 outline-none focus:border-brand text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2">
                      Reason for Deletion (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Help us improve. Tell us why you wish to delete your account..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-emerald-200 outline-none focus:border-brand text-sm transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2">
                      Type <span className="text-red-600 font-black">DELETE</span> to confirm *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="DELETE"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-emerald-200 outline-none focus:border-red-500 text-sm transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Permanently Delete Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
