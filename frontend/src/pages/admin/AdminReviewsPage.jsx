import { useEffect, useState } from 'react';
import { getReviewInsightsApi } from '../../api/reviewApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';

export default function AdminReviewsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getReviewInsightsApi();
        setInsights(response.data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load review insights');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AdminNav />
      <h1 className="mb-4 text-2xl font-semibold">Review Insights</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader text="Loading review insights..." />
      ) : (
        <>
          <div className="mb-4 rounded-lg border border-brand-100 bg-white p-4">
            <p className="text-sm text-stone-600">Overall Average Rating</p>
            <p className="text-2xl font-semibold text-brand-800">{insights?.avgRating}</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-50 text-left">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Average Rating</th>
                  <th className="px-3 py-2">Review Count</th>
                </tr>
              </thead>
              <tbody>
                {insights?.products?.map((item) => (
                  <tr key={item.productID} className="border-t border-brand-100">
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2">{item.avgRating}</td>
                    <td className="px-3 py-2">{item.reviewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
