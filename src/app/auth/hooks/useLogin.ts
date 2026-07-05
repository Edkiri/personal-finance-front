import useAxios from '@/hooks/useAxios';
import { useAppStore } from '@/store/app-store';

interface LoginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const store = useAppStore();

  const { fetchApi, error, loading, status } = useAxios();

  async function login(payload: LoginForm): Promise<boolean> {
    error.value = null;
    const response = await fetchApi<{ access_token: string }>({
      method: 'POST',
      path: `auth/login`,
      payload,
    });
    if (response?.status === 200 && response.data?.access_token) {
      store.accessToken = response.data.access_token;
      await store.getUserProfile();
      return true;
    }
    // An HTTP error (e.g. 401/400) only sets `status`; surface it to the user.
    // Network errors leave `status` null and are already reported via a toast.
    if (status.value) {
      error.value = 'Correo electrónico o contraseña incorrectos';
    }
    return false;
  }

  return { login, error, loading };
}
