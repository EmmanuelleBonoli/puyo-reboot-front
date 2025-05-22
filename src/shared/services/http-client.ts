import {useAuthStore} from '../../Authentication/store/auth.store';

type RequestOptions = RequestInit & {
    auth?: boolean; // besoin d’Authorization: Bearer token ?
};

export async function http<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const store = useAuthStore();

    const baseApiUrl = import.meta.env.VITE_API_URL;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Ajoute automatiquement le token si auth = true
    if (options.auth && store.token) {
        headers['Authorization'] = `Bearer ${store.token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${baseApiUrl}${url}`;

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'HTTP error');
    }

    return await response.json();
}
