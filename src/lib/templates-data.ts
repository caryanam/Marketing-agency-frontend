export interface WhatsAppTemplateVariable {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}

export interface WhatsAppTemplate {
  id: number;
  name: string;
  category: "MARKETING" | "UTILITY";
  headerType: "IMAGE" | "TEXT";
  bodyTemplate: string;
  variables: WhatsAppTemplateVariable[];
  defaultHeaderUrl?: string;
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 1,
    name: "Festive Special Offer (With Banner Image)",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Hello {{1}}! 👋\n\n{{2}}\n\n🔥 Special Offer: {{3}}\n⏰ Valid Till: {{4}}\n\n{{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Customer Name Placeholder", placeholder: "e.g. {{Customer Name}}", defaultValue: "Customer" },
      { name: "var2", label: "Headline / Announcement", placeholder: "e.g. Special Festive Discount Event!" },
      { name: "var3", label: "Offer Details", placeholder: "e.g. Flat 30% OFF on all packages" },
      { name: "var4", label: "Expiry / Validity Date", placeholder: "e.g. Sunday, 31st October" },
      { name: "var5", label: "Call-to-Action / Address", placeholder: "e.g. Visit store or call +91 9811122201" },
    ],
  },
  {
    id: 2,
    name: "Exclusive Announcement (Text Only)",
    category: "MARKETING",
    headerType: "TEXT",
    bodyTemplate: "Dear {{1}},\n\n{{2}}\n\n⭐ Key Highlights:\n• {{3}}\n• {{4}}\n\nReply YES to book or contact us directly!",
    variables: [
      { name: "var1", label: "Customer Name Placeholder", placeholder: "e.g. {{Customer Name}}", defaultValue: "Valued Customer" },
      { name: "var2", label: "Main Promo Message", placeholder: "e.g. Exclusive VIP Early Access is now Live!" },
      { name: "var3", label: "Highlight Point 1", placeholder: "e.g. Zero processing fee on all bookings" },
      { name: "var4", label: "Highlight Point 2", placeholder: "e.g. Complimentary doorstep delivery included" },
    ],
  },
  {
    id: 3,
    name: "Automotive / Car Exchange Fair (With Image)",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Greetings {{1}}! 🚗\n\n{{2}}\n\n💰 Bonus: {{3}}\n🗓️ Date: {{4}}\n\n📍 {{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Customer Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Car Enthusiast" },
      { name: "var2", label: "Event Name / Headline", placeholder: "e.g. Mega Used Car Exchange Carnival!" },
      { name: "var3", label: "Exchange Bonus Value", placeholder: "e.g. Get up to ₹40,000 extra exchange value" },
      { name: "var4", label: "Event Schedule / Dates", placeholder: "e.g. This Weekend (Saturday & Sunday)" },
      { name: "var5", label: "Showroom Location & Contact", placeholder: "e.g. AutoZone Motors, MG Road Metro Pillar 102" },
    ],
  },
  {
    id: 4,
    name: "Healthcare / Full Body Checkup Camp (With Image)",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Dear {{1}}, 🩺\n\n{{2}}\n\n🔬 Package Includes: {{3}}\n💵 Special Price: {{4}}\n\n{{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Patient / Customer Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Patient" },
      { name: "var2", label: "Health Camp Title", placeholder: "e.g. Preventative Health Checkup Month" },
      { name: "var3", label: "Included Tests", placeholder: "e.g. 60+ Essential Blood, Thyroid & Lipid Tests" },
      { name: "var4", label: "Discount Price", placeholder: "e.g. ₹999 Only (Regular ₹2,499)" },
      { name: "var5", label: "Hospital Contact / Home Sample", placeholder: "e.g. Call City Care Hospital at +91 9000045521" },
    ],
  },
  {
    id: 5,
    name: "Real Estate Property Pre-Launch VIP Pass",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Hello {{1}}! 🏡\n\n{{2}}\n\n✨ Unit Config: {{3}}\n🎁 VIP Perks: {{4}}\n\n{{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Buyer Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Investor" },
      { name: "var2", label: "Property Project Name", placeholder: "e.g. Skyline Luxury Towers Pre-Launch" },
      { name: "var3", label: "Apartment Types", placeholder: "e.g. 2, 3 & 4 BHK Luxury Residences" },
      { name: "var4", label: "Pre-Launch Benefit", placeholder: "e.g. Zero Stamp Duty + Free Modular Kitchen" },
      { name: "var5", label: "Site Visit Details", placeholder: "e.g. Book private site tour: +91 9988766211" },
    ],
  },
  {
    id: 6,
    name: "Garage / Auto Service Reminder (Text Only)",
    category: "UTILITY",
    headerType: "TEXT",
    bodyTemplate: "Hi {{1}}, 🔧\n\n{{2}}\n\n🛠️ Package: {{3}}\n🚚 Benefit: {{4}}\n\nContact us to confirm your preferred slot!",
    variables: [
      { name: "var1", label: "Owner Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Vehicle Owner" },
      { name: "var2", label: "Service Nudge Message", placeholder: "e.g. Your car's periodic maintenance service is due!" },
      { name: "var3", label: "Service Features", placeholder: "e.g. Full Oil Change, Filter Replacements & 40-Point Check" },
      { name: "var4", label: "Added Convenience", placeholder: "e.g. Free Pick-up & Drop Facility Available" },
    ],
  },
  {
    id: 7,
    name: "Hotel & Resort Weekend Getaway (With Image)",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Dear {{1}}! 🏨\n\n{{2}}\n\n🌴 Special Package: {{3}}\n🍷 Inclusions: {{4}}\n\n{{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Guest Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Guest" },
      { name: "var2", label: "Getaway Headline", placeholder: "e.g. Escape the City Noise at BlueOak Luxury Resort!" },
      { name: "var3", label: "Stay Offer Price", placeholder: "e.g. 2 Nights Weekend Package starting at ₹7,999" },
      { name: "var4", label: "Free Inclusions", placeholder: "e.g. Complimentary Breakfast, Spa Voucher & Late Checkout" },
      { name: "var5", label: "Reservation Desk Contact", placeholder: "e.g. Call +91 9021055521 or reply RESERVE" },
    ],
  },
  {
    id: 8,
    name: "School / College Admission Notification (Text Only)",
    category: "UTILITY",
    headerType: "TEXT",
    bodyTemplate: "Respected Parent / {{1}},\n\n{{2}}\n\n🎓 Courses: {{3}}\n📅 Last Date: {{4}}\n\nVisit campus or apply online today!",
    variables: [
      { name: "var1", label: "Recipient Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Parent" },
      { name: "var2", label: "Admission Announcement", placeholder: "e.g. Admissions Open for Academic Session 2026-27!" },
      { name: "var3", label: "Grades / Streams Available", placeholder: "e.g. Pre-Nursery to Grade XII (Science, Commerce, Arts)" },
      { name: "var4", label: "Application Deadline", placeholder: "e.g. 15th November 2026" },
    ],
  },
  {
    id: 9,
    name: "Finance / Loan Instant Approval Alert (With Image)",
    category: "MARKETING",
    headerType: "IMAGE",
    bodyTemplate: "Hi {{1}}! 💰\n\n{{2}}\n\n📉 Interest Rate: {{3}}\n⚡ Approval Time: {{4}}\n\n{{5}}",
    defaultHeaderUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60",
    variables: [
      { name: "var1", label: "Customer Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Applicant" },
      { name: "var2", label: "Loan Offer Title", placeholder: "e.g. Pre-Approved Personal & Business Loan Offer!" },
      { name: "var3", label: "Interest Rate Offer", placeholder: "e.g. Starting from 8.5% p.a. with Zero Processing Fee" },
      { name: "var4", label: "Disposal Time", placeholder: "e.g. Sanctioned within 30 minutes with minimal docs" },
      { name: "var5", label: "Finance Desk Helpline", placeholder: "e.g. Contact Delta Finance at +91 9881230099" },
    ],
  },
  {
    id: 10,
    name: "Insurance Renewal Nudge (Text Only)",
    category: "UTILITY",
    headerType: "TEXT",
    bodyTemplate: "Dear {{1}},\n\n{{2}}\n\n🛡️ Coverage: {{3}}\n🎁 Renewal Bonus: {{4}}\n\nRenew today to maintain continuous coverage!",
    variables: [
      { name: "var1", label: "Policyholder Name", placeholder: "e.g. {{Customer Name}}", defaultValue: "Policyholder" },
      { name: "var2", label: "Renewal Notice", placeholder: "e.g. Your Motor / Health Policy is due for renewal!" },
      { name: "var3", label: "Sum Insured / Coverage", placeholder: "e.g. Cashless Coverage across 10,000+ Network Hospitals" },
      { name: "var4", label: "No-Claim Bonus Benefit", placeholder: "e.g. 50% No-Claim Bonus (NCB) Discount Applied" },
    ],
  },
];
