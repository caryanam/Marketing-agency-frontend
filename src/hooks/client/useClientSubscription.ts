import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientApiFetch, apiFetch } from "@/lib/api";
import { SubscriptionPlanItem, ClientSubscriptionItem, PaymentHistoryItem } from "../admin/useAdminSubscription";
import { CampaignResponseItem } from "../admin/useAdminCampaign";

export interface PurchaseRequestPayload {
  planId: number;
  paymentMethod: string;
  paymentReference?: string;
}

export interface SubscriptionUsageData {
  clientId: number;
  planName: string;
  totalMessagesAllowed: number;
  remainingMessages: number;
  messagesUsed: number;
  totalCampaignsAllowed: number;
  campaignsUsed: number;
  remainingCampaigns: number;
  daysRemaining: string;
}

export function useClientActivePlans() {
  return useQuery<SubscriptionPlanItem[]>({
    queryKey: ["clientActivePlans"],
    queryFn: async () => {
      const response = await clientApiFetch<SubscriptionPlanItem[]>("/api/plans");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch plans.");
    },
  });
}

export function usePublicActivePlans() {
  return useQuery<SubscriptionPlanItem[]>({
    queryKey: ["publicActivePlans"],
    queryFn: async () => {
      const response = await apiFetch<SubscriptionPlanItem[]>("/api/plans");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch plans.");
    },
  });
}

export function useClientPlanDetails(id: number) {
  return useQuery<SubscriptionPlanItem>({
    queryKey: ["clientPlanDetails", id],
    queryFn: async () => {
      const response = await clientApiFetch<SubscriptionPlanItem>(`/api/plans/${id}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch plan details.");
    },
    enabled: !!id,
  });
}

export function useClientCurrentSubscription() {
  return useQuery<ClientSubscriptionItem | null>({
    queryKey: ["clientCurrentSubscription"],
    queryFn: async () => {
      try {
        const response = await clientApiFetch<ClientSubscriptionItem>("/api/subscription/current");
        if (response.status === "SUCCESS" && response.data) {
          return response.data;
        }
      } catch (e) {
        return null;
      }
      return null;
    },
  });
}

export function useClientSubscriptionHistory() {
  return useQuery<ClientSubscriptionItem[]>({
    queryKey: ["clientSubscriptionHistory"],
    queryFn: async () => {
      const response = await clientApiFetch<ClientSubscriptionItem[]>("/api/subscription/history");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch subscription history.");
    },
  });
}

export function useClientSubscriptionUsage() {
  return useQuery<SubscriptionUsageData>({
    queryKey: ["clientSubscriptionUsage"],
    queryFn: async () => {
      const response = await clientApiFetch<SubscriptionUsageData>("/api/subscription/usage");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch usage metrics.");
    },
  });
}

export function useClientPaymentHistory() {
  return useQuery<PaymentHistoryItem[]>({
    queryKey: ["clientPaymentHistory"],
    queryFn: async () => {
      const response = await clientApiFetch<PaymentHistoryItem[]>("/api/payment/history");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch payment history.");
    },
  });
}

export function usePurchaseSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PurchaseRequestPayload) => {
      const response = await clientApiFetch<ClientSubscriptionItem>("/api/subscription/purchase", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to request purchase.");
    },
    onSuccess: () => {
      toast.success("Subscription purchase requested successfully! Awaiting administrator approval.");
      queryClient.invalidateQueries({ queryKey: ["clientCurrentSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["clientSubscriptionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["clientPaymentHistory"] });
      queryClient.invalidateQueries({ queryKey: ["adminPendingPayments"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to request subscription purchase.");
    },
  });
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PurchaseRequestPayload) => {
      const response = await clientApiFetch<ClientSubscriptionItem>("/api/subscription/upgrade", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to request upgrade.");
    },
    onSuccess: () => {
      toast.success("Subscription upgrade requested successfully! Awaiting administrator approval.");
      queryClient.invalidateQueries({ queryKey: ["clientCurrentSubscription"] });
      queryClient.invalidateQueries({ queryKey: ["clientSubscriptionHistory"] });
      queryClient.invalidateQueries({ queryKey: ["clientPaymentHistory"] });
      queryClient.invalidateQueries({ queryKey: ["adminPendingPayments"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to request subscription upgrade.");
    },
  });
}

export function useClientCampaigns() {
  return useQuery<CampaignResponseItem[]>({
    queryKey: ["clientCampaigns"],
    queryFn: async () => {
      const response = await clientApiFetch<CampaignResponseItem[]>("/api/subscription/campaigns");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch campaigns.");
    },
  });
}
