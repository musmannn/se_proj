import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductApi } from '../api/productApi';
import { createReviewApi, getReviewsByProductApi } from '../api/reviewApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';

export default function ProductDetailPage() {
  const fallback = 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80';
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [productRes, reviewsRes] = await Promise.all([getProductApi(id), getReviewsByProductApi(id)]);
      setProduct(productRes.data.data);
      setReviews(reviewsRes.data.data);
      if (productRes.data.data.inventory?.length) {
        setSelectedSize(productRes.data.data.inventory[0].size);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const selectedStock = product?.inventory?.find((item) => item.size === selectedSize);

  const onAddToCart = async () => {
    setMessage('');
    setError('');
    try {
      await addItem({ productId: Number(id), size: selectedSize, quantity });
      setMessage('Added to cart');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add to cart');
    }
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await createReviewApi({ productId: Number(id), rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      setMessage('Review submitted');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <Loader text="Loading product details..." />;
  }

  if (!product) {
    return <div className="p-8">Product not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <ErrorAlert message={error} />
      {message && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <img
          src={product.imageUrl || fallback}
          alt={product.name}
          className="h-96 w-full rounded-xl object-cover"
        />
        <div>
          <h1 className="mb-2 text-3xl font-semibold text-stone-900">{product.name}</h1>
          <p className="mb-2 text-xl font-semibold text-brand-800">${Number(product.price).toFixed(2)}</p>
          <p className="mb-4 text-sm text-stone-600">
            {product.fabric} • {product.cut} • {product.season} • {product.gsm} GSM
          </p>
          <p className="mb-4 text-sm text-stone-600">Average rating: {Number(product.avgRating).toFixed(1)}</p>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Size</label>
            <select
              className="w-full rounded border border-brand-200 px-3 py-2"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.inventory.map((item) => (
                <option key={item.inventoryID} value={item.size}>
                  {item.size}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded border border-brand-200 px-3 py-2"
            />
          </div>

          <p className={`mb-4 text-sm font-medium ${selectedStock?.stockQty > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {selectedStock?.stockQty > 0 ? `In stock: ${selectedStock.stockQty}` : 'Out of stock'}
          </p>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={!user || user.role !== 'customer'}
            className="rounded bg-brand-700 px-5 py-2 text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>
        {reviews.length === 0 && <p className="text-sm text-stone-600">No reviews yet.</p>}
        <div className="space-y-3">
          {reviews.map((review) => (
            <article key={review.reviewID} className="rounded-lg border border-brand-100 bg-white p-4">
              <p className="mb-1 text-sm font-semibold text-stone-900">{review.userName}</p>
              <p className="mb-1 text-xs text-stone-500">Rating: {review.rating}/5</p>
              <p className="text-sm text-stone-700">{review.comment}</p>
            </article>
          ))}
        </div>

        {user?.role === 'customer' && (
          <form onSubmit={onSubmitReview} className="mt-6 rounded-lg border border-brand-100 bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold">Write a Review</h3>
            <select
              className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
            <textarea
              className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
              rows="3"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience"
              required
            />
            <button type="submit" className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800">
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
