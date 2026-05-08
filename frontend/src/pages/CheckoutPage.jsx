import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkoutApi } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, refreshCart } = useCart();
  const { user } = useAuth();
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    refreshCart();
  }, []);

  useEffect(() => {
    if (user) {
      setShippingDetails((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const requiredFields = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'country'];
  const isCheckoutReady = requiredFields.every((key) => String(shippingDetails[key] || '').trim()) && (cart.items?.length || 0) > 0;

  const updateField = (field, value) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const onCheckout = async () => {
    setError('');
    setCheckingOut(true);
    try {
      const response = await checkoutApi({ shippingDetails });
      await refreshCart();
      navigate('/checkout/success', { state: { order: response.data.data } });
    } catch (e) {
      setError(e.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <Loader text="Preparing checkout..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
      <ErrorAlert message={error} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-brand-100 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Shipping and Contact</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Full name" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.country} onChange={(e) => updateField('country', e.target.value)} placeholder="Country" />
            <input className="md:col-span-2 rounded border border-brand-200 px-3 py-2" value={shippingDetails.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} placeholder="Address line 1" />
            <input className="md:col-span-2 rounded border border-brand-200 px-3 py-2" value={shippingDetails.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} placeholder="Address line 2 (optional)" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.state} onChange={(e) => updateField('state', e.target.value)} placeholder="State/Region" />
            <input className="rounded border border-brand-200 px-3 py-2" value={shippingDetails.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} placeholder="Postal code" />
            <textarea className="rounded border border-brand-200 px-3 py-2 md:col-span-2" rows="3" value={shippingDetails.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Delivery notes (optional)" />
          </div>
        </div>

        <div className="rounded-lg border border-brand-100 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
          <div className="mb-3 space-y-2">
            {cart.items?.map((item) => (
              <div key={item.cartItemID} className="flex items-center justify-between text-sm">
                <span>{item.productName} ({item.size}) x {item.quantity}</span>
                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mb-4 border-t border-brand-100 pt-3 text-lg font-semibold">
            Total: ${Number(cart.total || 0).toFixed(2)}
          </div>
          <button
            type="button"
            disabled={!isCheckoutReady || checkingOut}
            onClick={onCheckout}
            className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {checkingOut ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
