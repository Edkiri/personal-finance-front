import { ref, Ref } from 'vue';
import axios, { AxiosResponse } from 'axios';

const AxiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
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

  async function fetchApi<T>(fetchParams: fetchParams): Promise<T | undefined> {
    try {
      loading.value = true;

      if (!fetchParams.method) {
        fetchParams.method = 'GET';
      }

      if (fetchParams.method === 'POST') {
        const response: AxiosResponse<T> = await AxiosClient.post(fetchParams.path, fetchParams.payload);    
        return response.data;
      }

      if (fetchParams.method === 'GET') {
        const response: AxiosResponse<T> = await AxiosClient.get(fetchParams.path, { params: fetchParams.payload });
        return response.data;
      }

    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, fetchApi };
};