import { onMounted } from 'vue';
import useLocalStorage from './useLocalStorage';

export function useTheme() {
  const theme = useLocalStorage<string>('user_theme', 'light');

  onMounted(() => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark');
    }
  });

  function changeTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      theme.value = 'light';
    } else {
      document.documentElement.classList.add('dark');
      theme.value = 'dark';
    }
  }

  return { theme, changeTheme };
}
