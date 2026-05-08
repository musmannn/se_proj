import { useEffect, useState } from 'react';
import { getAllOrdersApi, updateOrderStatusApi } from '../../api/orderApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllOrdersApi();
      setOrders(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onStatusChange = async (orderID, status) => {
    try {
      await updateOrderStatusApi(orderID, { status });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AdminNav />
      <h1 className="mb-4 text-2xl font-semibold">All Orders</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader text="Loading all orders..." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-50 text-left">
              <tr>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderID} className="border-t border-brand-100">
                  <td className="px-3 py-2">#{order.orderID}</td>
                  <td className="px-3 py-2">{order.customerName}</td>
                  <td className="px-3 py-2">${Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-3 py-2">{order.status}</td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-brand-200 px-2 py-1"
                      value={order.status}
                      onChange={(e) => onStatusChange(order.orderID, e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
