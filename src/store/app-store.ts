import { defineStore } from 'pinia';
import { useTheme } from '@/hooks/useTheme';
import { useLocalStorage } from '@/hooks';

export const AppStore = defineStore('app', () => {
  // Theme
  const { theme, changeTheme } = useTheme();

  // Auth
  const accessToken = useLocalStorage<string>('access_token');

  return { accessToken, theme, changeTheme };
});
