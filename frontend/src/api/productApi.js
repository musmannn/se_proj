import api from './axiosInstance';

export const getProductsApi = (params) => api.get('/products', { params });
export const getProductApi = (id) => api.get(`/products/${id}`);
export const createProductApi = (payload) => api.post('/products', payload);
export const updateProductApi = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);
