import * as SecureStore from './storage';

const DEFAULT_API_URL = 'http://localhost:4000';

export function getApiBaseUrl(): string {
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.API_URL ||
    DEFAULT_API_URL
  );
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.requiresAuth !== false) {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // SecureStore may fail in test environments
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error || errorJson.message) {
        errorMessage = errorJson.error || errorJson.message;
      }
    } catch {
      // Keep default message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
