import { useEffect, useState } from "react";
import {
  useClientActivePlans,
  useClientCurrentSubscription,
  useClientPaymentHistory,
  usePurchaseSubscription,
  useUpgradeSubscription,
  useClientSubscriptionHistory,
} from "@/hooks/client/useClientSubscription";
import { CreditCard, CheckCircle2, Sparkles, AlertCircle, Calendar, Receipt, DollarSign } from "lucide-react";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ClientPlans() {
  const { data: plans = [], isLoading: isPlansLoading } = useClientActivePlans();
  const { data: activeSub, isLoading: isActiveSubLoading } = useClientCurrentSubscription();
  const { data: payments = [], isLoading: isPaymentsLoading } = useClientPaymentHistory();
  const { data: subHistory = [] } = useClientSubscriptionHistory();

  const purchaseMutation = usePurchaseSubscription();
  const upgradeMutation = useUpgradeSubscription();

  const [billingBasis, setBillingBasis] = useState<"MONTHLY" | "DAILY">("MONTHLY");

  // Purchase Dialog State
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("asifattar003@oksbi");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPlans = plans.filter((p) => p.planType === billingBasis && p.isActive);

  const handleOpenPurchase = (plan: any) => {
    setSelectedPlan(plan);
    setIsPayOpen(true);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const payload = {
      planId: selectedPlan.id,
      paymentMethod,
    };

    if (activeSub) {
      await upgradeMutation.mutateAsync(payload);
    } else {
      await purchaseMutation.mutateAsync(payload);
    }

    setIsPayOpen(false);
  };

  const isLoading = isPlansLoading || isActiveSubLoading || isPaymentsLoading;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Client Billing</div>
            <h1 className="font-display font-black text-3xl md:text-4xl mt-1">My Plan & Subscriptions</h1>
            <p className="text-white/80 text-sm mt-1">View your active subscription details, features allocation, and request packages.</p>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-3 shrink-0">
            <CreditCard className="h-5 w-5 text-sunny animate-pulse" />
            <span className="text-sm font-bold">
              Active Plan: {activeSub ? activeSub.plan?.planName : "None (Free Tier)"}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {/* Active Plan Overview Card Skeleton */}
          <div className="rounded-[28px] bg-white p-6 shadow-float border border-brand/5 space-y-4">
            <div className="h-4 bg-cream-dark/30 rounded-lg w-1/4" />
            <div className="h-7 bg-cream-dark/30 rounded-lg w-1/3" />
            <div className="h-4 bg-cream-dark/30 rounded-lg w-1/2" />
          </div>

          {/* Pricing Grid Skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-[28px] p-6 border border-cream bg-white space-y-6">
                <div className="space-y-3">
                  <div className="h-6 bg-cream-dark/30 rounded-lg w-1/3" />
                  <div className="h-3 bg-cream-dark/30 rounded-lg w-1/4" />
                  <div className="h-8 bg-cream-dark/30 rounded-lg w-1/2" />
                </div>
                <hr className="border-cream" />
                <div className="space-y-3">
                  <div className="h-4 bg-cream-dark/30 rounded-lg w-5/6" />
                  <div className="h-4 bg-cream-dark/30 rounded-lg w-4/5" />
                  <div className="h-4 bg-cream-dark/30 rounded-lg w-3/4" />
                </div>
                <div className="h-10 bg-cream-dark/30 rounded-xl w-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Plan Overview Card */}
          <div className="rounded-[28px] bg-white p-6 shadow-float border border-brand/5 relative overflow-hidden">
            <div className="absolute -right-24 -bottom-24 w-64 h-64 rounded-full bg-brand/5 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest">
                  <Sparkles className="h-4 w-4 text-sunny" /> CURRENT SUBSCRIPTION STATE
                </div>
                {activeSub ? (
                  <div>
                    <h2 className="font-display font-black text-3xl text-emerald-deep">
                      {activeSub.plan?.planName} Plan is {activeSub.subscriptionStatus}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xl font-medium mt-1">
                      Your subscription was approved on {activeSub.approvedDate ? new Date(activeSub.approvedDate).toLocaleDateString("en-IN") : "N/A"}.
                      It remains valid until <span className="font-bold text-brand">{activeSub.expiryDate ? new Date(activeSub.expiryDate).toLocaleDateString("en-IN") : "N/A"}</span>.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-emerald-deep">
                      <span className="bg-cream px-3 py-1.5 rounded-xl border border-cream/50">
                        Remaining Messages: {activeSub.remainingMessages?.toLocaleString()}
                      </span>
                      <span className="bg-cream px-3 py-1.5 rounded-xl border border-cream/50">
                        Campaigns Dispatched: {activeSub.campaignUsed}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="font-display font-black text-3xl text-red-500 flex items-center gap-2">
                      <AlertCircle className="h-7 w-7 text-red-500" /> No Active Plan
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-xl font-medium mt-1">
                      You are currently not on any active plan. Message delivery is disabled. Please select a plan below and submit the transaction receipt.
                    </p>
                  </div>
                )}
              </div>
              {activeSub && (
                <div className="bg-cream p-5 rounded-2xl border border-cream shrink-0 text-center md:text-right">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Approved price</div>
                  <div className="font-display font-black text-2xl text-emerald-deep mt-1">
                    ₹{activeSub.amount?.toLocaleString()}
                  </div>
                  <div className="text-xs text-brand mt-1 font-bold">Status: {activeSub.paymentStatus}</div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Grid */}
          <div>
            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="font-display font-black text-2xl text-emerald-deep">Select & Upgrade Plan</h3>
              <div className="flex bg-cream p-1 rounded-xl border border-cream/50">
                <button
                  onClick={() => setBillingBasis("MONTHLY")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${billingBasis === "MONTHLY"
                    ? "bg-white text-emerald-deep shadow-float"
                    : "text-muted-foreground hover:text-emerald-deep"
                    }`}
                >
                  Monthly Basis
                </button>
                <button
                  onClick={() => setBillingBasis("DAILY")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${billingBasis === "DAILY"
                    ? "bg-white text-emerald-deep shadow-float"
                    : "text-muted-foreground hover:text-emerald-deep"
                    }`}
                >
                  Daily Basis
                </button>
              </div>
            </div>

            <div className="grid xl:grid-cols-3 md:grid-cols-2  gap-6">
              {filteredPlans.map((p, i) => {
                const isCurrent = activeSub?.plan?.id === p.id && activeSub.subscriptionStatus === "ACTIVE";
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-[28px] p-6 border flex flex-col justify-between relative overflow-hidden bg-white border-cream text-emerald-deep`}
                  >
                    {isCurrent && (
                      <div className="absolute top-0 right-0 bg-sunny text-emerald-deep text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                        Current
                      </div>
                    )}
                    <div>
                      <h4 className="font-display font-black text-2xl">{p.planName}</h4>
                      <p className="opacity-80 text-xs mt-1 font-semibold">{p.planCode}</p>
                      <div className="my-5">
                        <span className="font-display font-black text-4xl">₹{p.price.toLocaleString()}</span>
                        <span className="text-xs opacity-70"> / {p.validityDays} days</span>
                      </div>
                      <ul className="space-y-3.5 border-t border-cream pt-5">
                        <li className="flex items-start gap-2 text-sm font-semibold opacity-90">
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          <span>Messages limit: {p.messageLimit.toLocaleString()}</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm font-semibold opacity-90">
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          <span>Campaigns limit: {p.campaignLimit} run</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm font-semibold opacity-90">
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          <span>Validity: {p.validityDays} days calendar period</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-3.5 rounded-2xl bg-cream text-muted-foreground font-bold text-sm cursor-not-allowed border border-cream"
                        >
                          Current Active Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPurchase(p)}
                          className="w-full py-3.5 rounded-2xl text-sm font-bold shadow-float transition-all hover:scale-[1.02] cursor-pointer bg-gradient-brand text-white font-black"
                        >
                          {activeSub ? "Request Upgrade" : "Purchase Plan"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {filteredPlans.length === 0 && (
                <p className="lg:col-span-3 text-sm text-muted-foreground italic font-medium p-8 text-center bg-white rounded-3xl border border-cream shadow-float">
                  No plans configured under {billingBasis.toLowerCase()} basis.
                </p>
              )}
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="rounded-[28px] bg-white p-6 shadow-float border border-cream mt-8">
            <h3 className="font-display font-black text-xl text-emerald-deep mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-brand" /> Payment Receipts Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cream text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Plan Name</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Purchase Date</th>
                    <th className="pb-3">Moderator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/60">
                  {payments.map((p) => {
                    const sub = subHistory.find((s) => s.id === p.clientSubscriptionId);
                    const planName = sub?.plan?.planName || "Package #" + p.clientSubscriptionId;

                    return (
                      <tr key={p.id} className="text-xs sm:text-sm font-semibold text-emerald-deep hover:bg-cream/10 transition">
                        <td className="py-3.5 pl-2 font-bold">{planName}</td>
                        <td className="py-3.5 font-extrabold">₹{p.amount.toLocaleString()}</td>
                        <td className="py-3.5 text-xs">{p.paymentMethod}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${p.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-deep"
                              : p.status === "REJECTED"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-[10px] text-muted-foreground">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—"}
                        </td>
                        <td className="py-3.5 text-xs text-muted-foreground italic font-normal max-w-xs truncate">
                          {p.remarks || "—"}
                        </td>
                      </tr>
                    );
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground italic font-medium">
                        No transactions filed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BILLING DIALOG WITH MOCK DETAILS */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="max-w-[380px] w-full rounded-3xl p-5 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-display font-black text-lg text-emerald-deep text-center">
              Complete Payment & File Receipt
            </DialogTitle>
          </DialogHeader>

          <div className="my-1 space-y-3">
            {/* Plan and Amount Overview */}
            <div className="flex justify-between items-center bg-cream p-3 rounded-xl border border-cream/50 text-emerald-deep text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block">Plan</span>
                <span className="font-display font-black">{selectedPlan?.planName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block">Amount Due</span>
                <span className="font-display font-black text-brand">₹{selectedPlan?.price?.toLocaleString()}</span>
              </div>
            </div>

            {/* Scannable Dynamic QR Code Image */}
            <div className="text-center py-1 flex flex-col items-center justify-center">
              <div className="bg-white p-2.5 rounded-2xl border border-cream shadow-md inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `upi://pay?pa=asifattar003@oksbi&pn=Caryanam&am=${selectedPlan?.price}&cu=INR`
                  )}`}
                  alt="Scan to Pay"
                  className="w-28 h-28"
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5 font-semibold">Scan to pay via any UPI App</p>
            </div>

            {/* UPI ID Details and Copy */}
            <div className="flex items-center justify-between bg-cream px-3 py-2.5 rounded-xl border border-cream/50 text-xs font-semibold text-emerald-deep">
              <div className="min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">UPI ID</span>
                <span className="font-mono text-emerald-deep select-all truncate block">asifattar003@oksbi</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-brand border border-emerald-100/50 text-[9px] font-bold cursor-pointer transition shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <form onSubmit={handlePaySubmit} className="space-y-3">
            <p className="text-xs text-emerald-deep font-semibold text-center py-2">
              Once you have completed the payment via UPI, click below to submit your subscription request.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-cream">
              <button
                type="button"
                onClick={() => setIsPayOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition cursor-pointer text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={purchaseMutation.isPending || upgradeMutation.isPending}
                className="px-4 py-2.5 rounded-xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition cursor-pointer text-[11px]"
              >
                Submit Receipt
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
