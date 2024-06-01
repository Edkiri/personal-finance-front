import { defineStore } from "pinia";
import { useLocalStorage } from "@/hooks";

export const useAuthStorage = defineStore("auth", () => {
  const { value: token } = useLocalStorage<string>("access_token", '');

  return { token };
});
