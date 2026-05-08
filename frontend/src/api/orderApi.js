import api from './axiosInstance';

export const checkoutApi = (payload) => api.post('/orders/checkout', payload);
export const getOwnOrdersApi = () => api.get('/orders');
export const getOrderApi = (id) => api.get(`/orders/${id}`);
export const cancelOrderApi = (id) => api.put(`/orders/${id}/cancel`);
export const getAllOrdersApi = () => api.get('/orders/all');
export const updateOrderStatusApi = (id, payload) => api.put(`/orders/${id}/status`, payload);
