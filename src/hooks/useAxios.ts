import { ref, Ref } from 'vue';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { useAppStore } from '@/store/app-store';
import { useToastStore } from '@/store/toast-store';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const AxiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (err: any): err is AxiosError => {
  return err.isAxiosError;
};

AxiosClient.interceptors.request.use(
  (config) => {
    const store = useAppStore();

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
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT';
  payload?: object;
  path: string;
}

function buildQueryParams(filters: object | null | undefined): object {
  if (!filters) return {};
  const payload = Object.entries(filters)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => {
      if (Array.isArray(value) && !value.length) {
        return false;
      }
      return Boolean(value);
    })
    .reduce(
      (obj, [property, value]) => {
        obj[property] = value;
        return obj;
      },
      {} as Record<string, string | number | []>,
    );
  return payload;
}

export default function useAxios() {
  const error: Ref<string | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const status: Ref<number | null | undefined> = ref(null);
  const toastStore = useToastStore();

  const handleError = (err: unknown) => {
    if (isAxiosError(err)) {
      status.value = err.response!.status;
    } else {
      const message = 'An unexpected error occurred';
      error.value = message;
      status.value = null;
      toastStore.addToast({ type: 'error', message });
    }
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
        status.value = response.status;
        return response;
      }

      if (fetchParams.method === 'DELETE') {
        const response = await AxiosClient.delete(
          fetchParams.path,
          fetchParams.payload,
        );
        status.value = response.status;
        return response;
      }

      if (fetchParams.method === 'PUT') {
        const response = await AxiosClient.put(
          fetchParams.path,
          fetchParams.payload,
        );
        status.value = response.status;
        return response;
      }

      const response = await AxiosClient.get(fetchParams.path, {
        params: buildQueryParams(fetchParams.payload),
      });

      status.value = response.status;

      return response;
    } catch (err) {
      handleError(err);
      return undefined;
    } finally {
      loading.value = false;
    }
  }

  return { error, loading, fetchApi, status };
}
