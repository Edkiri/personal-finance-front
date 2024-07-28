import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks';
import { useUserProfile } from '@/app/auth/hooks/useUserProfile';

export const useAppStore = defineStore('app', () => {
  // Theme
  const { theme, changeTheme } = useTheme();

  // Auth
  const accessToken = useLocalStorage<string>('access_token');

  // User
  const { user, getUserProfile } = useUserProfile();

  const isInitialized = ref(false);
  const isInitializing = ref(false);

  const init = async () => {
    if (isInitialized.value || isInitializing.value) return;

    isInitializing.value = true;

    if (accessToken.value) {
      await getUserProfile();
    }

    isInitialized.value = true;
    isInitializing.value = false;
  };

  return {
    init,
    accessToken,
    theme,
    changeTheme,
    user,
    isInitialized,
    getUserProfile,
  };
});
