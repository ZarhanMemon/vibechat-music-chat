import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
    withCredentials: true
});

// Add auth token to requests
axiosInstance.interceptors.request.use(async (config) => {
    try {
        if (window.Clerk && window.Clerk.session) {
            const token = await window.Clerk.session.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return Promise.reject(error);
    }
}, (error) => {
    return Promise.reject(error);
});