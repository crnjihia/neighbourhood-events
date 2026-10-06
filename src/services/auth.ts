import * as SecureStore from './storage';
import { apiRequest } from './api';

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    requiresAuth: false,
  });

  if (data.token) {
    await SecureStore.setItemAsync('authToken', data.token);
  }
  if (data.id) {
    await SecureStore.setItemAsync('userId', data.id);
  }
  return data;
}

export async function login(email: string, password: string): Promise<string> {
  const data = await apiRequest<{ token: string; id: string; name: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    requiresAuth: false,
  });

  if (data.token) {
    await SecureStore.setItemAsync('authToken', data.token);
  }
  if (data.id) {
    await SecureStore.setItemAsync('userId', data.id);
  }
  return data.token;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('authToken');
  await SecureStore.deleteItemAsync('userId');
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync('authToken');
  } catch {
    return null;
  }
}
