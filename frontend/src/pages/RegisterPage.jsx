import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await register(form);
      setMessage('Registration successful. You can now log in.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-5 text-2xl font-semibold">Register</h1>
      <ErrorAlert message={error} />
      {message && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-brand-100 bg-white p-5">
        <input
          required
          placeholder="Full name"
          className="w-full rounded border border-brand-200 px-3 py-2"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-3 text-sm text-stone-600">
        Already registered?{' '}
        <Link to="/login" className="text-brand-700 hover:text-brand-800">
          Login
        </Link>
      </p>
    </div>
  );
}
