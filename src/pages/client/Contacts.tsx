import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Search, Users, Tag, Phone, Mail } from "lucide-react";

const SEGMENTS = [
  { name: "All Contacts", count: 8420, tone: "from-brand to-teal-deep" },
  { name: "Loyal Buyers", count: 1240, tone: "from-emerald-deep to-brand" },
  { name: "Cart Abandoned", count: 320, tone: "from-tangerine to-sunny" },
  { name: "New Leads", count: 512, tone: "from-sky-soft to-brand" },
];

const CONTACTS = [
  { name: "Ananya Iyer", phone: "+91 98450 12210", email: "ananya@example.com", tag: "Loyal", joined: "3 days ago" },
  { name: "Rahul Verma", phone: "+91 98220 88112", email: "rahul.v@example.com", tag: "New Lead", joined: "5 days ago" },
  { name: "Priya Sharma", phone: "+91 90000 55221", email: "priya.s@example.com", tag: "Loyal", joined: "1 week ago" },
  { name: "Vikram Singh", phone: "+91 98211 33221", email: "vikram@example.com", tag: "Cart Abandoned", joined: "2 weeks ago" },
  { name: "Meera Joshi", phone: "+91 90113 22110", email: "meera@example.com", tag: "New Lead", joined: "2 weeks ago" },
  { name: "Sameer Khan", phone: "+91 98332 11009", email: "sameer@example.com", tag: "Loyal", joined: "1 month ago" },
  { name: "Anita Desai", phone: "+91 99001 22334", email: "anita@example.com", tag: "New Lead", joined: "1 month ago" },
  { name: "Arjun Mehta", phone: "+91 90210 55521", email: "arjun@example.com", tag: "Loyal", joined: "2 months ago" },
];

export default function ClientContacts() {
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-white p-6 shadow-float flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Audience</div>
          <h1 className="font-display font-black text-3xl text-emerald-deep">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">View and search your WhatsApp audience segments and contacts.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {SEGMENTS.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-[24px] p-5 shadow-float bg-gradient-to-br ${s.tone} text-white`}>
            <Users className="h-5 w-5 opacity-80" />
            <div className="mt-4 font-display font-black text-3xl">{s.count.toLocaleString()}</div>
            <div className="text-xs opacity-80 font-semibold mt-1">{s.name}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[28px] bg-white shadow-float overflow-hidden">
        <div className="p-4 flex items-center gap-3 border-b border-cream">
          <div className="flex-1 flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or phone..." className="flex-1 bg-transparent outline-none text-sm" />
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
                <div className="h-4 bg-cream-dark/30 rounded-lg w-40 hidden lg:block" />
                <div className="h-6 bg-cream-dark/30 rounded-full w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-cream">
            {filtered.map((c, i) => (
              <div key={i} className="p-4 flex flex-wrap items-center gap-4 hover:bg-cream/40 transition">
                <div className="h-11 w-11 rounded-full bg-gradient-brand grid place-items-center text-white font-black text-sm shrink-0">
                  {c.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-[140px] flex-1">
                  <div className="font-bold text-emerald-deep">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Joined {c.joined}</div>
                </div>
                <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1.5 min-w-[140px]"><Phone className="h-3.5 w-3.5" /> {c.phone}</div>
                <div className="text-xs text-muted-foreground hidden lg:flex items-center gap-1.5 min-w-[160px]"><Mail className="h-3.5 w-3.5" /> {c.email}</div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cream text-emerald-deep"><Tag className="h-3 w-3" /> {c.tag}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">No contacts match your search.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
