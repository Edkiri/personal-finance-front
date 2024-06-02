import { ref, Ref } from 'vue';
import axios, { AxiosResponse } from 'axios';
import { useAuthStorage } from '@/auth/stores/useAuthStore';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

const AxiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

AxiosClient.interceptors.request.use(config => {
  const authStorage = useAuthStorage();
  if (authStorage.token) {
    config.headers.Authorization = `Bearer ${authStorage.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

interface fetchParams {
  method?: 'POST' | 'GET' | 'DELETE';
  payload?: any;
  path: string,
}

export default function useAxios() {
  const error: Ref<string | null> = ref(null);
  const loading: Ref<boolean> = ref(false);

  const handleError = (err: any) => {
    error.value = err.response?.data.message || 'An error occurred';
  };

  async function fetchApi<T>(fetchParams: fetchParams): Promise<AxiosResponse<T> | undefined> {
    try {
      loading.value = true;

      if (!fetchParams.method) {
        fetchParams.method = 'GET';
      }

      if (fetchParams.method === 'POST') {
        const response = await AxiosClient.post(fetchParams.path, fetchParams.payload);    
        return response;
      }

      if (fetchParams.method === 'GET') {
        const response = await AxiosClient.get(fetchParams.path, { params: fetchParams.payload });
        return response;
      }

      if (fetchParams.method === 'DELETE') {
        return AxiosClient.delete(fetchParams.path);
      }

    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, fetchApi };
};