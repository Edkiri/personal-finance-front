import { useAxios } from '@/hooks';

export interface SignupForm {
  email: string;
  password: string;
  username: string;
}

export function useSignup() {
  const { fetchApi, loading, error } = useAxios();

  async function signup(payload: SignupForm): Promise<boolean> {
    const response = await fetchApi({
      method: 'POST',
      path: 'auth/signup',
      payload,
    });

    if (response?.status === 200) {
      return true;
    }
    return false;
  }

  return { signup, loading, error };
}
