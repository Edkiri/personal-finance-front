import useAxios from "../../hooks/useAxios";
import { API } from "@/constants";
import { useAuthStorage } from "../stores";

export function useAuth() {
  const authStorage = useAuthStorage();

  const { fetchApi, error, loading } = useAxios();

  async function login(password: string): Promise<boolean> {
    const response = await fetchApi<{ access_token: string }>({
      method: "POST",
      path: `${API}/auth/login`,
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