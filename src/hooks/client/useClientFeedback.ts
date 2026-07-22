import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientApiFetch, apiFetch } from "@/lib/api";
import { getClientIdFromStorage } from "./useClientProfile";

export interface FeedbackRequestPayload {
  clientName: string;
  companyName: string;
  designation: string;
  serviceName: string; // BusinessCategory enum key
  rating: number;
  comment: string;
}

export interface FeedbackItem {
  id: number;
  clientId: number;
  clientName: string;
  companyName: string;
  designation: string;
  serviceName: string; // BusinessCategory enum key
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
}

export function useClientFeedbacks() {
  const clientIdStr = getClientIdFromStorage();
  const clientId = clientIdStr ? parseInt(clientIdStr, 10) : null;

  const feedbackQuery = useQuery<FeedbackItem[]>({
    queryKey: ["clientFeedbacks", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const response = await apiFetch<FeedbackItem[]>("/api/feedback/all");
      if (response.status === "SUCCESS" && response.data) {
        // Filter reviews created by this client
        return response.data.filter((item) => item.clientId === clientId);
      }
      throw new Error(response.message || "Failed to fetch feedbacks.");
    },
    enabled: !!clientId,
  });

  return {
    feedbacks: feedbackQuery.data || [],
    isLoading: feedbackQuery.isLoading,
    isError: feedbackQuery.isError,
    error: feedbackQuery.error,
    refetch: feedbackQuery.refetch,
  };
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  const clientIdStr = getClientIdFromStorage();

  return useMutation({
    mutationFn: async (payload: FeedbackRequestPayload) => {
      if (!clientIdStr) {
        throw new Error("Client ID not found in session.");
      }
      const response = await clientApiFetch<FeedbackItem>(
        `/api/feedback/create/${clientIdStr}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to submit feedback.");
    },
    onSuccess: (data) => {
      toast.success("Feedback submitted successfully. It will be visible after admin approval.");
      queryClient.invalidateQueries({ queryKey: ["clientFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["adminFeedbacks"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit feedback.");
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      feedbackId,
      payload,
    }: {
      feedbackId: number;
      payload: FeedbackRequestPayload;
    }) => {
      const response = await clientApiFetch<FeedbackItem>(
        `/api/feedback/update/${feedbackId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update feedback.");
    },
    onSuccess: () => {
      toast.success("Feedback updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["clientFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["adminFeedbacks"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update feedback.");
    },
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId: number) => {
      const response = await clientApiFetch<any>(
        `/api/feedback/delete/${feedbackId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === "SUCCESS") {
        return true;
      }
      throw new Error(response.message || "Failed to delete feedback.");
    },
    onSuccess: () => {
      toast.success("Feedback deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["clientFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["adminFeedbacks"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete feedback.");
    },
  });
}
