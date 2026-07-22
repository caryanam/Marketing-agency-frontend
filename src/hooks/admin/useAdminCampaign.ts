import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApiFetch } from "@/lib/api";

export interface CampaignRequestPayload {
  clientId: number;
  campaignName: string;
}

export interface CampaignResponseItem {
  id: number;
  clientId: number;
  clientName?: string;
  companyName?: string;
  subscriptionId: number;
  campaignName: string;
  campaignStatus: "CREATED" | "RUNNING" | "PAUSED" | "RESUMED" | "STOPPED" | "COMPLETED";
  messagesSent: number;
  createdAt: string;
  updatedAt: string;
}

export function useAdminCampaigns() {
  return useQuery<CampaignResponseItem[]>({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      const response = await adminApiFetch<CampaignResponseItem[]>("/api/admin/campaigns");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch campaigns list.");
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CampaignRequestPayload) => {
      const response = await adminApiFetch<CampaignResponseItem>("/api/admin/campaign", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create campaign.");
    },
  });
}

export function useRunCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId, messagesToSend }: { campaignId: number; messagesToSend: number }) => {
      const response = await adminApiFetch<CampaignResponseItem>(
        `/api/admin/campaign/run/${campaignId}?messagesToSend=${messagesToSend}`,
        {
          method: "PUT",
        }
      );
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to run campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign is running!");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["clientSubscriptionUsage"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to run campaign.");
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<CampaignResponseItem>(`/api/admin/campaign/pause/${campaignId}`, {
        method: "PUT",
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to pause campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign paused.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to pause campaign.");
    },
  });
}

export function useResumeCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<CampaignResponseItem>(`/api/admin/campaign/resume/${campaignId}`, {
        method: "PUT",
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to resume campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign resumed.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to resume campaign.");
    },
  });
}

export function useStopCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<CampaignResponseItem>(`/api/admin/campaign/stop/${campaignId}`, {
        method: "PUT",
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to stop campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign stopped completely.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to stop campaign.");
    },
  });
}
