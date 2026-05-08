import api from './axiosInstance';

export const getInventoryByProductApi = (productId) => api.get(`/inventory/${productId}`);
export const updateInventoryApi = (inventoryId, payload) => api.put(`/inventory/${inventoryId}`, payload);
export const getInventoryAlertsApi = () => api.get('/inventory/alerts');
export const getAllInventoryApi = () => api.get('/inventory/all');
