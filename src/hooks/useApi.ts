import { useCallback } from 'react';
import { useAuthStore, useUiStore } from '@/lib/store';
import type { ApiResponse, PaginatedResponse, Assistant, Order, User } from '@/types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

interface RefreshResponse {
  user: User;
  tokens: AuthTokens;
}

export function useApi() {
  const { token } = useAuthStore();
  const { setLoading, setError } = useUiStore();

  const apiCall = useCallback(
    async <T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`/api${endpoint}`, {
          ...options,
          headers,
        });

        if (!response.ok) {
          throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success) {
          throw new ApiError(400, data.error || 'API call failed');
        }

        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, setLoading, setError]
  );

  const get = useCallback(
    <T>(endpoint: string): Promise<ApiResponse<T>> => {
      return apiCall<T>(endpoint);
    },
    [apiCall]
  );

  const post = useCallback(
    <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
      return apiCall<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiCall]
  );

  const put = useCallback(
    <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
      return apiCall<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiCall]
  );

  const patch = useCallback(
    <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
      return apiCall<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiCall]
  );

  const del = useCallback(
    <T>(endpoint: string): Promise<ApiResponse<T>> => {
      return apiCall<T>(endpoint, {
        method: 'DELETE',
      });
    },
    [apiCall]
  );

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    apiCall,
  };
}

// Specialized hooks for different entities
export function useAuthApi() {
  const api = useApi();
  const { login, logout, refreshToken } = useAuthStore();

  const loginUser = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      if (response.data && response.data.tokens) {
        login(response.data.user, response.data.tokens.accessToken, response.data.tokens.refreshToken);
      }
      return response;
    },
    [api, login]
  );

  const registerUser = useCallback(
    async (userData: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) => {
      const response = await api.post<RegisterResponse>('/auth/register', userData);
      if (response.data && response.data.tokens) {
        login(response.data.user, response.data.tokens.accessToken, response.data.tokens.refreshToken);
      }
      return response;
    },
    [api, login]
  );

  const logoutUser = useCallback(async () => {
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      } else {
        await api.post('/auth/logout');
      }
    } finally {
      logout();
    }
  }, [api, logout, refreshToken]);

  const refreshTokenFunc = useCallback(async () => {
    const response = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });
    if (response.data && response.data.tokens) {
      login(response.data.user, response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return response;
  }, [api, login, refreshToken]);

  return {
    loginUser,
    registerUser,
    logoutUser,
    refreshToken: refreshTokenFunc,
  };
}

export function useAssistantsApi() {
  const api = useApi();

  const getAssistants = useCallback(
    (params?: { category?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const query = queryParams.toString();
      return api.get<PaginatedResponse<Assistant>>(`/assistants${query ? `?${query}` : ''}`);
    },
    [api]
  );

  const getAssistant = useCallback(
    (id: string) => {
      return api.get(`/assistants/${id}`);
    },
    [api]
  );

  const createOrder = useCallback(
    (assistantId: string, orderData: unknown) => {
      return api.post(`/assistants/${assistantId}/orders`, orderData);
    },
    [api]
  );

  return {
    getAssistants,
    getAssistant,
    createOrder,
  };
}

export function useOrdersApi() {
  const api = useApi();

  const getOrders = useCallback(
    (params?: { page?: number; limit?: number; status?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.status) queryParams.set('status', params.status);

      const query = queryParams.toString();
      return api.get<PaginatedResponse<Order>>(`/orders${query ? `?${query}` : ''}`);
    },
    [api]
  );

  const getOrder = useCallback(
    (id: string) => {
      return api.get(`/orders/${id}`);
    },
    [api]
  );

  const cancelOrder = useCallback(
    (id: string) => {
      return api.patch(`/orders/${id}/cancel`);
    },
    [api]
  );

  return {
    getOrders,
    getOrder,
    cancelOrder,
  };
}
