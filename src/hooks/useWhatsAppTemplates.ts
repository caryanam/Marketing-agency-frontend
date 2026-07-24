import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminAxios } from "@/lib/api";
import { WhatsAppTemplate, WHATSAPP_TEMPLATES } from "@/lib/templates-data";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export function useWhatsAppTemplates() {
  return useQuery<WhatsAppTemplate[]>({
    queryKey: ["whatsappTemplates"],
    queryFn: async () => {
      try {
        const response = await adminAxios.get<ApiResponse<WhatsAppTemplate[]>>(
          "/api/whatsapp-templates"
        );
        if (response.data && response.data.status === "SUCCESS" && response.data.data) {
          return response.data.data;
        }
      } catch (err) {
        // Fallback to pre-configured templates if offline or server initializing
      }
      return WHATSAPP_TEMPLATES;
    },
  });
}

export function useCreateWhatsAppTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<WhatsAppTemplate>) => {
      const response = await adminAxios.post<ApiResponse<WhatsAppTemplate>>(
        "/api/whatsapp-templates",
        payload
      );
      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || "Failed to create WhatsApp template.");
    },
    onSuccess: () => {
      toast.success("WhatsApp template created successfully!");
      queryClient.invalidateQueries({ queryKey: ["whatsappTemplates"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create template. Only Admins can perform this action.");
    },
  });
}
