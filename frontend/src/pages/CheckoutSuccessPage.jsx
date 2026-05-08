import { Link, useLocation } from 'react-router-dom';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h1 className="mb-2 text-2xl font-semibold text-emerald-800">Order Placed Successfully</h1>
        <p className="mb-4 text-sm text-emerald-800">Your order has been placed and inventory has been reserved.</p>
        {order && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-white p-4 text-sm text-stone-700">
            <p><span className="font-medium">Order ID:</span> #{order.orderID}</p>
            <p><span className="font-medium">Status:</span> {order.status}</p>
            <p><span className="font-medium">Total:</span> ${Number(order.totalAmount).toFixed(2)}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Link to="/orders" className="rounded bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
            View Orders
          </Link>
          {order?.orderID && (
            <Link
              to={`/orders/${order.orderID}`}
              className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
            >
              Open Order Detail
            </Link>
          )}
          <Link to="/products" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
