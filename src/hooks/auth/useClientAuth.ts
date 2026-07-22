import { useState } from "react";
import toast from "react-hot-toast";
import { postJson } from "@/lib/api";
import { useAuth, LoginPayload } from "./useAuth";

export interface ClientRegistrationPayload {
  ownerName: string;
  companyName: string;
  category: string; // e.g. "USED_CAR_DEALERS", "REAL_ESTATE", etc.
  phoneNumber: string;
  whatsappNumber?: string;
  email: string;
  password: string;
}

export function useClientAuth() {
  const auth = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const registerClient = async (payload: ClientRegistrationPayload) => {
    setIsRegistering(true);
    setRegisterError(null);
    const toastId = toast.loading("Creating account...");

    try {
      const categoryMap: Record<string, string> = {
        "Used Car Dealers": "USED_CAR_DEALERS",
        "Car Showrooms": "CAR_SHOWROOMS",
        "Hospitals": "HOSPITALS",
        "Garages": "GARAGES",
        "Real Estate": "REAL_ESTATE",
        "Insurance Agents": "INSURANCE_AGENTS",
        "Schools And Colleges": "SCHOOLS_AND_COLLEGES",
        "Hotels And Restaurants": "HOTELS_AND_RESTAURANTS",
        "Finance Companies": "FINANCE_COMPANIES",
      };

      const mappedCategory = categoryMap[payload.category] || payload.category;

      const cleanPhone = payload.phoneNumber ? payload.phoneNumber.replace(/\D/g, "").slice(-10) : "";
      const cleanWhatsapp = payload.whatsappNumber ? payload.whatsappNumber.replace(/\D/g, "").slice(-10) : cleanPhone;

      const formattedPayload = {
        ownerName: payload.ownerName,
        companyName: payload.companyName,
        category: mappedCategory,
        phoneNumber: cleanPhone,
        whatsappNumber: cleanWhatsapp,
        email: payload.email,
        password: payload.password,
      };

      const response = await postJson("/api/client/registration", formattedPayload);

      if (response.status === "SUCCESS" || response.status === "CREATED") {
        setIsRegistering(false);
        toast.success(response.message || "Registration successful!", { id: toastId });
        return {
          success: true,
          data: response.data,
          message: response.message || "Registration successful!",
        };
      } else {
        throw new Error(response.message || "Client registration failed.");
      }
    } catch (err: any) {
      const msg = err.message || "Registration failed. Please try again.";
      setRegisterError(msg);
      setIsRegistering(false);
      toast.error(msg, { id: toastId });
      return {
        success: false,
        error: msg,
      };
    }
  };

  const loginClient = async (payload: LoginPayload) => {
    return await auth.login(payload);
  };

  return {
    ...auth,
    loginClient,
    registerClient,
    isRegistering,
    registerError,
  };
}
