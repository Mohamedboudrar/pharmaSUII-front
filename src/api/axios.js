import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

export const API_BASE_URL = axiosInstance.defaults.baseURL;

// Request interceptor - inject token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pharma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pharma_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => axiosInstance.post('/api/v1/auth/login', data),
  register: (data) => axiosInstance.post('/api/v1/patient/auth/register', data),
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: () => axiosInstance.get('/api/v1/patient/prescriptions'),
  getById: (id) => axiosInstance.get(`/api/v1/patient/prescriptions/${id}`),
  upload: (formData, config) => axiosInstance.post('/api/v1/patient/prescriptions', formData, config),
  cancel: (id) => axiosInstance.patch(`/api/v1/patient/prescriptions/${id}/cancel`),
};
