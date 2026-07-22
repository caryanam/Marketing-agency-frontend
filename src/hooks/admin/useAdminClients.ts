import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApiFetch } from "@/lib/api";
import { ClientProfileData, ClientProfileUpdatePayload } from "../client/useClientProfile";

export function useAdminClients() {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery<ClientProfileData[]>({
    queryKey: ["adminClients"],
    queryFn: async () => {
      const response = await adminApiFetch<ClientProfileData[]>("/api/admin/clients");
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch clients list.");
    },
  });

  return {
    clients: clientsQuery.data || [],
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    refetch: clientsQuery.refetch,
  };
}

export function useAdminClientDetails(clientId: string | number) {
  const queryClient = useQueryClient();

  const clientQuery = useQuery<ClientProfileData>({
    queryKey: ["adminClientDetails", String(clientId)],
    queryFn: async () => {
      const response = await adminApiFetch<ClientProfileData>(`/api/client/${clientId}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch client details.");
    },
    enabled: !!clientId,
  });

  const updateClientMutation = useMutation({
    mutationFn: async (payload: ClientProfileUpdatePayload) => {
      const response = await adminApiFetch<ClientProfileData>(`/api/client/update/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to update client.");
    },
    onSuccess: (updated) => {
      toast.success("Client details updated successfully!");
      queryClient.setQueryData(["adminClientDetails", String(clientId)], updated);
      queryClient.invalidateQueries({ queryKey: ["adminClients"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update client.");
    },
  });

  return {
    client: clientQuery.data,
    isLoading: clientQuery.isLoading,
    isError: clientQuery.isError,
    error: clientQuery.error,
    refetch: clientQuery.refetch,
    updateClient: updateClientMutation.mutateAsync,
    isUpdating: updateClientMutation.isPending,
  };
}

export function useAdminClientUsage(clientId: string | number) {
  return useQuery({
    queryKey: ["adminClientUsage", String(clientId)],
    queryFn: async () => {
      const response = await adminApiFetch<any>(`/api/subscription/usage?clientId=${clientId}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch client usage.");
    },
    enabled: !!clientId,
  });
}

export function useAdminClientCampaigns(clientId: string | number) {
  return useQuery({
    queryKey: ["adminClientCampaigns", String(clientId)],
    queryFn: async () => {
      const response = await adminApiFetch<any[]>(`/api/subscription/campaigns?clientId=${clientId}`);
      if (response.status === "SUCCESS" && response.data) {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch client campaigns.");
    },
    enabled: !!clientId,
  });
}

export function useAdminClientSubscription(clientId: string | number) {
  return useQuery({
    queryKey: ["adminClientSubscription", String(clientId)],
    queryFn: async () => {
      try {
        const response = await adminApiFetch<any>(`/api/subscription/current?clientId=${clientId}`);
        if (response.status === "SUCCESS" && response.data) {
          return response.data;
        }
      } catch (e) {
        return null;
      }
      return null;
    },
    enabled: !!clientId,
  });
}
