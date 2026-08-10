"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId: string | null;
  title: string;
  variantLabel: string | null;
  priceCents: number;
  imageUrl: string | null;
  slug: string;
  quantity: number;
  maxQuantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  setCoupon: (code: string | null) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i === existing
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxQuantity) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...items, { ...item, quantity: Math.min(quantity, item.maxQuantity) }],
            isOpen: true,
          });
        }
      },
      removeItem: (productId, variantId) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }),
      updateQuantity: (productId, variantId, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),
      setCoupon: (code) => set({ couponCode: code }),
      clear: () => set({ items: [], couponCode: null }),
    }),
    { name: "peptidelab-cart" }
  )
);

export function useCartTotals() {
  const items = useCart((s) => s.items);
  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { subtotalCents, itemCount };
}
