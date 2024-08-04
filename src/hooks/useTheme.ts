import { watch } from 'vue';
import useLocalStorage from './useLocalStorage';

export function useTheme() {
  const theme = useLocalStorage<string>('user_theme', 'light');

  watch(
    [theme],
    ([newTheme]) => {
      if (!newTheme) return;

      if (
        newTheme === 'dark' &&
        !document.documentElement.classList.contains('dark')
      ) {
        document.documentElement.classList.add('dark');
        return;
      }

      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
    },
    { immediate: true },
  );

  function changeTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  }

  return { theme, changeTheme };
}
