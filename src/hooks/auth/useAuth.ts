import { useState } from "react";
import toast from "react-hot-toast";
import { postJson, clientAxios, adminAxios } from "@/lib/api";
import { decodeJwt, extractRoleFromToken } from "@/lib/jwt";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponseData {
  token: string;
  expiration: number;
  tokenType: string;
  userEmail: string;
  userRole: string;
}

export interface UserAuthSession {
  id: string;
  email: string;
  role: string;
  token: string;
  decoded: any;
}

export const adminData: UserAuthSession[] = [];
export const clientData: UserAuthSession[] = [];

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const clientStr = localStorage.getItem("clientData");
        if (clientStr) {
          const parsed = JSON.parse(clientStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[parsed.length - 1].token || null;
          }
        }
        const adminStr = localStorage.getItem("adminData");
        if (adminStr) {
          const parsed = JSON.parse(adminStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[parsed.length - 1].token || null;
          }
        }
      } catch (e) {
        // Ignore parse error
      }
    }
    return null;
  });

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Signing in...");

    try {
      const response = await postJson<TokenResponseData>("/auth/login", payload);

      if (response.status === "SUCCESS" && response.data?.token) {
        const receivedToken = response.data.token;
        setToken(receivedToken);

        const decoded = decodeJwt(receivedToken);
        const decodedRole = extractRoleFromToken(receivedToken);
        const serverRole = (response.data.userRole || "").toLowerCase().includes("admin")
          ? "admin"
          : "client";
        const finalRole = decodedRole || serverRole;
        const userEmail = response.data.userEmail || payload.email;

        const sessionRecord: UserAuthSession = {
          id: decoded?.sub || "1",
          email: userEmail,
          role: finalRole,
          token: receivedToken,
          decoded: decoded || {},
        };

        if (typeof window !== "undefined") {
          // Clean legacy standalone keys if present
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userEmail");

          if (finalRole === "admin") {
            adminData.length = 0;
            adminData.push(sessionRecord);
            localStorage.setItem("adminData", JSON.stringify(adminData));
          } else {
            clientData.length = 0;
            clientData.push(sessionRecord);
            localStorage.setItem("clientData", JSON.stringify(clientData));
          }
        }

        setIsLoading(false);
        toast.success(response.message || "Logged in successfully!", { id: toastId });

        return {
          success: true,
          token: receivedToken,
          role: finalRole,
          email: userEmail,
          decoded,
          message: response.message,
        };
      } else {
        throw new Error(response.message || "Login failed. Invalid response from server.");
      }
    } catch (err: any) {
      const msg = err.message || "Login failed. Please check your credentials.";
      setError(msg);
      setIsLoading(false);
      toast.error(msg, { id: toastId });
      return {
        success: false,
        error: msg,
      };
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Sending OTP to email...");

    try {
      const response = await postJson("/auth/forgot-password", { email });
      setIsLoading(false);
      if (response.status === "SUCCESS") {
        toast.success(response.message || "OTP sent to your email!", { id: toastId });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to send OTP. Please try again.";
      setError(msg);
      setIsLoading(false);
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const response = await postJson("/auth/verify-otp", { email, otp });
      setIsLoading(false);
      if (response.status === "SUCCESS") {
        toast.success(response.message || "OTP verified successfully!", { id: toastId });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Invalid or expired OTP.");
      }
    } catch (err: any) {
      const msg = err.message || "OTP verification failed.";
      setError(msg);
      setIsLoading(false);
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await postJson("/auth/reset-password", { email, newPassword });
      setIsLoading(false);
      if (response.status === "SUCCESS") {
        toast.success(response.message || "Password reset successfully!", { id: toastId });
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || "Failed to reset password.");
      }
    } catch (err: any) {
      const msg = err.message || "Failed to reset password.";
      setError(msg);
      setIsLoading(false);
      toast.error(msg, { id: toastId });
      return { success: false, error: msg };
    }
  };

  const logoutClient = async () => {
    try {
      await clientAxios.post("/auth/logout");
    } catch (e) {
      // Ignore or log error
    }
    setToken(null);
    clientData.length = 0;
    if (typeof window !== "undefined") {
      localStorage.removeItem("clientData");
    }
    toast.success("Client logged out successfully.");
  };

  const logoutAdmin = async () => {
    try {
      await adminAxios.post("/auth/logout");
    } catch (e) {
      // Ignore or log error
    }
    setToken(null);
    adminData.length = 0;
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminData");
    }
    toast.success("Admin logged out successfully.");
  };

  const logout = async (role?: "admin" | "client") => {
    if (role === "client") {
      await logoutClient();
    } else if (role === "admin") {
      await logoutAdmin();
    } else {
      await logoutClient();
      await logoutAdmin();
    }
  };

  return {
    token,
    isLoading,
    error,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    logout,
    logoutClient,
    logoutAdmin,
    adminData,
    clientData,
    decodeJwt,
    extractRoleFromToken,
  };
}
