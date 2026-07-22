import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "@/lib/api";

export interface EnquiryItem {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  goals: string;
  createdAt?: string;
}

export function useAdminEnquiries() {
  const enquiriesQuery = useQuery<EnquiryItem[]>({
    queryKey: ["adminEnquiries"],
    queryFn: async () => {
      const response = await adminApiFetch<EnquiryItem[]>("/api/enquirie/all");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch enquiries.");
    },
  });

  return {
    enquiries: enquiriesQuery.data || [],
    isLoading: enquiriesQuery.isLoading,
    isError: enquiriesQuery.isError,
    error: enquiriesQuery.error,
    refetch: enquiriesQuery.refetch,
  };
}

export function useAdminEnquiryDetails(enquiryId: string | number) {
  const enquiryQuery = useQuery<EnquiryItem>({
    queryKey: ["adminEnquiryDetails", String(enquiryId)],
    queryFn: async () => {
      const response = await adminApiFetch<EnquiryItem>(`/api/enquirie/${enquiryId}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch enquiry details.");
    },
    enabled: !!enquiryId,
  });

  return {
    enquiry: enquiryQuery.data,
    isLoading: enquiryQuery.isLoading,
    isError: enquiryQuery.isError,
    error: enquiryQuery.error,
    refetch: enquiryQuery.refetch,
  };
}
