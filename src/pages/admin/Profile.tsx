import { Mail, Shield, UserCheck, Key, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { Blob } from "@/components/site/Decor";

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    id: "1",
    name: "Administrator",
    email: "admin@caryanam.com",
    role: "ADMIN",
    token: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adminData");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const item = parsed[parsed.length - 1];
          let derivedName = "Administrator";
          if (item.name || item.ownerName) {
            derivedName = item.name || item.ownerName;
          } else if (item.email) {
            const prefix = item.email.split("@")[0];
            derivedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          }

          setAdminData({
            id: item.id || item.decoded?.sub || "1",
            name: derivedName,
            email: item.email || "admin@caryanam.com",
            role: (item.role || item.decoded?.role || "ADMIN").toUpperCase(),
            token: item.token || "",
          });
        }
      }
    } catch (e) {
      // Ignore error
    }
  }, []);

  const initials = adminData.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 font-sans">
      {/* Cover Header */}
      <div className="rounded-[36px] h-48 bg-gradient-brand relative overflow-hidden shadow-glow">
        <Blob className="absolute -right-10 -top-10 w-72 h-72 text-white/20" />
        <Blob className="absolute -left-10 -bottom-16 w-60 h-60 text-emerald-deep/25" />
      </div>

      {/* Profile Info Header */}
      <div className="-mt-24 relative">
        <div className="rounded-[32px] bg-white p-6 md:p-8 shadow-glow flex flex-wrap items-end gap-6">
          <div className="h-32 w-32 rounded-3xl bg-gradient-sun text-emerald-deep border-4 border-white shadow-glow grid place-items-center font-display font-black text-4xl -mt-16">
            {initials || "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl md:text-4xl text-emerald-deep capitalize">{adminData.name}</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider shrink-0 border border-emerald-200">
                {adminData.role}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4 text-brand" /> {adminData.email}</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-brand" /> Super Admin Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-[28px] bg-white p-6 md:p-8 shadow-float">
            <h3 className="font-display font-black text-xl text-emerald-deep mb-6">Administrator Account Details</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { l: "Administrator Name", v: adminData.name, i: UserCheck },
                { l: "Admin Email", v: adminData.email, i: Mail },
                { l: "Assigned Role", v: adminData.role, i: Shield },

              ].map((f) => (
                <div key={f.l} className="rounded-2xl bg-cream p-5 border border-emerald-100/60">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{f.l}</div>
                  <div className="mt-1.5 font-black text-emerald-deep text-base flex items-center gap-2.5">
                    <f.i className="h-4 w-4 text-brand shrink-0" />
                    <span>{f.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System & Access Status Sidebar Card */}
        <div className="space-y-5">
          <div className="rounded-[28px] bg-emerald-deep text-white p-6 shadow-float relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center text-sunny">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-black text-white text-base">Portal Status</h4>
                <p className="text-xs text-white/60">Active Administrator Session</p>
              </div>
            </div>
            <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Session Status:</span>
                <span className="font-bold text-emerald-300">● Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Security Level:</span>
                <span className="font-bold text-sunny">Highest (Full Rights)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Environment:</span>
                <span className="font-bold text-white">Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
