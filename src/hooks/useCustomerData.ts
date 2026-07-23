import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientAxios, adminAxios, ApiResponse } from "@/lib/api";

export interface CustomerDataResponseDTO {
  id: number;
  customerName: string;
  whatsappNumber: string;
  clientId: number;
  businessCategory: string;
  createdAt: string | null;
}

export interface ExcelImportResponseDTO {
  totalRowsRead: number;
  totalImported: number;
  totalSkippedEmptyRows: number;
  totalSkippedInvalidRows: number;
  totalSkippedDuplicateRows: number;
  importedCustomers: CustomerDataResponseDTO[];
}

export interface ImportLogDTO {
  id?: number;
  totalRowsRead: number;
  totalImported: number;
  skippedEmptyRows: number;
  skippedInvalidRows: number;
  skippedDuplicateRows: number;
  importedAt: string | null;
}

export function useClientCustomerDataStats(clientId?: number | string) {
  return useQuery<ImportLogDTO | null>({
    queryKey: ["clientCustomerDataStats", String(clientId)],
    queryFn: async () => {
      if (!clientId) return null;
      const response = await clientAxios.get<ApiResponse<ImportLogDTO>>(
        `/api/customer-data/import-stats/${clientId}`
      );
      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!clientId,
  });
}

export function useAdminCustomerDataStats(clientId?: number | string) {
  return useQuery<ImportLogDTO | null>({
    queryKey: ["adminCustomerDataStats", String(clientId)],
    queryFn: async () => {
      if (!clientId) return null;
      const response = await adminAxios.get<ApiResponse<ImportLogDTO>>(
        `/api/customer-data/import-stats/${clientId}`
      );
      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!clientId,
  });
}

export function useClientCustomerData(clientId?: number | string) {
  const queryClient = useQueryClient();

  const customerDataQuery = useQuery<CustomerDataResponseDTO[]>({
    queryKey: ["clientCustomerData", String(clientId)],
    queryFn: async () => {
      if (!clientId) return [];
      const response = await clientAxios.get<ApiResponse<CustomerDataResponseDTO[]>>(
        `/api/customer-data/client/${clientId}`
      );
      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to fetch customer data.");
    },
    enabled: !!clientId,
  });

  return {
    customerData: customerDataQuery.data || [],
    isLoading: customerDataQuery.isLoading,
    isError: customerDataQuery.isError,
    error: customerDataQuery.error,
    refetch: customerDataQuery.refetch,
  };
}

export function useAdminCustomerData(clientId?: number | string) {
  const queryClient = useQueryClient();

  const customerDataQuery = useQuery<CustomerDataResponseDTO[]>({
    queryKey: ["adminCustomerData", String(clientId)],
    queryFn: async () => {
      if (!clientId) return [];
      const response = await adminAxios.get<ApiResponse<CustomerDataResponseDTO[]>>(
        `/api/customer-data/client/${clientId}`
      );
      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to fetch customer data.");
    },
    enabled: !!clientId,
  });

  const importExcelMutation = useMutation({
    mutationFn: async ({
      file,
      clientId: targetClientId,
      businessCategory,
    }: {
      file: File;
      clientId: number | string;
      businessCategory?: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", String(targetClientId));
      if (businessCategory) {
        formData.append("businessCategory", businessCategory);
      }

      const response = await adminAxios.post<ApiResponse<ExcelImportResponseDTO>>(
        "/api/customer-data/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to import customer data.");
    },
    onSuccess: (result, variables) => {
      toast.success(`Imported ${result.totalImported} contact(s) successfully!`);
      queryClient.invalidateQueries({ queryKey: ["adminCustomerData", String(variables.clientId)] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomerData", String(variables.clientId)] });
      queryClient.invalidateQueries({ queryKey: ["adminCustomerDataStats", String(variables.clientId)] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomerDataStats", String(variables.clientId)] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to import customer data.");
    },
  });

  return {
    customerData: customerDataQuery.data || [],
    isLoading: customerDataQuery.isLoading,
    isError: customerDataQuery.isError,
    error: customerDataQuery.error,
    refetch: customerDataQuery.refetch,
    importExcel: importExcelMutation.mutateAsync,
    isImporting: importExcelMutation.isPending,
    importError: importExcelMutation.error,
  };
}
