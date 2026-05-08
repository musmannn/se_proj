import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoriesApi } from '../../api/categoryApi';
import { createProductApi, getProductApi, updateProductApi } from '../../api/productApi';
import { updateInventoryApi } from '../../api/inventoryApi';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';
import { FABRIC_OPTIONS } from '../../constants/productOptions';

const sizes = ['S', 'M', 'L', 'XL'];

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    price: '',
    fabric: 'Cotton',
    cut: 'regular',
    season: '',
    gsm: '',
    status: 'active',
    categoryID: '',
    inventory: sizes.map((size) => ({ size, stockQty: 0, safetyStock: 0 }))
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const categoriesRes = await getCategoriesApi();
        setCategories(categoriesRes.data.data);

        if (isEdit) {
          const productRes = await getProductApi(id);
          const product = productRes.data.data;
          setForm({
            name: product.name,
            imageUrl: product.imageUrl || '',
            price: product.price,
            fabric: product.fabric,
            cut: product.cut,
            season: product.season,
            gsm: product.gsm,
            status: product.status,
            categoryID: product.categoryID,
            inventory: product.inventory
          });
        }
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load form data');
      }
    };
    load();
  }, [id, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isEdit) {
        await createProductApi(form);
      } else {
        await updateProductApi(id, form);
        await Promise.all(
          form.inventory.map((item) =>
            updateInventoryApi(item.inventoryID, {
              stockQty: Number(item.stockQty),
              safetyStock: Number(item.safetyStock)
            })
          )
        );
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryField = (size, field, value) => {
    setForm((prev) => ({
      ...prev,
      inventory: prev.inventory.map((item) => (item.size === size ? { ...item, [field]: value } : item))
    }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <AdminNav />
      <h1 className="mb-5 text-2xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <ErrorAlert message={error} />
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-brand-100 bg-white p-5">
        <input
          className="w-full rounded border border-brand-200 px-3 py-2"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <input
          className="w-full rounded border border-brand-200 px-3 py-2"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
        />
        {form.imageUrl && (
          <img src={form.imageUrl} alt={form.name || 'Preview'} className="h-48 w-full rounded-lg object-cover" />
        )}
        <input
          type="number"
          className="w-full rounded border border-brand-200 px-3 py-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
          required
        />
        <select
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.fabric}
          onChange={(e) => setForm((prev) => ({ ...prev, fabric: e.target.value }))}
          required
        >
          {FABRIC_OPTIONS.map((fabric) => (
            <option key={fabric} value={fabric}>
              {fabric}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.cut}
          onChange={(e) => setForm((prev) => ({ ...prev, cut: e.target.value }))}
        >
          <option value="slim">Slim</option>
          <option value="athletic">Athletic</option>
          <option value="regular">Regular</option>
        </select>
        <input
          className="w-full rounded border border-brand-200 px-3 py-2"
          placeholder="Season"
          value={form.season}
          onChange={(e) => setForm((prev) => ({ ...prev, season: e.target.value }))}
          required
        />
        <input
          type="number"
          className="w-full rounded border border-brand-200 px-3 py-2"
          placeholder="GSM"
          value={form.gsm}
          onChange={(e) => setForm((prev) => ({ ...prev, gsm: Number(e.target.value) }))}
          required
        />
        <select
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="new_arrival">New Arrival</option>
          <option value="active">Active</option>
          <option value="discontinued">Discontinued</option>
        </select>
        <select
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.categoryID}
          onChange={(e) => setForm((prev) => ({ ...prev, categoryID: Number(e.target.value) }))}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.categoryID} value={category.categoryID}>
              {category.name}
            </option>
          ))}
        </select>

        <div>
          <h2 className="mb-2 text-sm font-semibold">Inventory by Size</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {form.inventory.map((item) => (
              <div key={item.size} className="rounded border border-brand-100 p-3">
                <p className="mb-2 font-medium">{item.size}</p>
                <input
                  type="number"
                  className="mb-2 w-full rounded border border-brand-200 px-2 py-1"
                  placeholder="Stock Qty"
                  value={item.stockQty}
                  onChange={(e) => updateInventoryField(item.size, 'stockQty', Number(e.target.value))}
                />
                <input
                  type="number"
                  className="w-full rounded border border-brand-200 px-2 py-1"
                  placeholder="Safety Stock"
                  value={item.safetyStock}
                  onChange={(e) => updateInventoryField(item.size, 'safetyStock', Number(e.target.value))}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:bg-stone-300"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
