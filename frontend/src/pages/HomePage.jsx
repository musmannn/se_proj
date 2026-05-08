import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsApi } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [featuredRes, arrivalsRes] = await Promise.all([
          getProductsApi({ status: 'active' }),
          getProductsApi({ status: 'new_arrival' })
        ]);
        setFeatured(featuredRes.data.data.slice(0, 4));
        setArrivals(arrivalsRes.data.data.slice(0, 4));
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load homepage');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <section className="mb-10 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 p-8 text-stone-100 md:p-12">
        <h1 className="mb-3 text-3xl font-semibold md:text-5xl">MTR: Premium Men&apos;s Apparel</h1>
        <p className="max-w-2xl text-sm text-brand-100 md:text-base">
          Contemporary menswear built with premium fabrics, refined cuts, and season-ready craftsmanship.
        </p>
      </section>

      <ErrorAlert message={error} />
      <section className="mb-8 rounded-xl border border-brand-100 bg-white p-4 md:p-5">
        <h2 className="mb-3 text-xl font-semibold text-stone-900">Quick Access</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Link to="/products" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
            Browse Catalog
          </Link>
          {user?.role === 'customer' && (
            <>
              <Link to="/cart" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Open Cart
              </Link>
              <Link to="/orders" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Track Orders
              </Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/products/new" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Add New Product
              </Link>
              <Link to="/admin/inventory" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Inventory Alerts
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Login
              </Link>
              <Link to="/register" className="rounded bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100">
                Create Account
              </Link>
            </>
          )}
        </div>
      </section>
      {loading ? (
        <Loader text="Loading products..." />
      ) : (
        <>
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-stone-900">Featured Products</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-stone-900">New Arrivals</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {arrivals.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
