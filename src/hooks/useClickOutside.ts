import { onMounted, onUnmounted, ref } from 'vue';

export function useClickOutside<T extends HTMLElement>(
  callback: (event: MouseEvent) => void,
) {
  const element = ref<T | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (element.value && !element.value.contains(event.target as Node)) {
      callback(event);
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return { element };
}
