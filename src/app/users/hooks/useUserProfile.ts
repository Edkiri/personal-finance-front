import { onMounted, ref, watch } from 'vue';
import { useAxios } from '@/hooks';
import { AppStore } from '@/store/app-store';

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
  const userProfile = ref<User | null>(null);
  const store = AppStore();

  const { fetchApi, error, loading } = useAxios();

  async function getUserProfile(): Promise<void> {
    const response = await fetchApi<User>({ path: 'users/profile' });
    if (response?.status === 200) {
      userProfile.value = response.data;
    } else {
      userProfile.value = null;
    }
  }

  onMounted(async () => {
    if (store.accessToken) {
      await getUserProfile();
    }
  });

  watch(
    () => store.accessToken,
    async (newToken: string | null | undefined) => {
      if (newToken) {
        await getUserProfile();
      } else {
        userProfile.value = null;
      }
    },
  );

  return { userProfile, getUserProfile, error, loading };
}
