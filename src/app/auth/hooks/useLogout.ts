import { router, ROUTES } from '@/router';
import { useAppStore } from '@/store/app-store';

export function useLogout() {
  const store = useAppStore();

  function logout() {
    store.accessToken = undefined;
    store.user = null;
    localStorage.clear();
    router.push(ROUTES.HOME);
  }

  return logout;
}
