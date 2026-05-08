import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummaryApi } from '../../api/adminApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getDashboardSummaryApi();
        setSummary(response.data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="mb-5 text-2xl font-semibold">Admin Dashboard</h1>
      <AdminNav />
      <ErrorAlert message={error} />
      {summary && (
        <>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-brand-100 bg-white p-4">
            <p className="text-sm text-stone-600">Total Products</p>
            <p className="text-2xl font-semibold text-brand-800">{summary.totalProducts}</p>
          </div>
          <div className="rounded-lg border border-brand-100 bg-white p-4">
            <p className="text-sm text-stone-600">Total Orders</p>
            <p className="text-2xl font-semibold text-brand-800">{summary.totalOrders}</p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Low Stock Alerts</p>
            <p className="text-2xl font-semibold text-red-700">{summary.lowStockCount}</p>
            <Link to="/admin/inventory" className="text-sm text-red-700 underline">
              View inventory alerts
            </Link>
          </div>
          <div className="rounded-lg border border-brand-100 bg-white p-4">
            <p className="text-sm text-stone-600">Average Rating</p>
            <p className="text-2xl font-semibold text-brand-800">{summary.avgRating}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Link to="/admin/products/new" className="rounded border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 hover:bg-brand-50">
            Create Product
          </Link>
          <Link to="/admin/orders" className="rounded border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 hover:bg-brand-50">
            Manage Orders
          </Link>
          <Link to="/admin/reviews" className="rounded border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 hover:bg-brand-50">
            View Review Insights
          </Link>
        </div>
        </>
      )}
    </div>
  );
}
