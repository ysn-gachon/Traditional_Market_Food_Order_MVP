import React, { createContext, useContext, useMemo, useState } from 'react';
import type { MenuItem } from '../types/market';

type CartItem = {
  item: MenuItem;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  subtotal: number;
  totalQuantity: number;
  MIN_ORDER: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const MIN_ORDER = 13000; // 고정 최소 주문 금액

  const addItem = (menuItem: MenuItem, quantity = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.item.id === menuItem.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { item: menuItem, quantity }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems(prev => prev.filter(p => p.item.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    setItems(prev => prev.map(p => p.item.id === menuItemId ? { ...p, quantity } : p));
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.item.price * it.quantity, 0), [items]);
  const totalQuantity = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clear,
    updateQuantity,
    subtotal,
    totalQuantity,
    MIN_ORDER,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export type { CartItem };
