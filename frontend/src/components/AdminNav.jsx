import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/products/new', label: 'Add Product' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reviews', label: 'Reviews' }
];

export default function AdminNav() {
  return (
    <div className="mb-5 rounded-lg border border-brand-100 bg-white p-3">
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-800 hover:bg-brand-100'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
