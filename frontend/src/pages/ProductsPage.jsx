import { useEffect, useMemo, useState } from 'react';
import { getProductsApi } from '../api/productApi';
import { getCategoriesApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { FABRIC_OPTIONS } from '../constants/productOptions';

const initialFilters = {
  category: '',
  fabric: '',
  cut: '',
  season: '',
  gsm_min: 80,
  gsm_max: 400,
  status: '',
  search: ''
};

export default function ProductsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    return params;
  }, [filters]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesApi();
        setCategories(response.data.data);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getProductsApi(queryParams);
        setProducts(response.data.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [queryParams]);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[280px_1fr] md:px-8">
      <aside className="h-fit rounded-xl border border-brand-100 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold text-stone-900">Filters</h2>
        <div className="space-y-3">
          <input
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            placeholder="Search"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
          <select
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryID} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            value={filters.fabric}
            onChange={(e) => setFilters((prev) => ({ ...prev, fabric: e.target.value }))}
          >
            <option value="">All Fabrics</option>
            {FABRIC_OPTIONS.map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            value={filters.cut}
            onChange={(e) => setFilters((prev) => ({ ...prev, cut: e.target.value }))}
          >
            <option value="">All Cuts</option>
            <option value="slim">Slim</option>
            <option value="athletic">Athletic</option>
            <option value="regular">Regular</option>
          </select>
          <input
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            placeholder="Season"
            value={filters.season}
            onChange={(e) => setFilters((prev) => ({ ...prev, season: e.target.value }))}
          />
          <select
            className="w-full rounded border border-brand-200 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="new_arrival">New Arrival</option>
            <option value="active">Active</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <div>
            <label className="text-xs text-stone-600">GSM Min: {filters.gsm_min}</label>
            <input
              type="range"
              min="80"
              max="400"
              value={filters.gsm_min}
              className="w-full"
              onChange={(e) => setFilters((prev) => ({ ...prev, gsm_min: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs text-stone-600">GSM Max: {filters.gsm_max}</label>
            <input
              type="range"
              min="80"
              max="400"
              value={filters.gsm_max}
              className="w-full"
              onChange={(e) => setFilters((prev) => ({ ...prev, gsm_max: Number(e.target.value) }))}
            />
          </div>
        </div>
      </aside>

      <section>
        <ErrorAlert message={error} />
        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-stone-900">All Products</h1>
              <p className="text-sm text-stone-600">{products.length} items</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
