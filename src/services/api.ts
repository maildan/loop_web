import { toast } from 'sonner';

const apiService = {
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // 토큰 삭제 및 로그인 페이지로 리디렉션
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('인증이 만료되었습니다. 다시 로그인해주세요.');
      // 페이지를 새로고침하여 로그인 페이지로 이동
      window.location.href = '/login'; 
      // 에러를 던져서 더 이상 진행되지 않도록 함
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || 'API request failed');
    }

    // 내용이 없는 응답(204 No Content 등) 처리
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
  },

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  patch<T>(path: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  },

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  },
};

export default apiService;
