import useAxios from '@/hooks/useAxios';
import { useAppStore } from '@/store/app-store';

interface LoginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const store = useAppStore();

  const { fetchApi, error, loading } = useAxios();

  async function login(payload: LoginForm): Promise<boolean> {
    const response = await fetchApi<{ access_token: string }>({
      method: 'POST',
      path: `auth/login`,
      payload,
    });
    if (response?.status === 200) {
      store.accessToken = response.data?.access_token;
      await store.getUserProfile();
      return true;
    }
    return false;
  }

  return { login, error, loading };
}
