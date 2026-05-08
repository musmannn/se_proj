import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-brand-800' : 'text-stone-700 hover:text-brand-700'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-brand-100 bg-stone-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="text-xl font-semibold tracking-wide text-brand-800">
          MTR
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          {user?.role === 'customer' && (
            <>
              <NavLink to="/cart" className={linkClass}>
                Cart ({cart.items?.length || 0})
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                Orders
              </NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
              <NavLink to="/admin/products/new" className={linkClass}>
                Add Product
              </NavLink>
            </>
          )}
          {token ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user?.name || 'Profile'}
              </NavLink>
              <button
                type="button"
                onClick={onLogout}
                className="rounded bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
