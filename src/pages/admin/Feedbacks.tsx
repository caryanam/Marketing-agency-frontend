import { useState } from "react";
import {
  useAdminFeedbacks,
  useApproveRejectFeedback,
  useAdminDeleteFeedback,
} from "@/hooks/admin/useAdminFeedback";
import { FeedbackItem } from "@/hooks/client/useClientFeedback";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  MessageSquare,
  Sparkles,
  Inbox,
  AlertCircle,
  Award,
  Layers,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Blob } from "@/components/site/Decor";

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

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Car Dealers",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Hospitals",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance Agents",
  FINANCE_COMPANIES: "Finance Companies",
  SCHOOLS_AND_COLLEGES: "Schools And Colleges",
  HOTELS_AND_RESTAURANTS: "Hotels And Restaurants",
};

export default function AdminFeedbacks() {
  const { feedbacks, isLoading, refetch } = useAdminFeedbacks();
  const approveRejectMutation = useApproveRejectFeedback();
  const deleteMutation = useAdminDeleteFeedback();

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = async (id: number) => {
    await approveRejectMutation.mutateAsync({ feedbackId: id, status: "APPROVED" });
  };

  const handleReject = async (id: number) => {
    await approveRejectMutation.mutateAsync({ feedbackId: id, status: "REJECTED" });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to permanently delete this feedback entry?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesTab = activeTab === "ALL" || fb.status === activeTab;
    const matchesSearch =
      fb.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fb.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.comment && fb.comment.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Calculate stats
  const totalCount = feedbacks.length;
  const pendingCount = feedbacks.filter((fb) => fb.status === "PENDING").length;
  const approvedCount = feedbacks.filter((fb) => fb.status === "APPROVED").length;
  const rejectedCount = feedbacks.filter((fb) => fb.status === "REJECTED").length;

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 font-sans relative overflow-hidden">
      <Blob className="absolute -left-20 top-20 w-96 h-96 text-brand/5 pointer-events-none" />
      <Blob className="absolute -right-20 bottom-10 w-96 h-96 text-sunny/10 pointer-events-none" />

      {/* Header */}
      <div className="rounded-[36px] bg-gradient-brand p-8 text-white relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 text-white text-[10px] font-extrabold uppercase mb-3 backdrop-blur-xs">
            <Sparkles className="h-3 w-3 text-sunny fill-current" />
            <span>Admin Review Center</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none">
            Testimonial & Feedback Moderation
          </h1>
          <p className="text-sm text-white/80 mt-2 max-w-xl font-medium">
            Approve, reject, or manage testimonials submitted by Caryanam clients. Approved testimonials will immediately display on the landing page.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse relative z-10">
          {/* Stats Summary Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl bg-white p-5 border border-emerald-100/50 shadow-float space-y-3">
                <div className="h-3.5 bg-cream-dark/30 rounded-lg w-2/3" />
                <div className="h-8 bg-cream-dark/30 rounded-lg w-1/2" />
              </div>
            ))}
          </div>

          {/* Filter/Search Bar Skeleton */}
          <div className="rounded-[28px] bg-white border border-emerald-100/50 p-4 shadow-float flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 w-full sm:w-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 bg-cream rounded-xl w-24" />
              ))}
            </div>
            <div className="h-9 bg-cream rounded-2xl w-full sm:max-w-xs" />
          </div>

          {/* Cards Skeleton Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { label: "Total Reviews", value: totalCount, desc: "All submissions", icon: MessageSquare, color: "text-brand bg-emerald-50" },
              { label: "Pending Approval", value: pendingCount, desc: "Awaiting moderation", icon: Inbox, color: "text-amber-500 bg-amber-50" },
              { label: "Approved & Live", value: approvedCount, desc: "On landing page", icon: CheckCircle, color: "text-emerald-deep bg-emerald-50" },
              { label: "Average Rating", value: `${averageRating} ★`, desc: "Out of 5.0 rating", icon: Star, color: "text-sunny bg-amber-50" },
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl bg-white p-5 border border-emerald-100 shadow-float">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="block text-xs text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</span>
                    <span className="block text-2xl font-display font-black text-emerald-deep mt-1">{stat.value}</span>
                  </div>
                  <div className={`h-10 w-10 rounded-2xl ${stat.color} grid place-items-center shrink-0`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <span className="block text-[10px] text-muted-foreground mt-2 font-semibold">{stat.desc}</span>
              </div>
            ))}
          </div>

          {/* Filter / Search Bar */}
          <div className="rounded-[28px] bg-white border border-emerald-100 p-4 shadow-float flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-cream p-1 rounded-2xl w-full sm:w-auto">
              {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((tab) => {
                const label = tab === "ALL" ? "All Reviews" : tab;
                const count = tab === "PENDING" ? pendingCount : tab === "APPROVED" ? approvedCount : tab === "REJECTED" ? rejectedCount : totalCount;
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? "bg-gradient-brand text-white shadow-md"
                        : "text-emerald-deep/70 hover:bg-emerald-100/30 hover:text-emerald-deep"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                        active ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-deep"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5 w-full sm:max-w-xs border border-emerald-100/20">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                placeholder="Search by client, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-xs font-semibold text-emerald-deep w-full"
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-4 relative z-10">
            {filteredFeedbacks.length === 0 ? (
              <div className="rounded-[28px] border border-emerald-100 bg-white p-12 text-center shadow-float">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cream grid place-items-center text-muted-foreground mb-3">
                  <AlertCircle className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="font-display font-black text-lg text-emerald-deep">No reviews found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto font-medium">
                  We couldn't find any feedback entries matching the selected filter or search query.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredFeedbacks.map((fb) => (
                    <motion.div
                      key={fb.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="rounded-[28px] border border-emerald-100 bg-white p-6 shadow-float flex flex-col justify-between hover:border-emerald-200 transition-colors"
                    >
                      <div>
                        {/* Header: Name/Company, Status & Rating */}
                        <div className="flex justify-between items-start gap-4 mb-3.5">
                          <div>
                            <div className="font-display font-black text-emerald-deep text-base sm:text-lg capitalize flex items-center gap-2">
                              {fb.clientName}
                              {fb.status === "APPROVED" && (
                                <span className="text-emerald-deep" title="Approved & Live">
                                  <Award className="h-4.5 w-4.5 text-brand fill-current" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground font-semibold">
                              {fb.designation ? `${fb.designation} · ` : ""}
                              {fb.companyName}
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 shadow-xs ${
                              fb.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-deep"
                                : fb.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {fb.status}
                          </span>
                        </div>

                        {/* Info tags: Category & Date */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cream text-brand text-[10px] font-black uppercase border border-emerald-100/50">
                            <Layers className="h-3 w-3" />
                            <span>{REVERSE_CATEGORY_MAP[fb.serviceName] || fb.serviceName}</span>
                          </span>
                          {fb.createdAt && (
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              Submitted: {new Date(fb.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>

                        {/* Stars */}
                        <div className="flex gap-0.5 text-sunny mb-3">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-4 w-4 ${idx < fb.rating ? "fill-current" : "text-emerald-100"}`}
                            />
                          ))}
                        </div>

                        {/* Review text */}
                        <p className="text-emerald-deep/90 text-sm sm:text-base italic leading-relaxed font-medium mb-6 bg-cream/35 p-3 rounded-2xl border border-emerald-100/20">
                          "{fb.comment}"
                        </p>
                      </div>

                      {/* Admin Actions */}
                      <div className="pt-4 border-t border-emerald-50 flex items-center justify-between gap-3">
                        <div className="text-[10px] text-muted-foreground font-bold">
                          Client ID: {fb.clientId}
                        </div>

                        <div className="flex gap-2">
                          {fb.status !== "APPROVED" && (
                            <button
                              onClick={() => handleApprove(fb.id)}
                              disabled={approveRejectMutation.isPending}
                              className="px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-deep font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-deep" /> Approve
                            </button>
                          )}

                          {fb.status !== "REJECTED" && (
                            <button
                              onClick={() => handleReject(fb.id)}
                              disabled={approveRejectMutation.isPending}
                              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 text-amber-600" /> Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(fb.id)}
                            disabled={deleteMutation.isPending}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-red-600 transition cursor-pointer disabled:opacity-50"
                            title="Delete Permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
