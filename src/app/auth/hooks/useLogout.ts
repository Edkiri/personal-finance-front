import { AppStore } from '@/store/app-store';

export function useLogout() {
  const store = AppStore();

  function logout() {
    store.accessToken = undefined;
    store.user = null;
    localStorage.clear();
  }

  return logout;
}
