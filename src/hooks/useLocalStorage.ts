import { ref, watch } from "vue";

export default function useLocalStorage<T>(key: string, initialValue?: string | undefined) {
  const storedValue = localStorage.getItem(key);
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : initialValue);

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return { value };
}
