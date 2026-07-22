import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientApiFetch } from "@/lib/api";

export interface ClientProfileData {
  id: number;
  ownerName: string;
  companyName: string;
  category: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  createdAt?: string;
}

export interface ClientProfileUpdatePayload {
  ownerName: string;
  companyName: string;
  category?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  email: string;
}

export function getClientIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const clientStr = localStorage.getItem("clientData");
    if (clientStr) {
      const parsed = JSON.parse(clientStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[parsed.length - 1]?.id) {
        return String(parsed[parsed.length - 1].id);
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

export function useClientProfile(customId?: string | number) {
  const queryClient = useQueryClient();
  const clientId = customId ? String(customId) : getClientIdFromStorage();

  const profileQuery = useQuery<ClientProfileData>({
    queryKey: ["clientProfile", clientId],
    queryFn: async () => {
      if (!clientId) {
        throw new Error("Client ID not found in session storage.");
      }
      const response = await clientApiFetch<ClientProfileData>(`/api/client/${clientId}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch client profile.");
    },
    enabled: !!clientId,
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: ClientProfileUpdatePayload) => {
      if (!clientId) {
        throw new Error("Client ID not found.");
      }
      const response = await clientApiFetch<ClientProfileData>(`/api/client/update/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update profile.");
    },
    onSuccess: (updatedData) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueryData(["clientProfile", clientId], updatedData);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update profile.");
    },
  });

  return {
    clientId,
    client: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
