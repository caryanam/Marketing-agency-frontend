export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  userRole?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Safely decodes JWT token payload without external libraries.
 */
export function decodeJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT token:", e);
    return null;
  }
}

/**
 * Normalizes role from decoded token or server response into 'admin' | 'client'.
 */
export function extractRoleFromToken(token: string): "admin" | "client" | null {
  const decoded = decodeJwt(token);
  if (!decoded) return null;

  const rawRole = (decoded.role || decoded.userRole || "").toUpperCase();

  if (rawRole.includes("ADMIN")) {
    return "admin";
  }
  if (rawRole.includes("CLIENT") || rawRole.includes("USER")) {
    return "client";
  }
  return null;
}
