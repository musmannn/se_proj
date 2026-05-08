import api from './axiosInstance';

export const getDashboardSummaryApi = () => api.get('/admin/dashboard');
