import { motion } from "motion/react";
import { useState } from "react";
import { Search, Users, Tag, Phone, Calendar, Building, Download } from "lucide-react";
import { useClientProfile } from "@/hooks/client/useClientProfile";
import { useClientCustomerData, useClientCustomerDataStats } from "@/hooks/useCustomerData";

export default function ClientContacts() {
  const [q, setQ] = useState("");
  const { client, isLoading: isProfileLoading } = useClientProfile();
  const { customerData, isLoading: isDataLoading } = useClientCustomerData(client?.id);
  const { data: latestImportLog } = useClientCustomerDataStats(client?.id);

  const isLoading = isProfileLoading || isDataLoading;

  const filtered = customerData.filter(
    (c) =>
      c.customerName?.toLowerCase().includes(q.toLowerCase()) ||
      c.whatsappNumber?.includes(q) ||
      c.businessCategory?.toLowerCase().includes(q.toLowerCase())
  );

  const totalContacts = customerData.length;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Audience</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">Customer Data</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View customer records associated with your profile ID: <span className="font-mono font-bold text-emerald-deep">#{client?.id || "---"}</span>
          </p>
        </div>

        <a
          href="/CustomerNumberData.xlsx"
          download="CustomerNumberData.xlsx"
          className="px-4 py-2.5 rounded-2xl bg-cream hover:bg-emerald-50 border border-cream/50 text-emerald-deep font-bold transition text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Download className="h-4 w-4 text-brand" /> Download Sample Excel
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] p-5 shadow-float bg-gradient-to-br from-brand to-teal-deep text-white"
        >
          <Users className="h-5 w-5 opacity-80" />
          <div className="mt-4 font-display font-black text-3xl">{totalContacts.toLocaleString()}</div>
          <div className="text-xs opacity-80 font-semibold mt-1">Total Imported Customers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[24px] p-5 shadow-float bg-gradient-to-br from-emerald-deep to-brand text-white"
        >
          <Building className="h-5 w-5 opacity-80" />
          <div className="mt-4 font-display font-bold text-lg truncate">
            {client?.category ? client.category.replace(/_/g, " ") : "N/A"}
          </div>
          <div className="text-xs opacity-80 font-semibold mt-1">Registered Category</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[24px] p-5 shadow-float bg-gradient-to-br from-sky-soft to-brand text-white"
        >
          <Tag className="h-5 w-5 opacity-80" />
          <div className="mt-4 font-display font-black text-3xl">{filtered.length.toLocaleString()}</div>
          <div className="text-xs opacity-80 font-semibold mt-1">Matching Results</div>
        </motion.div>
      </div>

      {latestImportLog && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <div className="font-bold text-sm flex items-center justify-between">
            <span>Last Import Summary</span>
            {latestImportLog.importedAt && (
              <span className="text-[11px] font-normal text-emerald-700">
                {new Date(latestImportLog.importedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="text-xs flex flex-wrap gap-4 text-emerald-800 font-medium">
            <span>Total Rows Read: <strong>{latestImportLog.totalRowsRead}</strong></span>
            <span>Successfully Imported: <strong>{latestImportLog.totalImported}</strong></span>
            <span>Duplicates Skipped: <strong>{latestImportLog.skippedDuplicateRows}</strong></span>
            <span>Invalid Rows: <strong>{latestImportLog.skippedInvalidRows}</strong></span>
            {latestImportLog.skippedEmptyRows > 0 && <span>Empty Rows: <strong>{latestImportLog.skippedEmptyRows}</strong></span>}
          </div>
        </div>
      )}

      <div className="rounded-[28px] bg-white shadow-float overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-cream">
          <div className="flex-1 flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by customer name, whatsapp number, or category..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-cream animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-4 flex flex-wrap items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-cream-dark/30 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-dark/30 rounded-lg w-1/3" />
                  <div className="h-3 bg-cream-dark/30 rounded-lg w-1/4" />
                </div>
                <div className="h-4 bg-cream-dark/30 rounded-lg w-32 hidden md:block" />
                <div className="h-6 bg-cream-dark/30 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-cream">
            {filtered.map((c) => (
              <div key={c.id} className="p-4 flex flex-wrap items-center gap-4 hover:bg-cream/40 transition">
                <div className="h-11 w-11 rounded-full bg-gradient-brand grid place-items-center text-white font-black text-sm shrink-0">
                  {c.customerName
                    ? c.customerName
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                    : "C"}
                </div>
                <div className="min-w-[140px] flex-1">
                  <div className="font-bold text-emerald-deep">{c.customerName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Imported"}
                  </div>
                </div>
                <div className="text-xs font-mono font-medium text-emerald-deep flex items-center gap-1.5 min-w-[140px]">
                  <Phone className="h-3.5 w-3.5 text-brand" /> {c.whatsappNumber}
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cream text-emerald-deep">
                  <Tag className="h-3 w-3 text-brand" /> {c.businessCategory || client?.category || "CUSTOMER"}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                {totalContacts === 0
                  ? "No customer data found for your account yet."
                  : "No contacts match your search query."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
