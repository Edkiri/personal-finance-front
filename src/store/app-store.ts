import { defineStore } from 'pinia';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks';
import { useUserProfile } from '@/app/users/hooks';

export const AppStore = defineStore('app', () => {
  // Theme
  const { theme, changeTheme } = useTheme();

  // Auth
  const accessToken = useLocalStorage<string>('access_token');

  // User
  const { user, getUserProfile } = useUserProfile();

  return { accessToken, user, getUserProfile, theme, changeTheme };
});
