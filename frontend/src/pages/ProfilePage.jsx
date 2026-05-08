import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

export default function ProfilePage() {
  const { user, updateProfile, updatePassword, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  const onProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoadingProfile(true);
    try {
      await updateProfile(profileForm);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoadingPassword(true);
    try {
      await updatePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessage('Password updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h1 className="mb-5 text-2xl font-semibold">Profile</h1>
      <ErrorAlert message={error} />
      {message && <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-3">
        <Link to="/products" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
          Continue Shopping
        </Link>
        {user?.role === 'customer' && (
          <>
            <Link to="/cart" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
              Open Cart
            </Link>
            <Link to="/orders" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
              View Orders
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
              Open Admin
            </Link>
            <Link to="/admin/products/new" className="rounded border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
              Add Product
            </Link>
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form onSubmit={onProfileSubmit} className="rounded-lg border border-brand-100 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Edit Profile</h2>
          <input
            className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
            value={profileForm.name}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            type="email"
            className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
            value={profileForm.email}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={loadingProfile}
            className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:bg-stone-300"
          >
            {loadingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={onPasswordSubmit} className="rounded-lg border border-brand-100 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Change Password</h2>
          <input
            type="password"
            className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
            required
          />
          <input
            type="password"
            className="mb-3 w-full rounded border border-brand-200 px-3 py-2"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={loadingPassword}
            className="rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800 disabled:bg-stone-300"
          >
            {loadingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
