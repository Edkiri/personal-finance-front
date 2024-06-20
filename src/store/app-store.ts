import { defineStore } from 'pinia';
import { useTheme } from '@/hooks/useTheme';

export const AppStore = defineStore('app', () => {
  return useTheme();
});
