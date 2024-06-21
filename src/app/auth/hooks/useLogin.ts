import useAxios from '@/hooks/useAxios';
import { AppStore } from '@/store/app-store';

export function useLogin() {
  const store = AppStore();

  const { fetchApi, error, loading } = useAxios();

  async function login(email: string, password: string): Promise<boolean> {
    const response = await fetchApi<{ access_token: string }>({
      method: 'POST',
      path: `auth/login`,
      payload: { email, password },
    });
    if (response?.status === 200) {
      store.accessToken = response.data?.access_token;
      return true;
    }
    return false;
  }

  return { login, error, loading };
}
