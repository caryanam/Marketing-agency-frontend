import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApiFetch } from "@/lib/api";

export interface CampaignCreateRequestDTO {
  clientId: number;
  campaignName: string;
  templateId: number;
  headerImageUrl?: string;
  messageLimit?: number;
  delayBetweenMessages?: number;
  variableMappings: {
    variableIndex: number;
    variableType: "STATIC" | "DYNAMIC";
    staticValue?: string;
    fieldName?: string;
  }[];
}

export interface CampaignDetailResponseDTO {
  id: number;
  clientId: number;
  clientName?: string;
  companyName?: string;
  templateId: number;
  templateName: string;
  campaignName: string;
  campaignStatus: "CREATED" | "PROCESSING" | "PAUSED" | "CANCELLED" | "COMPLETED";
  totalRecipients: number;
  queued: number;
  processing: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  completionPercentage: number;
  deliveryRate: number;
  createdAt: string;
}

export interface CampaignStatsDTO {
  campaignId: number;
  campaignName: string;
  campaignStatus: string;
  totalRecipients: number;
  queued: number;
  processing: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  completionPercentage: number;
  deliveryRate: number;
}

export function useAdminCampaigns() {
  return useQuery<CampaignDetailResponseDTO[]>({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      const response = await adminApiFetch<CampaignDetailResponseDTO[]>("/api/campaigns");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch campaigns list.");
    },
  });
}

export function useCampaignStats(campaignId: number) {
  return useQuery<CampaignStatsDTO>({
    queryKey: ["campaignStats", campaignId],
    queryFn: async () => {
      const response = await adminApiFetch<CampaignStatsDTO>(`/api/campaigns/${campaignId}/stats`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch campaign stats.");
    },
    refetchInterval: (query) => {
      // Poll every 3 seconds if status is processing
      if (query.state?.data?.campaignStatus === "PROCESSING") {
        return 3000;
      }
      return false;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CampaignCreateRequestDTO) => {
      const response = await adminApiFetch<CampaignDetailResponseDTO>("/api/campaigns", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create campaign.");
    },
    onSuccess: () => {
      toast.success("Campaign created successfully! You can now start it.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create campaign.");
    },
  });
}

export function useStartCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<any>(`/api/campaigns/start/${campaignId}`, {
        method: "POST",
      });
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to start campaign.");
    },
    onSuccess: (_, campaignId) => {
      toast.success("Campaign started! Messages are being processed in background.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats", campaignId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to start campaign.");
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<any>(`/api/campaigns/pause/${campaignId}`, {
        method: "POST",
      });
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to pause campaign.");
    },
    onSuccess: (_, campaignId) => {
      toast.success("Campaign paused.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats", campaignId] });
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
      const response = await adminApiFetch<any>(`/api/campaigns/resume/${campaignId}`, {
        method: "POST",
      });
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to resume campaign.");
    },
    onSuccess: (_, campaignId) => {
      toast.success("Campaign resumed.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats", campaignId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to resume campaign.");
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      const response = await adminApiFetch<any>(`/api/campaigns/cancel/${campaignId}`, {
        method: "POST",
      });
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to cancel campaign.");
    },
    onSuccess: (_, campaignId) => {
      toast.success("Campaign cancelled. Pending messages have been removed.");
      queryClient.invalidateQueries({ queryKey: ["adminCampaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats", campaignId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel campaign.");
    },
  });
}
