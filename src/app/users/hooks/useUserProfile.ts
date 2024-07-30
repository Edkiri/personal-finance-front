import { ref } from 'vue';
import { useAxios } from '@/hooks';

interface UserProfile {
  id: number;
  userId: number;
  onboarded: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
}

export function useUserProfile() {
  const user = ref<User | null>(null);

  const { fetchApi, error, loading } = useAxios();

  async function getUserProfile(): Promise<void> {
    const response = await fetchApi<User>({ path: 'users/profile' });
    if (response?.status === 200) {
      user.value = response.data;
    } else {
      user.value = null;
    }
  }

  return { user, getUserProfile, error, loading };
}
