import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';

export default function CartPage() {
  const { cart, loading, refreshCart, updateItem, removeItem } = useCart();
  const [error, setError] = useState('');

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader text="Loading cart..." />
      ) : (
        <>
          <div className="space-y-3">
            {cart.items?.map((item) => (
              <div key={item.cartItemID} className="rounded-lg border border-brand-100 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-stone-600">
                      Size: {item.size} • ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.cartItemID, Number(e.target.value))}
                      className="w-20 rounded border border-brand-200 px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.cartItemID)}
                      className="rounded border border-red-200 px-3 py-1 text-sm text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-brand-100 bg-white p-4">
            <p className="mb-2 text-lg font-semibold">Total: ${Number(cart.total || 0).toFixed(2)}</p>
            <Link
              to="/checkout"
              className={`inline-block rounded px-4 py-2 text-white ${cart.items?.length ? 'bg-brand-700 hover:bg-brand-800' : 'pointer-events-none bg-stone-300'}`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
