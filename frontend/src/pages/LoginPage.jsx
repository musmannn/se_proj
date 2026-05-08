import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(form);
      const role = response.data.user.role;
      const target = role === 'admin' ? '/admin' : location.state?.from?.pathname || '/';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Login</h1>
      <ErrorAlert message={error} />
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-brand-100 bg-white p-5">
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:bg-stone-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm text-stone-600">
        No account?{' '}
        <Link to="/register" className="text-brand-700 hover:text-brand-800">
          Register
        </Link>
      </p>
    </div>
  );
}
