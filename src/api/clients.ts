import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const STORAGE_KEYS = {
    USER: 'laf_user',
    TICKET: 'laf_ticket',
} as const

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const ticket = sessionStorage.getItem(STORAGE_KEYS.TICKET);
        const userJson = sessionStorage.getItem(STORAGE_KEYS.USER)

        if (ticket && config.headers) {
            config.headers.Authorization = `Bearer ${ticket}`;
            config.headers['x-arx-ticket'] = ticket;
        }

        if (userJson && config.headers) {
            try {
                const user = JSON.parse(userJson);
                if (user?.username) {
                    config.headers['x-user-id'] = user.username;
                }
            } catch (e) {

            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string | string[]; error?: string }>) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            sessionStorage.removeItem(STORAGE_KEYS.USER);
            sessionStorage.removeItem(STORAGE_KEYS.TICKET);

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        const rawMessage = error.response?.data?.message;
        const formattedMessage = Array.isArray(rawMessage)
            ? rawMessage.join(', ')
            : rawMessage || error.message || 'An unexpected error occurred';

        return Promise.reject(new Error(formattedMessage));
    }
);

export default apiClient;