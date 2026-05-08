import { useEffect, useState } from 'react';
import { createCategoryApi, getCategoriesApi } from '../../api/categoryApi';
import AdminNav from '../../components/AdminNav';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCategoriesApi();
      setCategories(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createCategoryApi(form);
      setMessage('Category added successfully');
      setForm({ name: '', description: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <AdminNav />
      <h1 className="mb-4 text-2xl font-semibold">Manage Categories</h1>
      <ErrorAlert message={error} />
      {message && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

      <div className="mb-6 rounded-lg border border-brand-100 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Add Category</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-2 md:grid-cols-[240px_1fr_auto]">
          <input
            className="rounded border border-brand-200 px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Category name"
            required
          />
          <input
            className="rounded border border-brand-200 px-3 py-2"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:bg-stone-300"
          >
            {saving ? 'Saving...' : 'Add'}
          </button>
        </form>
      </div>

      {loading ? (
        <Loader text="Loading categories..." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-50 text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryID} className="border-t border-brand-100">
                  <td className="px-3 py-2 font-medium">{category.name}</td>
                  <td className="px-3 py-2 text-stone-600">{category.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
