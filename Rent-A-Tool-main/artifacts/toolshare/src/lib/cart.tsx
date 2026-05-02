import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Tool } from "@workspace/api-client-react";

export interface CartItem {
  tool: Tool;
  days: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (tool: Tool) => void;
  removeFromCart: (toolId: number) => void;
  updateDays: (toolId: number, days: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (toolId: number) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((tool: Tool) => {
    setItems(prev => {
      if (prev.find(i => i.tool.id === tool.id)) return prev;
      return [...prev, { tool, days: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((toolId: number) => {
    setItems(prev => prev.filter(i => i.tool.id !== toolId));
  }, []);

  const updateDays = useCallback((toolId: number, days: number) => {
    setItems(prev => prev.map(i => i.tool.id === toolId ? { ...i, days: Math.max(1, days) } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback((toolId: number) => items.some(i => i.tool.id === toolId), [items]);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.tool.pricePerDay * i.days, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateDays, clearCart, totalItems, totalPrice, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
