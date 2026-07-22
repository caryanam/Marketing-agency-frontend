import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApiFetch } from "@/lib/api";

export interface PlanRequestPayload {
  planName: string;
  planCode: string; // DAILY_STARTER etc.
  planType: string; // DAILY, MONTHLY
  price: number;
  messageLimit: number;
  campaignLimit: number;
  validityDays: number;
  isActive?: boolean;
}

export interface AdminAnalyticsData {
  totalActiveSubscriptions: number;
  totalExpiredSubscriptions: number;
  totalRevenue: number;
  pendingPayments: number;
  totalCampaignsRun: number;
  totalMessagesSent: number;
}

export interface SubscriptionPlanItem {
  id: number;
  planName: string;
  planCode: string;
  planType: string;
  price: number;
  messageLimit: number;
  campaignLimit: number;
  validityDays: number;
  isActive: boolean;
}

export interface ClientSubscriptionItem {
  id: number;
  clientId: number;
  clientName?: string;
  companyName?: string;
  plan: SubscriptionPlanItem;
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED";
  subscriptionStatus: "ACTIVE" | "EXPIRED" | "UPGRADED";
  paymentReference?: string;
  amount: number;
  purchaseDate: string;
  approvedDate?: string;
  expiryDate?: string;
  remainingMessages: number;
  campaignUsed: number;
}

export interface PaymentHistoryItem {
  id: number;
  clientSubscriptionId: number;
  amount: number;
  paymentMethod: string;
  paymentReference?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  remarks?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export function useAdminAnalytics() {
  return useQuery<AdminAnalyticsData>({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const response = await adminApiFetch<AdminAnalyticsData>("/api/admin/analytics");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch admin analytics.");
    },
  });
}

export function useAdminSubscriptions() {
  return useQuery<ClientSubscriptionItem[]>({
    queryKey: ["adminSubscriptions"],
    queryFn: async () => {
      const response = await adminApiFetch<ClientSubscriptionItem[]>("/api/admin/subscriptions");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch client subscriptions.");
    },
  });
}

export function useAdminPayments() {
  return useQuery<PaymentHistoryItem[]>({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const response = await adminApiFetch<PaymentHistoryItem[]>("/api/admin/payments");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch payments history.");
    },
  });
}

export function useAdminPendingPayments() {
  return useQuery<PaymentHistoryItem[]>({
    queryKey: ["adminPendingPayments"],
    queryFn: async () => {
      const response = await adminApiFetch<PaymentHistoryItem[]>("/api/admin/payment/pending");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch pending payments.");
    },
  });
}

export function useApproveRejectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      remarks,
    }: {
      id: number;
      status: "APPROVED" | "REJECTED";
      remarks: string;
    }) => {
      const response = await adminApiFetch<ClientSubscriptionItem>(
        `/api/admin/payment/${id}/approve-reject`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, remarks }),
        }
      );
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to moderate payment.");
    },
    onSuccess: (data) => {
      toast.success(
        data.paymentStatus === "APPROVED"
          ? "Payment approved and subscription activated!"
          : "Payment rejected successfully."
      );
      queryClient.invalidateQueries({ queryKey: ["adminPendingPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to process payment approval.");
    },
  });
}

export function useAdminPlans() {
  return useQuery<SubscriptionPlanItem[]>({
    queryKey: ["adminPlans"],
    queryFn: async () => {
      const response = await adminApiFetch<SubscriptionPlanItem[]>("/api/admin/plans");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch plans.");
    },
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PlanRequestPayload) => {
      const response = await adminApiFetch<SubscriptionPlanItem>("/api/admin/plans", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create plan.");
    },
    onSuccess: () => {
      toast.success("Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create plan.");
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: PlanRequestPayload }) => {
      const response = await adminApiFetch<SubscriptionPlanItem>(`/api/admin/plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update plan.");
    },
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update plan.");
    },
  });
}

export function useDisablePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApiFetch<any>(`/api/admin/plans/${id}`, {
        method: "DELETE",
      });
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to disable plan.");
    },
    onSuccess: () => {
      toast.success("Plan disabled successfully.");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to disable plan.");
    },
  });
}
