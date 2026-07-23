import { motion } from "motion/react";
import { useState, useRef } from "react";
import { Search, Users, Tag, Phone, Calendar, Building, Download, Upload } from "lucide-react";
import { useClientProfile } from "@/hooks/client/useClientProfile";
import { useClientCustomerData, useClientCustomerDataStats } from "@/hooks/useCustomerData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ClientContacts() {
  const [q, setQ] = useState("");
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { client, isLoading: isProfileLoading } = useClientProfile();
  const { customerData, isLoading: isDataLoading, importExcel, isImporting: isExcelImporting } = useClientCustomerData(client?.id);
  const { data: latestImportLog } = useClientCustomerDataStats(client?.id);

  const handleExcelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile || !client?.id) return;

    try {
      await importExcel({
        file: excelFile,
        clientId: client.id,
        businessCategory: client.category,
      });
      setIsCsvOpen(false);
      setExcelFile(null);
    } catch (err) {
      // Error handled by hook toast
    }
  };

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

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/CustomerNumberData.xlsx"
            download="CustomerNumberData.xlsx"
            className="px-4 py-2.5 rounded-2xl bg-cream hover:bg-emerald-50 border border-cream/50 text-emerald-deep font-bold transition text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4 text-brand" /> Download Sample Excel
          </a>

          <Dialog open={isCsvOpen} onOpenChange={setIsCsvOpen}>
            <DialogTrigger asChild>
              <button className="px-5 py-2.5 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="h-4 w-4" /> Import Excel Sheet
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
              <DialogHeader>
                <DialogTitle className="font-display font-black text-2xl text-emerald-deep">Import Customer Excel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleExcelSubmit} className="space-y-5 mt-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand/30 hover:border-brand rounded-2xl p-6 text-center cursor-pointer bg-cream/40 transition flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="h-8 w-8 text-brand" />
                  <span className="text-sm font-semibold text-emerald-deep">
                    {excelFile ? excelFile.name : "Click to select Excel sheet (.xlsx, .xls)"}
                  </span>
                  <span className="text-xs text-muted-foreground">Formats: .xlsx or .xls</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls"
                    onChange={e => setExcelFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href="/CustomerNumberData.xlsx"
                    download="CustomerNumberData.xlsx"
                    className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" /> Download Sample Format
                  </a>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCsvOpen(false);
                      setExcelFile(null);
                    }}
                    className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!excelFile || isExcelImporting}
                    className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isExcelImporting ? "Importing..." : "Upload & Import"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
