import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.API_URL || '';

export async function register(name: string, email: string, password: string): Promise<any> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const { token } = await response.json();
  await SecureStore.setItemAsync('authToken', token);
  return token;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync('authToken');
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('authToken');
}
