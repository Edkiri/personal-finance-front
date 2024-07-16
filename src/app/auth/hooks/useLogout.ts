import { useAppStore } from '@/store/app-store';

export function useLogout() {
  const store = useAppStore();

  function logout() {
    store.accessToken = undefined;
    store.user = null;
    localStorage.clear();
  }

  return logout;
}
