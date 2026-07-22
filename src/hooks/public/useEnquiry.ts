import { useState } from "react";
import toast from "react-hot-toast";
import { postJson } from "@/lib/api";

export interface EnquiryRequestPayload {
  name: string;
  phoneNumber: string;
  email: string;
  goals: string;
}

export interface EnquiryResponseData {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  goals: string;
  createdAt?: string;
}

export function useEnquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEnquiry = async (payload: EnquiryRequestPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // POST /api/enquirie/create using publicAxios (token-free)
      const response = await postJson<EnquiryResponseData>("/api/enquirie/create", {
        name: payload.name.trim(),
        phoneNumber: payload.phoneNumber.trim(),
        email: payload.email.trim(),
        goals: payload.goals.trim(),
      });

      setIsSubmitting(false);

      if (response.status === "SUCCESS" || response.status === "CREATED") {
        toast.success(response.message || "Enquiry submitted successfully!");
        return {
          success: true,
          data: response.data,
          message: response.message || "Enquiry submitted successfully!",
        };
      } else {
        throw new Error(response.message || "Failed to submit enquiry.");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to submit enquiry. Please try again.";
      setError(msg);
      setIsSubmitting(false);
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  return {
    createEnquiry,
    isSubmitting,
    error,
  };
}
