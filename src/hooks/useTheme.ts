import { ref } from 'vue';

export function useTheme() {
  const theme = ref('dark');

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
