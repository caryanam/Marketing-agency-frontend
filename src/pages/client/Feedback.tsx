import { useState, useEffect } from "react";
import { useClientProfile } from "@/hooks/client/useClientProfile";
import {
  useClientFeedbacks,
  useCreateFeedback,
  useUpdateFeedback,
  useDeleteFeedback,
  FeedbackItem,
} from "@/hooks/client/useClientFeedback";
import { MessageSquare, Star, Trash2, Edit, AlertCircle, Quote, Plus, X, Sparkles, CheckCircle2 } from "lucide-react";
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

const CATEGORIES = [
  { label: "Used Cars", value: "USED_CAR_DEALERS" },
  { label: "Car Showrooms", value: "CAR_SHOWROOMS" },
  { label: "Healthcare", value: "HOSPITALS" },
  { label: "Garages", value: "GARAGES" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Insurance", value: "INSURANCE_AGENTS" },
  { label: "Finance", value: "FINANCE_COMPANIES" },
  { label: "Education", value: "SCHOOLS_AND_COLLEGES" },
  { label: "Hospitality", value: "HOTELS_AND_RESTAURANTS" },
];

const REVERSE_CATEGORY_MAP: Record<string, string> = {
  USED_CAR_DEALERS: "Used Cars",
  CAR_SHOWROOMS: "Car Showrooms",
  HOSPITALS: "Healthcare",
  GARAGES: "Garages",
  REAL_ESTATE: "Real Estate",
  INSURANCE_AGENTS: "Insurance",
  FINANCE_COMPANIES: "Finance",
  SCHOOLS_AND_COLLEGES: "Education",
  HOTELS_AND_RESTAURANTS: "Hospitality",
};

export default function ClientFeedback() {
  const { client, isLoading: isClientLoading } = useClientProfile();
  const { feedbacks, isLoading: isFeedbacksLoading, refetch } = useClientFeedbacks();
  const createFeedbackMutation = useCreateFeedback();
  const updateFeedbackMutation = useUpdateFeedback();
  const deleteFeedbackMutation = useDeleteFeedback();

  const [isOpenFormModal, setIsOpenFormModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null);

  // Form states
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (client) {
      setClientName(client.ownerName || "");
      setCompanyName(client.companyName || "");
      setServiceName(client.category || "");
    }
  }, [client]);

  const handleOpenCreate = () => {
    setEditingFeedback(null);
    setClientName(client?.ownerName || "");
    setCompanyName(client?.companyName || "");
    setDesignation("");
    setServiceName(client?.category || "");
    setRating(5);
    setComment("");
    setIsOpenFormModal(true);
  };

  const handleOpenEdit = (fb: FeedbackItem) => {
    setEditingFeedback(fb);
    setClientName(fb.clientName);
    setCompanyName(fb.companyName);
    setDesignation(fb.designation || "");
    setServiceName(fb.serviceName);
    setRating(fb.rating);
    setComment(fb.comment);
    setIsOpenFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      clientName: clientName.trim(),
      companyName: companyName.trim(),
      designation: designation.trim(),
      serviceName,
      rating,
      comment: comment.trim(),
    };

    if (editingFeedback) {
      await updateFeedbackMutation.mutateAsync({
        feedbackId: editingFeedback.id,
        payload,
      });
    } else {
      await createFeedbackMutation.mutateAsync(payload);
    }
    setIsOpenFormModal(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteFeedbackMutation.mutateAsync(id);
    }
  };

  const isLoading = isClientLoading || isFeedbacksLoading;

  return (
    <div className="space-y-6 font-sans relative overflow-hidden">
      <Blob className="absolute -left-20 top-20 w-96 h-96 text-brand/5 pointer-events-none" />
      <Blob className="absolute -right-20 bottom-10 w-96 h-96 text-sunny/10 pointer-events-none" />

      {/* Header card */}
      <div className="rounded-[36px] bg-gradient-brand p-8 text-white relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 text-white text-[10px] font-extrabold uppercase mb-3 backdrop-blur-xs">
              <Sparkles className="h-3 w-3 text-sunny fill-current animate-pulse" />
              <span>Share Your Success</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-none">
              Client Reviews & Feedback
            </h1>
            <p className="text-sm text-white/80 mt-2 max-w-xl font-medium">
              We value your feedback! Help us improve our services and share your Caryanam experience. Approved testimonials will appear on our homepage.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-cream text-emerald-deep font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4.5 w-4.5 text-brand" strokeWidth={3} /> Submit Testimonial
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          <h2 className="font-display font-black text-2xl text-emerald-deep flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-brand" /> My Feedback Submissions
          </h2>

          {feedbacks.length === 0 ? (
            <div className="rounded-[28px] border border-emerald-100 bg-white p-12 text-center shadow-float">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-cream grid place-items-center text-brand mb-4">
                <Quote className="h-8 w-8 text-brand" />
              </div>
              <h3 className="font-display font-black text-lg text-emerald-deep">No reviews submitted yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto font-medium">
                You haven't shared a testimonial yet. Help other Indian brands learn about Caryanam!
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition cursor-pointer"
              >
                Create Testimonial
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-[28px] border border-emerald-100/80 bg-white p-6 shadow-float flex flex-col justify-between hover:border-brand/40 transition-colors duration-300"
                >
                  <div>
                    {/* Header: Rating & Status */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex gap-0.5 text-sunny">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4.5 w-4.5 ${i < fb.rating ? "fill-current" : "text-emerald-100"}`}
                          />
                        ))}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs ${
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

                    {/* Review text */}
                    <p className="text-emerald-deep/90 text-sm sm:text-base italic leading-relaxed font-medium mb-6">
                      "{fb.comment}"
                    </p>
                  </div>

                  {/* Footer: User and action buttons */}
                  <div className="pt-4 border-t border-emerald-50 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-display font-black text-emerald-deep text-sm sm:text-base capitalize">
                        {fb.clientName}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold">
                        {fb.designation ? `${fb.designation} · ` : ""}
                        {fb.companyName}
                      </div>
                      <div className="text-[10px] font-extrabold uppercase text-brand mt-1">
                        {REVERSE_CATEGORY_MAP[fb.serviceName] || fb.serviceName}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(fb)}
                        className="p-2.5 rounded-xl bg-cream text-emerald-deep hover:bg-emerald-100/60 transition cursor-pointer"
                        title="Edit Feedback"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fb.id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100/60 transition cursor-pointer"
                        title="Delete Feedback"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FORM MODAL */}
      <AnimatePresence>
        {isOpenFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-emerald-100 relative overflow-hidden"
            >
              <button
                onClick={() => setIsOpenFormModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-brand/10 text-brand grid place-items-center">
                  <Quote className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-xl text-emerald-deep">
                  {editingFeedback ? "Edit Testimonial" : "Submit Feedback"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 scrollbar-none">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-xs font-semibold text-emerald-deep"
                      placeholder="E.g. Rohan Malhotra"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-xs font-semibold text-emerald-deep"
                      placeholder="E.g. AutoZone Motors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-xs font-semibold text-emerald-deep"
                      placeholder="E.g. Founder, CEO"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                      Business Category
                    </label>
                    <select
                      required
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-xs font-semibold text-emerald-deep"
                    >
                      <option value="" disabled>Select Category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating Input */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">
                    Overall Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-sunny hover:scale-110 active:scale-95 transition cursor-pointer"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            val <= (hoverRating ?? rating) ? "fill-current" : "text-emerald-100"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-deep">
                      Your Testimonial / Comment
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {comment.length}/2000
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={2000}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-xs font-semibold text-emerald-deep resize-none leading-relaxed"
                    placeholder="Describe your experience working with Caryanam, the metrics you achieved, or any helpful feedback..."
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-50">
                  <button
                    type="button"
                    onClick={() => setIsOpenFormModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-cream text-emerald-deep font-bold transition text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createFeedbackMutation.isPending || updateFeedbackMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer disabled:opacity-50"
                  >
                    {createFeedbackMutation.isPending || updateFeedbackMutation.isPending ? (
                      <div className="h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editingFeedback ? (
                      "Update Testimonial"
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
