import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwnOrdersApi } from '../api/orderApi';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getOwnOrdersApi();
        setOrders(response.data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="mb-4 text-2xl font-semibold">Order History</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader text="Loading orders..." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.orderID} className="rounded-lg border border-brand-100 bg-white p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">Order #{order.orderID}</p>
                  <p className="text-sm text-stone-600">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <div className="text-sm text-stone-700">
                  <p>Status: {order.status}</p>
                  <p>Total: ${Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <Link to={`/orders/${order.orderID}`} className="text-sm font-medium text-brand-700 hover:text-brand-800">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
