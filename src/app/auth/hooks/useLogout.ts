import { AppStore } from '@/store/app-store';

export function useLogout() {
  const store = AppStore();

  function logout() {
    store.accessToken = undefined;
  }

  return logout;
}
