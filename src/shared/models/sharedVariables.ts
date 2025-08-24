let baseURL: string;

if (import.meta.env.VITE_IS_ANDROID === 'true') {
  baseURL = import.meta.env.VITE_API_URL_LAN;
} else {
  baseURL = import.meta.env.VITE_API_URL_LOCAL;
}

export const baseApiUrl: string = baseURL;
