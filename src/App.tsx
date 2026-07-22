import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import AdminLayout from "@/layouts/AdminLayout";
import ClientLayout from "@/layouts/ClientLayout";

// Public / Auth Pages
import Home from "@/pages/public/Home";
import Login from "@/pages/auth/Login";
import PricingPage from "@/pages/public/PricingPage";
import ContactPage from "@/pages/public/ContactPage";
import FaqPage from "@/pages/public/FaqPage";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import TermsOfService from "@/pages/public/TermsOfService";
import RefundPolicy from "@/pages/public/RefundPolicy";
import DeleteAccount from "@/pages/public/DeleteAccount";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminClients from "@/pages/admin/Clients";
import AdminClientDetails from "@/pages/admin/ClientDetails";
import AdminCampaigns from "@/pages/admin/Campaigns";
import AdminEnquiries from "@/pages/admin/Enquiries";
import AdminPlans from "@/pages/admin/Plans";
import AdminProfile from "@/pages/admin/Profile";
import AdminReports from "@/pages/admin/Reports";
import AdminTemplates from "@/pages/admin/Templates";
import AdminFeedbacks from "@/pages/admin/Feedbacks";

// Client Pages
import ClientDashboard from "@/pages/client/Dashboard";
import ClientCampaigns from "@/pages/client/Campaigns";
import ClientContacts from "@/pages/client/Contacts";
import ClientPlans from "@/pages/client/Plans";
import ClientProfile from "@/pages/client/Profile";
import ClientReports from "@/pages/client/Reports";
import ClientTemplates from "@/pages/client/Templates";
import ClientFeedback from "@/pages/client/Feedback";

import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HotToaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/delete-account" element={<DeleteAccount />} />

          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="campaigns" element={<ClientCampaigns />} />
            <Route path="contacts" element={<ClientContacts />} />
            <Route path="plans" element={<ClientPlans />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="reports" element={<ClientReports />} />
            <Route path="templates" element={<ClientTemplates />} />
            <Route path="feedback" element={<ClientFeedback />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="clients/:id" element={<AdminClientDetails />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="feedbacks" element={<AdminFeedbacks />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
