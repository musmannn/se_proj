import api from './axiosInstance';

export const getCartApi = () => api.get('/cart');
export const addCartItemApi = (payload) => api.post('/cart/items', payload);
export const updateCartItemApi = (cartItemId, payload) => api.put(`/cart/items/${cartItemId}`, payload);
export const removeCartItemApi = (cartItemId) => api.delete(`/cart/items/${cartItemId}`);
