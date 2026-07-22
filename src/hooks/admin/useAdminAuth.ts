import { useAuth, LoginPayload } from "../auth/useAuth";

export function useAdminAuth() {
  const auth = useAuth();

  const loginAdmin = async (payload: LoginPayload) => {
    const result = await auth.login(payload);
    if (result.success && result.role !== "admin") {
      return {
        ...result,
        warning: "Logged in user is not an Admin.",
      };
    }
    return result;
  };

  return {
    ...auth,
    loginAdmin,
  };
}
