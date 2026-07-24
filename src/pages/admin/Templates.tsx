import { motion } from "motion/react";
import { LayoutTemplate, LayoutGrid, List, Plus, Sparkles, Image as ImageIcon, CheckCircle2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useWhatsAppTemplates, useCreateWhatsAppTemplate } from "@/hooks/useWhatsAppTemplates";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WhatsAppTemplate } from "@/lib/templates-data";

export default function AdminTemplates() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isOpen, setIsOpen] = useState(false);

  const { data: templates = [], isLoading } = useWhatsAppTemplates();
  const createTemplateMutation = useCreateWhatsAppTemplate();
  const imageUploadMutation = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"MARKETING" | "UTILITY">("MARKETING");
  const [headerType, setHeaderType] = useState<"IMAGE" | "TEXT">("IMAGE");
  const [defaultHeaderUrl, setDefaultHeaderUrl] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");
  const [variable1Label, setVariable1Label] = useState("Customer Name");
  const [variable2Label, setVariable2Label] = useState("Offer Details");
  const [variable3Label, setVariable3Label] = useState("Validity Date");

  const handleHeaderImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await imageUploadMutation.mutateAsync(file);
      setDefaultHeaderUrl(dataUrl);
    } catch (err) {
      // Error handled by hook toast
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !bodyTemplate.trim()) return;

    const variables = [
      { name: "var1", label: variable1Label || "Customer Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Customer" },
      { name: "var2", label: variable2Label || "Offer Details", placeholder: "e.g. Special Discount Offer" },
    ];
    if (variable3Label.trim()) {
      variables.push({ name: "var3", label: variable3Label, placeholder: "e.g. Validity Date" });
    }

    try {
      await createTemplateMutation.mutateAsync({
        name: name.trim(),
        category,
        headerType,
        bodyTemplate: bodyTemplate.trim(),
        defaultHeaderUrl: headerType === "IMAGE" ? defaultHeaderUrl.trim() : undefined,
        variables,
      });

      setIsOpen(false);
      setName("");
      setBodyTemplate("");
      setDefaultHeaderUrl("");
    } catch (err) {
      // Error handled by mutation toast
    }
  };

  const renderPreview = (t: WhatsAppTemplate) => {
    let text = t.bodyTemplate || "";
    t.variables?.forEach((v, index) => {
      const val = v.defaultValue || `[${v.label}]`;
      text = text.replace(new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"), val);
    });
    return text;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[32px] bg-gradient-brand text-white p-8 shadow-glow relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-sunny/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Meta Approved Templates</div>
            <h1 className="mt-2 font-display font-black text-3xl md:text-4xl">WhatsApp Templates</h1>
            <p className="mt-2 text-white/80 max-w-lg font-medium">Reusable, high-converting WhatsApp Cloud API message templates across every category.</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 rounded-full bg-gradient-sun text-emerald-deep font-black shadow-glow hover:shadow-lg transition cursor-pointer flex items-center gap-1.5 border-transparent">
                <Plus className="h-5 w-5" /> Create Template
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl rounded-3xl p-6 border-white/60 bg-white/95 backdrop-blur shadow-glow z-50">
              <DialogHeader>
                <DialogTitle className="font-display font-black text-2xl text-emerald-deep flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-brand" /> Add New WhatsApp Template (Admin Only)
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTemplate} className="space-y-4 mt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Template Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diwali Mega Festival Offer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="MARKETING">MARKETING</option>
                      <option value="UTILITY">UTILITY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Header Type</label>
                    <select
                      value={headerType}
                      onChange={(e) => setHeaderType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium appearance-none cursor-pointer"
                    >
                      <option value="IMAGE">📷 Image Header</option>
                      <option value="TEXT">📝 Text Only</option>
                    </select>
                  </div>
                </div>

                {headerType === "IMAGE" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep ml-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3.5 w-3.5 text-brand" /> Header Image (.PNG, .JPEG, .JPG — Max 20MB)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">Formats: PNG, JPG, JPEG (≤ 20MB)</span>
                    </label>

                    <div className="flex gap-2 items-center">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-... or click browse"
                        value={defaultHeaderUrl}
                        onChange={(e) => setDefaultHeaderUrl(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".png,.jpeg,.jpg"
                        onChange={handleHeaderImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploadMutation.isPending}
                        className="px-4 py-3 rounded-2xl bg-brand text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="h-4 w-4" />
                        {imageUploadMutation.isPending ? "Uploading..." : "Upload 20MB Image"}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-1.5 ml-1">Body Template Text (Use {"{{1}}"}, {"{{2}}"} for placeholders)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Hello {{1}}! Enjoy {{2}} off on your next purchase till {{3}}."
                    value={bodyTemplate}
                    onChange={(e) => setBodyTemplate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                  />
                </div>

                <div className="space-y-2 p-3 rounded-2xl bg-cream/50 border border-cream">
                  <span className="text-[11px] font-bold uppercase text-emerald-deep">Variable Placeholders Labels</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="{{1}} Label"
                      value={variable1Label}
                      onChange={(e) => setVariable1Label(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white text-xs outline-none border border-cream"
                    />
                    <input
                      type="text"
                      placeholder="{{2}} Label"
                      value={variable2Label}
                      onChange={(e) => setVariable2Label(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white text-xs outline-none border border-cream"
                    />
                    <input
                      type="text"
                      placeholder="{{3}} Label (Optional)"
                      value={variable3Label}
                      onChange={(e) => setVariable3Label(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white text-xs outline-none border border-cream"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-cream">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTemplateMutation.isPending}
                    className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer text-sm disabled:opacity-50"
                  >
                    {createTemplateMutation.isPending ? "Creating..." : "Save Template"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Toggle Bar */}
      <div className="flex items-center justify-between bg-white/40 backdrop-blur p-4 rounded-3xl border border-white/50">
        <div className="text-sm font-bold text-emerald-deep flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-brand" />
          <span>Showing {templates.length} Approved WhatsApp Templates</span>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white p-1 rounded-2xl shadow-float border border-cream">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "grid" ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-cream"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition cursor-pointer ${
              viewMode === "list" ? "bg-gradient-brand text-white shadow-glow" : "text-muted-foreground hover:bg-cream"
            }`}
            title="List (Row) View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates List/Grid Container */}
      {isLoading ? (
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse" : "flex flex-col gap-6 animate-pulse"}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-[28px] bg-white p-6 shadow-float border border-cream space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-cream-dark/30 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-cream-dark/30 rounded-lg w-1/2" />
                  <div className="h-3 bg-cream-dark/30 rounded-lg w-1/3" />
                </div>
              </div>
              <div className="h-16 bg-cream-dark/15 rounded-2xl w-full" />
              <div className="h-10 bg-cream-dark/30 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
          {templates.map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`rounded-[28px] bg-white p-6 shadow-float hover:shadow-glow transition flex ${
                viewMode === "grid" 
                  ? "flex-col gap-4" 
                  : "flex-col lg:flex-row lg:items-stretch gap-6"
              }`}
            >
              {/* Header / Info Section */}
              <div className={`flex flex-col justify-between ${viewMode === "grid" ? "w-full" : "w-full lg:w-64 lg:border-r lg:border-cream lg:pr-6 shrink-0"}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-white grid place-items-center font-bold">
                      #{t.id}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-brand/15 text-brand text-[10px] font-bold uppercase">
                      {t.category}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-display font-black text-lg text-emerald-deep leading-snug">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-semibold flex items-center gap-1">
                      {t.headerType === "IMAGE" ? <ImageIcon className="h-3 w-3 text-brand" /> : <LayoutTemplate className="h-3 w-3 text-brand" />}
                      {t.headerType === "IMAGE" ? "Image Header" : "Text Only"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cream lg:border-t-0 lg:pt-0">
                  <span className="text-xs text-muted-foreground font-semibold">
                    Variables: <span className="font-black text-emerald-deep">{t.variables?.length || 0} Dynamic Placeholders</span>
                  </span>
                </div>
              </div>

              {/* Contents Section (Raw Code & Preview) */}
              <div className={`flex-1 flex ${viewMode === "grid" ? "flex-col gap-4" : "flex-col xl:flex-row gap-6"}`}>
                {/* Raw Template Code */}
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Raw Template Pattern</span>
                  <div className="flex-1 p-4 rounded-2xl bg-cream text-xs text-emerald-deep font-mono leading-relaxed border border-cream/50 break-words h-full min-h-[80px]">
                    {t.bodyTemplate}
                  </div>
                </div>

                {/* WhatsApp Message Preview */}
                <div className={`${viewMode === "grid" ? "w-full" : "w-full xl:w-80 shrink-0"} flex flex-col`}>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">WhatsApp Live Message Preview</span>
                  <div className="flex-1 p-4 rounded-2xl bg-[#efeae2] relative border border-[#e0dcd5] shadow-inner flex flex-col justify-center min-h-[160px]">
                    <div className="bg-[#d9fdd3] text-zinc-900 p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed w-full relative shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
                      {t.headerType === "IMAGE" && t.defaultHeaderUrl && (
                        <img 
                          src={t.defaultHeaderUrl} 
                          alt="Template Header Media" 
                          className="w-full h-24 object-cover rounded-xl mb-2.5 shadow-sm border border-black/5"
                        />
                      )}
                      <div className="break-words font-medium text-slate-800 whitespace-pre-wrap">{renderPreview(t)}</div>
                      <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-zinc-500/80 font-semibold select-none">
                        <span>12:00 PM</span>
                        <svg viewBox="0 0 16 15" width="13" height="13" className="fill-[#53bdeb]">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033L5.438 7.164a.365.365 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.702-8.358a.364.364 0 0 0-.06-.508zM6.425 10.354a.321.321 0 0 1-.48.02L2.73 7.214a.365.365 0 0 0-.513.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l1.36-1.696a.364.364 0 0 0-.06-.508l-.42-.326z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
