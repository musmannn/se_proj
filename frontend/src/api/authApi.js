import api from './axiosInstance';

export const registerApi = (payload) => api.post('/auth/register', payload);
export const loginApi = (payload) => api.post('/auth/login', payload);
export const getProfileApi = () => api.get('/auth/profile');
export const updateProfileApi = (payload) => api.put('/auth/profile', payload);
export const updatePasswordApi = (payload) => api.put('/auth/profile/password', payload);
