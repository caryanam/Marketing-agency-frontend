import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { FeedbackItem } from "../client/useClientFeedback";

export function usePublicFeedbacks() {
  const query = useQuery<FeedbackItem[]>({
    queryKey: ["publicFeedbacks"],
    queryFn: async () => {
      const response = await apiFetch<FeedbackItem[]>("/api/feedback/all");
      if (response.status === "SUCCESS" && response.data) {
        // Only return approved feedbacks
        return response.data.filter((item) => item.status === "APPROVED");
      }
      throw new Error(response.message || "Failed to fetch public testimonials.");
    },
  });

  return {
    feedbacks: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
