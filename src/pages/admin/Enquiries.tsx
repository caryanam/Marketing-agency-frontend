import { motion } from "motion/react";
import { Mail, Phone, RefreshCw, Inbox, MessageSquareText } from "lucide-react";
import { useAdminEnquiries } from "@/hooks/admin/useAdminEnquiries";

export default function AdminEnquiries() {
  const { enquiries, isLoading, isError, error, refetch } = useAdminEnquiries();

  const handleWhatsAppReply = (phone: string, name: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(`Hi ${name}, thank you for reaching out to Caryanam! How can we assist your business today?`);
    window.open(`https://wa.me/${fullPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-gradient-sun p-8 shadow-glow relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-16 -top-10 w-64 h-64 rounded-full bg-white/40 blur-2xl" />
        <div className="relative z-10">
          <div className="text-emerald-deep/70 text-xs uppercase tracking-widest font-bold">Inbox</div>
          <h1 className="mt-2 font-display font-black text-3xl md:text-4xl text-emerald-deep">Contact Enquiries</h1>
          <p className="mt-2 text-emerald-deep/80 max-w-lg text-sm">Every lead from your website, in one warm workspace.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="relative z-10 self-start md:self-auto px-5 py-3 rounded-full bg-white/90 text-emerald-deep font-bold text-xs shadow-float hover:bg-white transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 text-brand ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[24px] bg-white p-6 shadow-float animate-pulse flex gap-6 items-start">
              <div className="h-14 w-14 rounded-2xl bg-cream-dark/30 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-cream-dark/30 rounded-md" />
                <div className="h-4 w-full max-w-md bg-cream-dark/30 rounded-md" />
                <div className="h-4 w-64 bg-cream-dark/30 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {isError && (
        <div className="p-6 rounded-[24px] bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div>Failed to load enquiries from server.</div>
            <div className="text-xs font-normal text-red-600 mt-0.5">{(error as any)?.message}</div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && enquiries.length === 0 && (
        <div className="rounded-[32px] bg-white p-12 text-center shadow-float border border-emerald-100/60 max-w-5xl mx-auto space-y-4">
          <div className="h-16 w-16 rounded-full bg-cream text-emerald-deep grid place-items-center mx-auto">
            <Inbox className="h-8 w-8 text-brand" />
          </div>
          <h3 className="font-display font-black text-xl text-emerald-deep">No Enquiries Found</h3>
          <p className="text-xs text-muted-foreground">When visitors submit enquiry forms on the contact page, they will show up here.</p>
        </div>
      )}

      {/* Live Enquiries List */}
      {!isLoading && !isError && enquiries.length > 0 && (
        <div className="grid gap-4">
          {enquiries.map((e, i) => {
            const initials = e.name
              ? e.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
              : "EQ";

            const formattedDate = e.createdAt
              ? new Date(e.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              : "Recent";

            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-[24px] bg-white p-6 shadow-float hover:shadow-glow transition flex flex-wrap gap-6 items-start border border-emerald-100/40"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-brand text-white grid place-items-center font-black text-lg shadow-glow shrink-0">
                  {initials}
                </div>

                <div className="flex-1 min-w-[240px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-display font-black text-lg text-emerald-deep capitalize">{e.name}</div>

                  </div>

                  <p className="mt-2 capitalize text-sm text-emerald-deep/80 leading-relaxed font-medium bg-cream/60 p-3 rounded-2xl border border-emerald-100/40">
                    "{e.goals || "No description provided."}"
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground font-semibold">
                    <a href={`tel:${e.phoneNumber}`} className="inline-flex items-center gap-1.5 hover:text-brand transition">
                      <Phone className="h-3.5 w-3.5 text-brand" /> {e.phoneNumber}
                    </a>
                    <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-brand transition">
                      <Mail className="h-3.5 w-3.5 text-brand" /> {e.email}
                    </a>
                  </div>
                </div>


              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
