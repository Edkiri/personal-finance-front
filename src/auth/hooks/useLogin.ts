import useAxios from "../../hooks/useAxios";
import { useAuthStorage } from "../stores/useAuthStore";

export function useLogin() {
  const authStorage = useAuthStorage();

  const { fetchApi, error, loading } = useAxios();

  async function login(password: string): Promise<boolean> {
    const response = await fetchApi<{ access_token: string }>({
      method: "POST",
      path: `auth/login`,
      payload: { password },
    });
    if(response?.status === 200) {
      authStorage.token = response.data?.access_token;
      return true;
    }
    return false;
  }

  return { login, error, loading };
}
