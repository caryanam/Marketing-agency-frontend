export type ClientStatus = "active" | "trial" | "paused";

export type Client = {
  id: string;
  company: string;
  owner: string;
  category: string;
  phone: string;
  whatsapp: string;
  email: string;
  revenue: number;
  campaigns: number;
  status: ClientStatus;
  lastActivity: string;
  logoTone: string;
  emoji: string;
  plan: "Starter" | "Growth" | "Enterprise";
  planStartDate?: string;
  planEndDate?: string;
  billingBasis: "monthly" | "daily";
};

export const CLIENTS: Client[] = [
  { id: "auto-zone", company: "AutoZone Motors", owner: "Rohan Malhotra", category: "Used Cars", phone: "+91 98111 22201", whatsapp: "+91 98111 22201", email: "rohan@autozone.in", revenue: 480000, campaigns: 24, status: "active", lastActivity: "2 min ago", logoTone: "from-brand to-teal-deep", emoji: "🚗", plan: "Growth", planStartDate: "2026-03-12", planEndDate: "2027-03-12", billingBasis: "monthly" },
  { id: "greenleaf", company: "GreenLeaf Hospitals", owner: "Priya Nair", category: "Healthcare", phone: "+91 90000 45521", whatsapp: "+91 90000 45521", email: "priya@greenleaf.in", revenue: 720000, campaigns: 38, status: "active", lastActivity: "12 min ago", logoTone: "from-sky-soft to-brand", emoji: "🩺", plan: "Growth", planStartDate: "2025-08-20", planEndDate: "2026-08-20", billingBasis: "monthly" },
  { id: "sharma-realty", company: "Sharma Realty", owner: "Aditya Sharma", category: "Real Estate", phone: "+91 99887 66211", whatsapp: "+91 99887 66211", email: "aditya@sharmarealty.in", revenue: 1140000, campaigns: 52, status: "active", lastActivity: "1 hr ago", logoTone: "from-emerald-deep to-brand", emoji: "🏡", plan: "Enterprise", planStartDate: "2024-11-01", planEndDate: "2026-11-01", billingBasis: "monthly" },
  { id: "sunny-garage", company: "Sunny's Garage", owner: "Ravi Kumar", category: "Garages", phone: "+91 98220 11902", whatsapp: "+91 98220 11902", email: "ravi@sunnygarage.in", revenue: 180000, campaigns: 12, status: "trial", lastActivity: "yesterday", logoTone: "from-tangerine to-sunny", emoji: "🔧", plan: "Starter", planStartDate: "2026-06-01", planEndDate: "2026-09-01", billingBasis: "daily" },
  { id: "shield-insure", company: "Shield Insurance", owner: "Neha Kapoor", category: "Insurance", phone: "+91 98230 44112", whatsapp: "+91 98230 44112", email: "neha@shieldins.in", revenue: 640000, campaigns: 29, status: "active", lastActivity: "3 hr ago", logoTone: "from-sunny to-tangerine", emoji: "🛡️", plan: "Starter", planStartDate: "2026-01-15", planEndDate: "2027-01-15", billingBasis: "monthly" },
  { id: "kaveri-school", company: "Kaveri School", owner: "Deepa Rao", category: "Education", phone: "+91 99000 12345", whatsapp: "+91 99000 12345", email: "deepa@kaveri.edu.in", revenue: 240000, campaigns: 18, status: "paused", lastActivity: "3 days ago", logoTone: "from-brand to-sunny", emoji: "🎓", plan: "Starter", planStartDate: "2025-05-10", planEndDate: "2026-05-10", billingBasis: "monthly" },
  { id: "blueoak-hotels", company: "BlueOak Hotels", owner: "Arjun Mehta", category: "Hospitality", phone: "+91 90210 55521", whatsapp: "+91 90210 55521", email: "arjun@blueoak.in", revenue: 890000, campaigns: 41, status: "active", lastActivity: "30 min ago", logoTone: "from-tangerine to-brand", emoji: "🏨", plan: "Growth", planStartDate: "2026-02-14", planEndDate: "2027-02-14", billingBasis: "monthly" },
  { id: "delta-finance", company: "Delta Finance", owner: "Kavya Iyer", category: "Finance", phone: "+91 98812 30099", whatsapp: "+91 98812 30099", email: "kavya@deltafin.in", revenue: 1520000, campaigns: 64, status: "active", lastActivity: "8 min ago", logoTone: "from-teal-deep to-sky-soft", emoji: "💰", plan: "Enterprise", planStartDate: "2025-10-01", planEndDate: "2026-10-01", billingBasis: "monthly" },
];

export const ENQUIRIES = [
  { id: 1, name: "Vikram Singh", company: "SpeedAuto", email: "vikram@speedauto.in", phone: "+91 98211 33221", message: "Need bulk messaging for 25,000 leads", status: "New", date: "Today" },
  { id: 2, name: "Meera Joshi", company: "Lotus Realty", email: "meera@lotus.in", phone: "+91 90113 22110", message: "Interested in Growth plan pricing", status: "Contacted", date: "Today" },
  { id: 3, name: "Sameer Khan", company: "Khan Motors", email: "sameer@khanmotors.in", phone: "+91 98332 11009", message: "Meta green tick verification support", status: "Qualified", date: "Yesterday" },
  { id: 4, name: "Anita Desai", company: "Wellness Plus", email: "anita@wellness.in", phone: "+91 99001 22334", message: "Campaign for new clinic launch", status: "New", date: "Yesterday" },
  { id: 5, name: "Rahul Verma", company: "Verma Autos", email: "rahul@vermaautos.in", phone: "+91 98443 55221", message: "Automation for test-drive bookings", status: "Won", date: "2 days ago" },
];

export const CAMPAIGNS = [
  { id: 1, name: "Diwali Blast 2026", client: "AutoZone Motors", sent: 8200, delivered: 8036, read: 6420, replied: 812, status: "Running" },
  { id: 2, name: "Monsoon Health Check", client: "GreenLeaf Hospitals", sent: 12400, delivered: 12290, read: 10120, replied: 1502, status: "Completed" },
  { id: 3, name: "New Launch — Green Vista", client: "Sharma Realty", sent: 5600, delivered: 5510, read: 4820, replied: 651, status: "Running" },
  { id: 4, name: "EMI Reminder — Sep", client: "Delta Finance", sent: 22000, delivered: 21820, read: 18980, replied: 2201, status: "Scheduled" },
  { id: 5, name: "Weekend Getaway Offer", client: "BlueOak Hotels", sent: 3400, delivered: 3388, read: 2810, replied: 402, status: "Running" },
];

export const TEMPLATES = [
  { id: 1, name: "Welcome Message", category: "Onboarding", lang: "English", status: "Approved", uses: 4820 },
  { id: 2, name: "Test Drive Confirmation", category: "Automotive", lang: "English + Hindi", status: "Approved", uses: 2410 },
  { id: 3, name: "Appointment Reminder", category: "Healthcare", lang: "English", status: "Approved", uses: 3910 },
  { id: 4, name: "Property Site Visit", category: "Real Estate", lang: "English + Hindi", status: "Pending", uses: 0 },
  { id: 5, name: "Festive Offer", category: "Retail", lang: "English + Regional", status: "Approved", uses: 6220 },
  { id: 6, name: "Payment Received", category: "Finance", lang: "English", status: "Approved", uses: 8410 },
];
