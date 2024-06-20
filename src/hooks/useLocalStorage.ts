import { ref, watch } from 'vue';

export default function useLocalStorage<T>(
  key: string,
  initialValue?: T | null | undefined,
) {
  let parsedValue: T | null | undefined;
  const storedValue = localStorage.getItem(key);

  if (storedValue) {
    try {
      parsedValue = JSON.parse(storedValue);
    } catch (error) {
      parsedValue = initialValue;
    }
  } else {
    parsedValue = initialValue;
  }

  const value = ref<T | null | undefined>(parsedValue);

  watch(
    value,
    (newValue) => {
      if (newValue) {
        localStorage.setItem(key, JSON.stringify(newValue));
      } else {
        localStorage.removeItem(key);
      }
    },
    { deep: true },
  );

  return value;
}
