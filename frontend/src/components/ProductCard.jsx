import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const fallback = 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        src={product.imageUrl || fallback}
        alt={product.name}
        className="mb-4 h-44 w-full rounded-lg object-cover"
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold text-stone-900">{product.name}</h3>
        <span className="text-sm font-semibold text-brand-800">${Number(product.price).toFixed(2)}</span>
      </div>
      <p className="mb-1 text-sm text-stone-600">{product.categoryName}</p>
      <p className="mb-3 text-xs text-stone-500">
        {product.fabric} • {product.cut} • {product.gsm} GSM
      </p>
      <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
        <span className="rounded bg-brand-50 px-2 py-1 text-brand-700">{product.status}</span>
        <span>Rating: {Number(product.avgRating || 0).toFixed(1)}</span>
      </div>
      <Link
        to={`/products/${product.productID}`}
        className="inline-flex w-full items-center justify-center rounded bg-brand-700 px-3 py-2 text-sm font-medium text-white hover:bg-brand-800"
      >
        View Details
      </Link>
    </article>
  );
}
