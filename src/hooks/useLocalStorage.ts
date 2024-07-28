/* eslint-disable no-console */
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
      console.error(`Error parsing localStorage key "${key}":`, error);
      parsedValue = initialValue;
    }
  } else {
    parsedValue = initialValue;
  }

  const value = ref<T | null | undefined>(parsedValue);

  watch(
    value,
    (newValue) => {
      try {
        if (newValue !== null && newValue !== undefined) {
          localStorage.setItem(key, JSON.stringify(newValue));
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    { deep: true },
  );

  return value;
}
