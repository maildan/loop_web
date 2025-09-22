import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const isBackendDisabled = process.env.REACT_APP_BE_DISABLED === 'true';

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data, // 응답 데이터만 반환
  (error: AxiosError) => {
    if (!isBackendDisabled && error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // 다른 모든 오류는 그대로 반환하여 개별적으로 처리할 수 있도록 함
    return Promise.reject(error);
  }
);

export default api;
