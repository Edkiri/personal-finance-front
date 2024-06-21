import { ref, Ref } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { AppStore } from '@/store/app-store';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const AxiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

AxiosClient.interceptors.request.use(
  (config) => {
    const store = AppStore();

    if (store.accessToken) {
      config.headers.Authorization = `Bearer ${store.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

interface FetchParams {
  method?: 'POST' | 'GET' | 'DELETE';
  payload?: object;
  path: string;
}

export default function useAxios() {
  const error: Ref<string | null> = ref(null);
  const loading: Ref<boolean> = ref(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (err: any) => {
    error.value = err.response?.data.message || 'An error occurred';
  };

  async function fetchApi<T>(
    fetchParams: FetchParams,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      loading.value = true;

      if (fetchParams.method === 'POST') {
        const response = await AxiosClient.post(
          fetchParams.path,
          fetchParams.payload,
        );
        return response;
      }

      if (fetchParams.method === 'DELETE') {
        return AxiosClient.delete(fetchParams.path);
      }

      const response = await AxiosClient.get(fetchParams.path, {
        params: fetchParams.payload,
      });
      return response;
    } catch (err) {
      handleError(err);
      return undefined;
    } finally {
      loading.value = false;
    }
  }

  return { error, loading, fetchApi };
}
