import { useEffect, useState } from "react";
import {
  useAdminPlans,
  useCreatePlan,
  useUpdatePlan,
  useDisablePlan,
  useAdminSubscriptions,
  useAdminPayments,
  useAdminPendingPayments,
  useApproveRejectPayment,
  SubscriptionPlanItem,
} from "@/hooks/admin/useAdminSubscription";
import { useAdminClients } from "@/hooks/admin/useAdminClients";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Inbox,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PLAN_CODES = [
  "DAILY_STARTER",
  "DAILY_GROWTH",
  "DAILY_ENTERPRISE",
  "MONTHLY_STARTER",
  "MONTHLY_GROWTH",
  "MONTHLY_ENTERPRISE",
];

export default function AdminPlans() {
  const { data: plans = [], isLoading: isPlansLoading } = useAdminPlans();
  const { data: subscriptions = [], isLoading: isSubsLoading } = useAdminSubscriptions();
  const { data: payments = [], isLoading: isPaymentsLoading } = useAdminPayments();
  const { data: pendingPayments = [], isLoading: isPendingLoading } = useAdminPendingPayments();
  const { clients = [] } = useAdminClients();

  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const disablePlanMutation = useDisablePlan();
  const approveRejectPaymentMutation = useApproveRejectPayment();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"PLANS" | "SUBSCRIPTIONS" | "PAYMENTS">("PLANS");

  // Plan Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);
  const [planName, setPlanName] = useState("");
  const [planCode, setPlanCode] = useState("MONTHLY_STARTER");
  const [planType, setPlanType] = useState("MONTHLY");
  const [price, setPrice] = useState("14999");
  const [messageLimit, setMessageLimit] = useState("10000");
  const [campaignLimit, setCampaignLimit] = useState("4");
  const [validityDays, setValidityDays] = useState("30");
  const [isActive, setIsActive] = useState(true);

  // Payment Moderation State
  const [isModOpen, setIsModOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [modStatus, setModStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [remarks, setRemarks] = useState("");

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setPlanName("");
    setPlanCode("MONTHLY_STARTER");
    setPlanType("MONTHLY");
    setPrice("14999");
    setMessageLimit("10000");
    setCampaignLimit("4");
    setValidityDays("30");
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setPlanName(plan.planName);
    setPlanCode(plan.planCode);
    setPlanType(plan.planType);
    setPrice(plan.price.toString());
    setMessageLimit(plan.messageLimit.toString());
    setCampaignLimit(plan.campaignLimit.toString());
    setValidityDays(plan.validityDays.toString());
    setIsActive(plan.isActive);
    setIsFormOpen(true);
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      planName: planName.trim(),
      planCode,
      planType,
      price: parseFloat(price) || 0,
      messageLimit: parseInt(messageLimit, 10) || 1,
      campaignLimit: parseInt(campaignLimit, 10) || 1,
      validityDays: parseInt(validityDays, 10) || 30,
      isActive,
    };

    if (editingPlan) {
      await updatePlanMutation.mutateAsync({ id: editingPlan.id, payload });
    } else {
      await createPlanMutation.mutateAsync(payload);
    }
    setIsFormOpen(false);
  };

  const handleDisablePlan = async (id: number) => {
    if (window.confirm("Are you sure you want to disable/deactivate this subscription plan?")) {
      await disablePlanMutation.mutateAsync(id);
    }
  };

  const handleOpenModerate = (paymentId: number, status: "APPROVED" | "REJECTED") => {
    setSelectedPaymentId(paymentId);
    setModStatus(status);
    setRemarks("");
    setIsModOpen(true);
  };

  const handleModerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentId) return;

    await approveRejectPaymentMutation.mutateAsync({
      id: selectedPaymentId,
      status: modStatus,
      remarks: remarks.trim(),
    });
    setIsModOpen(false);
  };

  const isLoading = isPlansLoading || isSubsLoading || isPaymentsLoading || isPendingLoading;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Card */}
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Platform Services & Revenue</div>
            <h1 className="font-display font-black text-3xl md:text-4xl mt-1">Plans & Billing moderation</h1>
            <p className="text-white/80 text-sm mt-1">Configure service tiers, moderate client transactions, and view subscriptions.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/15">
            {(["PLANS", "SUBSCRIPTIONS", "PAYMENTS"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition flex items-center gap-1.5 ${activeTab === tab ? "bg-white text-emerald-deep shadow-md" : "text-white/80 hover:text-white"
                  }`}
              >
                {tab === "PLANS" && "Plans Creator"}
                {tab === "SUBSCRIPTIONS" && "Client Rosters"}
                {tab === "PAYMENTS" && (
                  <>
                    Transactions
                    {pendingPayments.length > 0 && (
                      <span className="h-4 min-w-[16px] px-1.5 rounded-full bg-sunny text-emerald-deep text-[9px] font-black flex items-center justify-center animate-pulse shadow-sm">
                        {pendingPayments.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          {activeTab === "PLANS" ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-cream-dark/30 rounded-lg w-48" />
                <div className="h-10 bg-cream-dark/30 rounded-full w-40" />
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-[28px] bg-white border border-cream shadow-float space-y-6 p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-cream-dark/30 rounded-lg w-1/3" />
                      <div className="h-6 bg-cream-dark/30 rounded-lg w-1/2" />
                      <div className="h-4 bg-cream-dark/30 rounded-lg w-1/4" />
                    </div>
                    <hr className="border-cream" />
                    <div className="space-y-3.5">
                      <div className="h-3.5 bg-cream-dark/30 rounded-lg w-5/6" />
                      <div className="h-3.5 bg-cream-dark/30 rounded-lg w-4/5" />
                      <div className="h-3.5 bg-cream-dark/30 rounded-lg w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] bg-white p-6 shadow-float border border-cream space-y-6">
              <div className="h-5 bg-cream-dark/30 rounded-lg w-1/3" />
              <div className="space-y-4 pt-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex gap-4 items-center">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-cream-dark/30 rounded-lg w-1/3" />
                      <div className="h-3 bg-cream-dark/30 rounded-lg w-1/4" />
                    </div>
                    <div className="h-4 bg-cream-dark/30 rounded-lg w-20" />
                    <div className="h-4 bg-cream-dark/30 rounded-lg w-24" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10">
          {/* PLANS TAB */}
          {activeTab === "PLANS" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-display font-black text-2xl text-emerald-deep">Available Service Plans</h2>
                <button
                  onClick={handleOpenCreate}
                  className="px-5 py-3 rounded-full bg-gradient-brand text-white font-bold text-xs shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Create Service Plan
                </button>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className={`rounded-[28px] bg-white border border-emerald-100 shadow-float overflow-hidden flex flex-col justify-between transition hover:border-emerald-200 ${!p.isActive ? "opacity-60" : ""
                      }`}
                  >
                    <div className="p-6 bg-cream/40 relative border-b border-emerald-100/50">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-deep">
                          {p.planCode}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-white border border-emerald-100 hover:bg-cream text-emerald-deep cursor-pointer"
                            title="Edit Plan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {p.isActive && (
                            <button
                              onClick={() => handleDisablePlan(p.id)}
                              className="p-1.5 rounded-lg bg-white border border-red-100 hover:bg-red-50 text-red-500 cursor-pointer"
                              title="Disable Plan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="font-display font-black text-xl text-emerald-deep mt-3">{p.planName}</h3>
                      <div className="mt-2">
                        <span className="font-display font-black text-2xl text-emerald-deep">₹{p.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground font-semibold"> / {p.validityDays} days</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <ul className="space-y-3 text-xs font-semibold text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0" />
                          <span>Messages Allowed: {p.messageLimit.toLocaleString()}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0" />
                          <span>Campaigns Limit: {p.campaignLimit.toLocaleString()}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0" />
                          <span>Plan Type: {p.planType}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-deep shrink-0" />
                          <span>Status: {p.isActive ? "ACTIVE" : "DISABLED"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
                {plans.length === 0 && (
                  <p className="lg:col-span-3 text-sm text-muted-foreground italic font-medium p-8 text-center bg-white rounded-3xl border border-emerald-100 shadow-float">
                    No service plans created yet. Click "Create Service Plan" above.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === "SUBSCRIPTIONS" && (
            <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100">
              <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Platform-wide Client Subscriptions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-cream text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Client Details</th>
                      <th className="pb-3">Subscribed Plan</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Messages Usage</th>
                      <th className="pb-3">Campaigns Used</th>
                      <th className="pb-3">Renewal Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream/60">
                    {subscriptions.map((s) => {
                      const clientObj = clients.find((c) => c.id === s.clientId);
                      return (
                        <tr key={s.id} className="text-xs sm:text-sm font-semibold text-emerald-deep hover:bg-cream/10 transition">
                          <td className="py-3.5 pl-2">
                            <div className="font-bold">{clientObj?.companyName || `Client #${s.clientId}`}</div>
                            <div className="text-[11px] text-muted-foreground font-medium">Owner: {clientObj?.ownerName}</div>
                          </td>
                          <td className="py-3.5 font-bold">
                            {s.plan?.planName || "Custom Package"}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${s.subscriptionStatus === "ACTIVE"
                                ? "bg-brand/15 text-brand"
                                : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {s.subscriptionStatus}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <div>Remaining: {s.remainingMessages?.toLocaleString()}</div>
                          </td>
                          <td className="py-3.5 font-bold">
                            {s.campaignUsed} run
                          </td>
                          <td className="py-3.5 font-mono text-[10px] text-muted-foreground">
                            {s.expiryDate
                              ? new Date(s.expiryDate).toLocaleDateString("en-IN")
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                    {subscriptions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground italic font-medium">
                          No active subscriptions registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === "PAYMENTS" && (
            <div className="space-y-6">
              {/* PENDING PAYMENTS SECTION */}
              <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-black text-xl text-emerald-deep flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-amber-500" /> Pending Payment Receipts
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cream text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Client Details</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/60">
                      {pendingPayments.map((p) => {
                        const sub = subscriptions.find((s) => s.id === p.clientSubscriptionId);
                        const clientObj = sub ? clients.find((c) => c.id === sub.clientId) : null;
                        const planName = sub?.plan?.planName || "Package #" + p.clientSubscriptionId;

                        return (
                          <tr key={p.id} className="text-xs sm:text-sm font-semibold text-emerald-deep hover:bg-cream/10 transition">
                            <td className="py-3.5 pl-2">
                              <div className="font-bold">{clientObj?.companyName || `Client #${sub?.clientId || ""}`}</div>
                            </td>
                            <td className="py-3.5 font-extrabold text-emerald-deep">
                              ₹{p.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 text-xs text-muted-foreground">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : "—"}
                            </td>
                            <td className="py-3.5 text-right flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenModerate(p.id, "APPROVED")}
                                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1 transition shadow-xs"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleOpenModerate(p.id, "REJECTED")}
                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-bold text-[10px] cursor-pointer flex items-center gap-1 transition shadow-xs"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {pendingPayments.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground italic font-medium p-4">
                            <Inbox className="h-6 w-6 text-muted-foreground/45 mx-auto mb-2" />
                            All clear! No pending payments awaiting review.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PAYMENT HISTORY SECTION */}
              <div className="rounded-[28px] bg-white p-6 shadow-float border border-emerald-100">
                <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Payment Receipts Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cream text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Client</th>
                        <th className="pb-3">Plan</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Method</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/60">
                      {payments.map((p) => {
                        const sub = subscriptions.find((s) => s.id === p.clientSubscriptionId);
                        const clientObj = sub ? clients.find((c) => c.id === sub.clientId) : null;
                        const planName = sub?.plan?.planName || "Package #" + p.clientSubscriptionId;

                        return (
                          <tr key={p.id} className="text-xs sm:text-sm font-semibold text-emerald-deep hover:bg-cream/10 transition">
                            <td className="py-3.5 pl-2">
                              <div className="font-bold">{clientObj?.companyName || `Client #${sub?.clientId || ""}`}</div>
                              <div className="text-[11px] text-muted-foreground">{clientObj?.ownerName || "—"}</div>
                            </td>
                            <td className="py-3.5">
                              <div className="text-[11px] font-bold">{planName}</div>
                            </td>
                            <td className="py-3.5 font-extrabold">
                              ₹{p.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 text-xs">
                              {p.paymentMethod}
                            </td>
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
                          </tr>
                        );
                      })}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground italic font-medium p-4">
                            No receipts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLAN FORM MODAL */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-emerald-deep">
              {editingPlan ? "Modify Service Plan" : "Create Service Plan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePlanSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Plan Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Starter Basic"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Plan Code</label>
                <select
                  value={planCode}
                  onChange={(e) => setPlanCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                >
                  {PLAN_CODES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Plan Type</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                >
                  <option value="DAILY">DAILY</option>
                  <option value="MONTHLY">MONTHLY</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Price (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 14999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Validity (Days)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 30"
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Message Limit</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10000"
                  value={messageLimit}
                  onChange={(e) => setMessageLimit(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Campaign Limit</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4"
                  value={campaignLimit}
                  onChange={(e) => setCampaignLimit(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-2 ml-1">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-emerald-200 text-brand focus:ring-brand"
              />
              <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-emerald-deep cursor-pointer select-none">
                Active & Visible for Subscription
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-cream">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm"
              >
                {editingPlan ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* PAYMENT MODERATION MODAL */}
      <Dialog open={isModOpen} onOpenChange={setIsModOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-emerald-deep">
              {modStatus === "APPROVED" ? "Approve Payment Receipt" : "Reject Payment Receipt"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModerateSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                Moderator Remarks / Feedback
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  modStatus === "APPROVED"
                    ? "e.g. Transaction verified. Subscription activated."
                    : "e.g. Payment receipt verification failed."
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-cream">
              <button
                type="button"
                onClick={() => setIsModOpen(false)}
                className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={approveRejectPaymentMutation.isPending}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm ${modStatus === "APPROVED" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                Confirm {modStatus === "APPROVED" ? "Approval" : "Rejection"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
