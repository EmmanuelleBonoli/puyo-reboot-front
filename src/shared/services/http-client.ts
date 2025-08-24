import { useAuthStore } from '../../Authentication/store/auth.store';
import { baseApiUrl } from '../models/sharedVariables.ts';

type RequestOptions = Omit<RequestInit, 'body'> & {
  auth?: boolean;
  body?: any;
};

export async function http<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const store = useAuthStore();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Ajoute automatiquement le token si auth = true
  if (options.auth && store.token) {
    headers['Authorization'] = `Bearer ${store.token}`;
  }

  //const fullUrl = url.startsWith('http') ? url : `${baseApiUrl}${url}`;
  const fullUrl = `${baseApiUrl}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    body: typeof options.body === 'object' ? JSON.stringify(options.body) : options.body,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'HTTP error');
  }

  const contentLength = response.headers.get('Content-Length');
  const contentType = response.headers.get('Content-Type');

  // ✅ Ne tente de parser en JSON que si la réponse contient quelque chose
  if (contentLength === '0' || response.status === 204 || !contentType?.includes('application/json')) {
    return {} as T;
  }

  return await response.json();
}
