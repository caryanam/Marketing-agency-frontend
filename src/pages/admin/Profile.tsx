import { Mail, Phone, Award, Edit3, Check, X } from "lucide-react";
import { useState } from "react";
import { Blob } from "@/components/site/Decor";
import { motion, AnimatePresence } from "motion/react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Aarav Menon",
    email: "aarav@caryanam.in",
    phone: "+91 98765 43210",
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[36px] h-48 bg-gradient-brand relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
      </div>
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6">
          <img src="https://i.pravatar.cc/200?img=15" alt="" className="h-32 w-32 rounded-3xl border-4 border-white shadow-glow -mt-16 object-cover" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-black text-3xl md:text-4xl text-emerald-deep">{profileData.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-brand" /> {profileData.email}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-brand" /> {profileData.phone}</span>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow inline-flex items-center gap-2 hover:shadow-lg transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] bg-white p-6 md:p-8 shadow-float border border-white/60"
              >
                <h3 className="font-display font-black text-xl text-emerald-deep mb-6">Edit Profile Information</h3>
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-deep mb-2 ml-1">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-cream border border-transparent focus:border-brand focus:bg-white outline-none transition text-sm text-foreground font-medium"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-cream">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-3 rounded-2xl bg-cream text-emerald-deep hover:bg-cream/70 font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-2xl bg-gradient-brand text-white font-bold shadow-glow hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-[28px] bg-white p-6 md:p-8 shadow-float"
              >
                <h3 className="font-display font-black text-xl text-emerald-deep mb-4">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { l: "Full Name", v: profileData.name },
                    { l: "Email", v: profileData.email, i: Mail },
                    { l: "Phone Number", v: profileData.phone, i: Phone },
                  ].map((f) => (
                    <div key={f.l} className="rounded-2xl bg-cream p-4">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{f.l}</div>
                      <div className="mt-1 font-black text-emerald-deep flex items-center gap-2">
                        {f.i && <f.i className="h-4 w-4 text-brand" />}
                        {f.v}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] bg-emerald-deep text-white p-6 shadow-float">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">Certifications</div>
            <div className="mt-3 space-y-2">
              {["Meta WhatsApp API Partner", "Meta Business Verified", "ISO 27001 Info Security"].map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-sunny" /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
