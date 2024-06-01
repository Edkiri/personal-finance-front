import { ref, watch } from "vue";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  let parsedValue: T;
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

  const value = ref<T>(parsedValue);
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return value;
}
