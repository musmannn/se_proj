import api from './axiosInstance';

export const getCategoriesApi = () => api.get('/categories');
export const createCategoryApi = (payload) => api.post('/categories', payload);
