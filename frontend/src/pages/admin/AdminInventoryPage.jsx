import { useEffect, useState } from 'react';
import { getAllInventoryApi, updateInventoryApi } from '../../api/inventoryApi';
import Loader from '../../components/Loader';
import ErrorAlert from '../../components/ErrorAlert';
import AdminNav from '../../components/AdminNav';

export default function AdminInventoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllInventoryApi();
      setRows(response.data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChangeField = (inventoryID, field, value) => {
    setRows((prev) => prev.map((row) => (row.inventoryID === inventoryID ? { ...row, [field]: Number(value) } : row)));
  };

  const onSave = async (row) => {
    try {
      await updateInventoryApi(row.inventoryID, {
        stockQty: row.stockQty,
        safetyStock: row.safetyStock
      });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update inventory');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <AdminNav />
      <h1 className="mb-4 text-2xl font-semibold">Inventory Management</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader text="Loading inventory..." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-100 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-brand-50 text-left">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Stock Qty</th>
                <th className="px-3 py-2">Safety Stock</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.inventoryID}
                  className={`border-t border-brand-100 ${row.isLowStock ? 'bg-red-50' : ''}`}
                >
                  <td className="px-3 py-2">{row.productName}</td>
                  <td className="px-3 py-2">{row.size}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 rounded border border-brand-200 px-2 py-1"
                      value={row.stockQty}
                      onChange={(e) => onChangeField(row.inventoryID, 'stockQty', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="w-20 rounded border border-brand-200 px-2 py-1"
                      value={row.safetyStock}
                      onChange={(e) => onChangeField(row.inventoryID, 'safetyStock', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onSave(row)}
                      className="rounded border border-brand-200 px-2 py-1 text-xs"
                    >
                      Save
                    </button>
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
