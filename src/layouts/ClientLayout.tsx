import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CLIENTS } from "@/lib/admin-data";
import {
  LayoutDashboard, Send, Users, LayoutTemplate, BarChart3, User, LogOut, MessageCircle, Search, Bell, CreditCard, MailOpen, Menu, X
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ClientLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState("Client");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Growth");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Campaign Completed", description: "Your 'Diwali Blast 2026' campaign has successfully reached all recipients.", time: "15m ago", read: false },
    { id: 2, title: "Template Approved", description: "Meta approved your 'Welcome Discount Code' template.", time: "4h ago", read: false },
    { id: 3, title: "Weekly Report Ready", description: "Your weekly performance summary report is now ready for download.", time: "1d ago", read: true },
  ]);

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("role");
    if (!auth) {
      navigate("/login");
      return;
    }
    if (role === "admin") {
      navigate("/admin");
      return;
    }
    const storedEmail = localStorage.getItem("userEmail") || "";
    setEmail(storedEmail);

    let clientsList = CLIENTS;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("clients");
      if (stored) {
        try {
          clientsList = JSON.parse(stored);
        } catch (e) {}
      }
    }
    const found = clientsList.find(c => c.email.toLowerCase() === storedEmail.toLowerCase());
    if (found) {
      setName(found.owner);
      setPlan(found.plan || "Growth");
    } else {
      setName(localStorage.getItem("userName") || "Client");
      setPlan("Growth");
    }
    setReady(true);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-deep"></div>
      </div>
    );
  }

  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  const navGroups = [
    {
      title: "Overview",
      items: [
        { to: "/client", label: "Dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "WhatsApp",
      items: [
        { to: "/client/campaigns", label: "My Campaigns", icon: Send },
        { to: "/client/contacts", label: "Contacts", icon: Users },
      ]
    },
    {
      title: "Account",
      items: [
        { to: "/client/plans", label: "My Plan", icon: CreditCard },
        { to: "/client/reports", label: "Reports", icon: BarChart3 },
        { to: "/client/profile", label: "Profile", icon: User },
      ]
    }
  ];

  const renderSidebarContent = () => (
    <div className="rounded-[32px] bg-sidebar text-sidebar-foreground flex-1 p-6 flex flex-col shadow-glow relative overflow-hidden border border-white/10 h-full">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-brand/20 blur-2xl" />

      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="relative flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-glow group-hover:scale-105 transition duration-300">
            <MessageCircle className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-black text-xl tracking-tight">Caryanam</div>
            <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Client Portal</div>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-3">
              {group.title}
            </span>
            <nav className="flex flex-col gap-1">
              {group.items.map((n) => {
                const active = n.to === "/client" ? loc.pathname === "/client" : loc.pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 transform hover:translate-x-1.5 ${
                      active
                        ? "bg-gradient-brand text-white shadow-glow"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <n.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-white/60 group-hover:text-white"}`} />
                    <span className="font-bold text-sm tracking-wide whitespace-nowrap">{n.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sunny animate-pulse" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="relative mt-6 rounded-2xl bg-white/10 backdrop-blur border border-white/5 p-4 flex items-center gap-3 shrink-0">
        <div className="h-11 w-11 rounded-full bg-gradient-sun grid place-items-center text-emerald-deep font-black text-sm border-2 border-white/40 shrink-0">
          {initials || "C"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate text-white">{name}</div>
          <div className="text-xs text-white/50 truncate">{email || "Client account"}</div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("role");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            navigate("/login");
          }}
          className="p-2 rounded-xl hover:bg-red-500/20 text-white/70 hover:text-red-400 transition shrink-0"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex font-sans relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-screen p-5">
        {renderSidebarContent()}
      </aside>

      {/* Mobile & Tablet Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[290px] sm:w-[320px] z-50 p-4 lg:hidden flex flex-col h-full"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 p-4 lg:p-6">
        <header className="rounded-[28px] bg-white/70 backdrop-blur shadow-float p-3 sm:p-4 flex items-center gap-3 mb-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-3 rounded-2xl bg-cream hover:bg-white text-emerald-deep transition cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex-1 flex items-center gap-3 bg-cream rounded-2xl px-4 py-3 min-w-0">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input placeholder="Search campaigns, contacts..." className="flex-1 bg-transparent outline-none text-sm min-w-0" />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-3 rounded-2xl bg-cream hover:bg-white transition relative cursor-pointer shrink-0">
                <Bell className="h-4 w-4 text-emerald-deep" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-tangerine border border-white animate-pulse" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-2xl border-white/60 bg-white/95 backdrop-blur shadow-glow overflow-hidden z-50 mr-4">
              <div className="p-4 border-b border-cream flex items-center justify-between">
                <span className="font-display font-black text-emerald-deep">Notifications</span>
                {notifications.some(n => !n.read) && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-brand hover:text-emerald-deep transition flex items-center gap-1 cursor-pointer"
                  >
                    <MailOpen className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-cream">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    All caught up!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => toggleRead(n.id)}
                      className={`p-4 transition cursor-pointer hover:bg-cream/40 flex gap-3 ${!n.read ? "bg-brand/5" : ""}`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-xs font-bold ${!n.read ? "text-emerald-deep" : "text-foreground/80"}`}>{n.title}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{n.description}</p>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </header>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
