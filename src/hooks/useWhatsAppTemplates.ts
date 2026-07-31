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
          "/api/templates"
        );
        if (response.data && response.data.status === "SUCCESS" && response.data.data) {
          return response.data.data.map((t: any) => {
            const vars = [];
            for (let i = 1; i <= (t.variableCount || 0); i++) {
              vars.push({
                name: `variable_${i}`,
                label: `Variable {{${i}}}`,
                placeholder: `Enter value for {{${i}}}`
              });
            }
            return {
              id: t.id,
              name: t.templateName || t.name,
              category: t.category || "MARKETING",
              headerType: t.headerType || "NONE",
              bodyTemplate: t.body || "",
              variables: vars
            };
          });
        }
      } catch (err) {
        // Fallback to pre-configured templates if offline or server initializing
      }
      return WHATSAPP_TEMPLATES;
    },
  });
}

export function useSyncWhatsAppTemplates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await adminAxios.post<ApiResponse<number>>(
        "/api/templates/sync"
      );
      if (response.data && response.data.status === "SUCCESS") {
        return response.data.data; // Number of synced templates
      }
      throw new Error(response.data?.message || "Failed to sync templates from Meta.");
    },
    onSuccess: (syncedCount) => {
      toast.success(`Successfully synced ${syncedCount} templates from Meta!`);
      queryClient.invalidateQueries({ queryKey: ["whatsappTemplates"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to sync templates. Please check your Meta API configuration.");
    },
  });
}
