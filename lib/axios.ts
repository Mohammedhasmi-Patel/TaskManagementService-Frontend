import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const TOKEN_KEY = "token";

export const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem(TOKEN_KEY);
            if (token && !config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
