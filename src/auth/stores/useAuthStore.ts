import { defineStore } from "pinia";
import { useLocalStorage } from "@/hooks";

export const useAuthStorage = defineStore("auth", () => {
  const { value: token } = useLocalStorage("access_token");

  return { token };
});
