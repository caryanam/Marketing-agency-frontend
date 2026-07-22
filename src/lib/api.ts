import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const clientStr = localStorage.getItem("clientData");
    if (clientStr) {
      const parsed = JSON.parse(clientStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[parsed.length - 1]?.token) {
        return parsed[parsed.length - 1].token;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const adminStr = localStorage.getItem("adminData");
    if (adminStr) {
      const parsed = JSON.parse(adminStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[parsed.length - 1]?.token) {
        return parsed[parsed.length - 1].token;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

const extractErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(", ");
    }
  }
  return error.message || "Request failed. Please try again.";
};

// Axios Instance for Client endpoints
export const clientAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

clientAxios.interceptors.request.use((config) => {
  const token = getClientToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clientAxios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === "FAIL" && response.data.message?.toLowerCase().includes("authentication")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("client-token-expired"));
      }
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "";
    if (status === 401 || status === 403 || msg.toLowerCase().includes("authentication")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("client-token-expired"));
      }
    }
    const message = extractErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

// Axios Instance for Admin endpoints
export const adminAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

adminAxios.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxios.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === "FAIL" && response.data.message?.toLowerCase().includes("authentication")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("admin-token-expired"));
      }
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "";
    if (status === 401 || status === 403 || msg.toLowerCase().includes("authentication")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("admin-token-expired"));
      }
    }
    const message = extractErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

// Axios Instance for Public endpoints
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = extractErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

export async function clientApiFetch<T = any>(
  endpoint: string,
  options: { method?: string; body?: any; headers?: any } = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toLowerCase();
  let data = options.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // Keep as string
    }
  }
  const response = await clientAxios.request<ApiResponse<T>>({
    url: endpoint,
    method,
    data,
    headers: options.headers,
  });
  return response.data;
}

export async function adminApiFetch<T = any>(
  endpoint: string,
  options: { method?: string; body?: any; headers?: any } = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toLowerCase();
  let data = options.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // Keep as string
    }
  }
  const response = await adminAxios.request<ApiResponse<T>>({
    url: endpoint,
    method,
    data,
    headers: options.headers,
  });
  return response.data;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || "GET").toLowerCase();
  let data: any = options.body;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // Keep as string
    }
  }
  const response = await publicAxios.request<ApiResponse<T>>({
    url: endpoint,
    method,
    data,
  });
  return response.data;
}

export async function postJson<T = any>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  const response = await publicAxios.post<ApiResponse<T>>(endpoint, body);
  return response.data;
}

export async function getJson<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await publicAxios.get<ApiResponse<T>>(endpoint);
  return response.data;
}
