import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProductApi, getProductsApi } from '../../api/productApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProductsApi({ include_discontinued: 'true' });
      setProducts(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteProductApi(id);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to discontinue product');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AdminNav />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <Link to="/admin/products/new" className="rounded bg-brand-700 px-3 py-2 text-sm text-white hover:bg-brand-800">
          Add Product
        </Link>
      </div>
      <ErrorAlert message={error} />
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
        <Link to="/admin/products/new" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
          Create Product with Inventory
        </Link>
        <Link to="/admin/inventory" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
          Edit Inventory Stocks
        </Link>
        <Link to="/admin/orders" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
          Update Order Statuses
        </Link>
      </div>
      {loading ? (
        <Loader text="Loading products..." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-50 text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productID} className="border-t border-brand-100">
                  <td className="px-3 py-2">{product.name}</td>
                  <td className="px-3 py-2">{product.categoryName}</td>
                  <td className="px-3 py-2">${Number(product.price).toFixed(2)}</td>
                  <td className="px-3 py-2">{product.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/${product.productID}/edit`}
                        className="rounded border border-brand-200 px-2 py-1 text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(product.productID)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                      >
                        Discontinue
                      </button>
                    </div>
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
