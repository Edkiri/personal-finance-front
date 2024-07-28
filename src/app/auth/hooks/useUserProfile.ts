import { ref } from 'vue';
import { useAxios } from '@/hooks';
import type { User } from '../types';

export function useUserProfile() {
  const user = ref<User | null | undefined>(null);
  const { fetchApi, error, loading } = useAxios();

  async function getUserProfile(): Promise<void> {
    const response = await fetchApi<User>({ path: 'users/profile' });
    if (response && !error.value) {
      user.value = response.data;
    } else {
      user.value = null;
    }
  }

  return { user, getUserProfile, error, loading };
}
