import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAxios } from '@/hooks';
import { useAppStore } from '@/store/app-store';

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
  const store = useAppStore();
  const { accessToken } = storeToRefs(store);

  const { fetchApi, error, loading } = useAxios();

  async function getUserProfile(): Promise<void> {
    const response = await fetchApi<User>({ path: 'users/profile' });
    if (response?.status === 200) {
      user.value = response.data;
    } else {
      user.value = null;
    }
  }

  onMounted(async () => {
    if (accessToken.value) {
      await getUserProfile();
    }
  });

  watch(
    () => accessToken.value,
    async (newToken: string | null | undefined): Promise<void> => {
      if (!newToken) {
        user.value = null;
      }
    },
  );

  return { user, getUserProfile, error, loading };
}
