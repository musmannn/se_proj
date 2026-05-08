import { createContext, useContext, useMemo, useState } from 'react';
import { addCartItemApi, getCartApi, removeCartItemApi, updateCartItemApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!token || !user || user.role !== 'customer') {
      setCart({ items: [], total: 0 });
      return;
    }
    setLoading(true);
    try {
      const response = await getCartApi();
      setCart(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload) => {
    const response = await addCartItemApi(payload);
    setCart(response.data.data);
  };

  const updateItem = async (cartItemId, quantity) => {
    const response = await updateCartItemApi(cartItemId, { quantity });
    setCart(response.data.data);
  };

  const removeItem = async (cartItemId) => {
    const response = await removeCartItemApi(cartItemId);
    setCart(response.data.data);
  };

  const value = useMemo(
    () => ({ cart, loading, refreshCart, addItem, updateItem, removeItem }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
