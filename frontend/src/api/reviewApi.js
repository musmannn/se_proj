import api from './axiosInstance';

export const createReviewApi = (payload) => api.post('/reviews', payload);
export const getReviewsByProductApi = (productId) => api.get(`/reviews/product/${productId}`);
export const getReviewInsightsApi = () => api.get('/reviews/insights');
