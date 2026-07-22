import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApiFetch } from "@/lib/api";
import { FeedbackItem } from "../client/useClientFeedback";

export function useAdminFeedbacks() {
  const feedbacksQuery = useQuery<FeedbackItem[]>({
    queryKey: ["adminFeedbacks"],
    queryFn: async () => {
      const response = await adminApiFetch<FeedbackItem[]>("/api/feedback/all");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch admin feedback list.");
    },
  });

  return {
    feedbacks: feedbacksQuery.data || [],
    isLoading: feedbacksQuery.isLoading,
    isError: feedbacksQuery.isError,
    error: feedbacksQuery.error,
    refetch: feedbacksQuery.refetch,
  };
}

export function useApproveRejectFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      feedbackId,
      status,
    }: {
      feedbackId: number;
      status: "APPROVED" | "REJECTED";
    }) => {
      const response = await adminApiFetch<FeedbackItem>(
        "/api/admin/feedback/approve-reject",
        {
          method: "PATCH",
          body: JSON.stringify({ feedbackId, status }),
        }
      );
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || `Failed to update feedback status to ${status}.`);
    },
    onSuccess: (data) => {
      toast.success(`Feedback status updated to ${data.status} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["adminFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["clientFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedbacks"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update feedback status.");
    },
  });
}

export function useAdminDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId: number) => {
      const response = await adminApiFetch<any>(
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
      toast.success("Feedback deleted successfully by administrator.");
      queryClient.invalidateQueries({ queryKey: ["adminFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["clientFeedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedbacks"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete feedback.");
    },
  });
}
