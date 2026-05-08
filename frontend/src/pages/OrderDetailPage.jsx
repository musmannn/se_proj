import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cancelOrderApi, getOrderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOrderApi(id);
      setOrder(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onCancel = async () => {
    setError('');
    setMessage('');
    try {
      await cancelOrderApi(id);
      setMessage('Order cancelled successfully');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return <Loader text="Loading order detail..." />;
  }

  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  const addressLines = (order.shippingAddr || '').split('\n').filter(Boolean);

  const contactInfo = {
    fullName: addressLines[0] || '',
    email: addressLines[1] || '',
    phone: addressLines[2] || ''
  };

  const locationLines = addressLines.slice(3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <ErrorAlert message={error} />
      {message && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      <h1 className="mb-2 text-2xl font-semibold">Order #{order.orderID}</h1>
      <p className="mb-1 text-sm text-stone-600">Status: {order.status}</p>
      <p className="mb-4 text-sm text-stone-600">Total: ${Number(order.totalAmount).toFixed(2)}</p>

      <div className="mb-5 rounded-lg border border-brand-100 bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Delivery Details</h2>
        <div className="grid grid-cols-1 gap-1 text-sm text-stone-700 md:grid-cols-2">
          <p><span className="font-medium">Name:</span> {contactInfo.fullName || '-'}</p>
          <p><span className="font-medium">Email:</span> {contactInfo.email || '-'}</p>
          <p><span className="font-medium">Phone:</span> {contactInfo.phone || '-'}</p>
        </div>
        <div className="mt-3 text-sm text-stone-700">
          <p className="font-medium">Address</p>
          {locationLines.length ? locationLines.map((line) => <p key={line}>{line}</p>) : <p>-</p>}
        </div>
      </div>

      {user?.role === 'customer' && order.status === 'pending' && (
        <button
          type="button"
          onClick={onCancel}
          className="mb-5 rounded border border-red-200 px-3 py-2 text-sm text-red-700"
        >
          Cancel Order
        </button>
      )}

      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.orderItemID} className="rounded-lg border border-brand-100 bg-white p-4">
            <p className="font-medium">{item.productName}</p>
            <p className="text-sm text-stone-600">
              Size: {item.size} • Quantity: {item.quantity} • Unit: ${Number(item.unitPrice).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
