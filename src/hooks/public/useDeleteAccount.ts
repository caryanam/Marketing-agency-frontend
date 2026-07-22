import { useState } from "react";
import toast from "react-hot-toast";
import { postJson } from "@/lib/api";

export interface DeleteAccountPayload {
  email: string;
  password: string;
}

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteAccount = async (payload: DeleteAccountPayload) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // POST /api/client/delete-account using publicAxios (token-free)
      const response = await postJson("/api/client/delete-account", {
        email: payload.email.trim(),
        password: payload.password,
      });

      setIsDeleting(false);

      if (response.status === "SUCCESS") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("clientData");
        }
        toast.success(response.message || "Account deleted successfully.");
        return {
          success: true,
          message: response.message || "Account deleted successfully.",
        };
      } else {
        const msg = response.message || "Account deletion failed. Please check your credentials.";
        setDeleteError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }
    } catch (err: any) {
      const msg = err.message || "Failed to delete account. Please check your credentials.";
      setDeleteError(msg);
      setIsDeleting(false);
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  return {
    deleteAccount,
    isDeleting,
    deleteError,
  };
}
