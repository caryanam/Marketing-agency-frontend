import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminAxios } from "@/lib/api";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg"];

export function validateImageFile(file: File): string | null {
  if (!file) return "Please select an image file.";

  if (file.size > MAX_SIZE_BYTES) {
    return `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 20MB limit.`;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return "Invalid file format. Only PNG, JPEG, and JPG images are supported.";
  }

  return null;
}

export function useImageUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const errorMsg = validateImageFile(file);
      if (errorMsg) {
        throw new Error(errorMsg);
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await adminAxios.post<ApiResponse<String>>(
        "/api/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.status === "SUCCESS" && response.data.data) {
        return String(response.data.data);
      }
      throw new Error(response.data?.message || "Failed to upload image file.");
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload image file.");
    },
  });
}
