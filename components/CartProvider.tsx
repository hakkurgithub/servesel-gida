"use client"; // 👈 Bu satır çok önemli, React Hook'larını (useState vb.) kullanmamızı sağlar.

import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. Ürün Veri Tipi (Sepete eklenecek ürünün özellikleri)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// 2. Context Veri Tipi (Uygulamaya sunacağımız fonksiyonlar ve veriler)
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartCount: number; // Sepetteki toplam ürün sayısı
  cartTotal: number; // Sepetin toplam tutarı
}

// 3. Context'i oluşturuyoruz
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Provider Bileşeni (Uygulamayı sarmalayacak olan ana kapsayıcı)
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Ürün Ekleme Fonksiyonu
  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      // Ürün zaten sepette var mı kontrol et
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Varsa miktarını artır
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yoksa yeni ürün olarak ekle (başlangıç miktarı 1)
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Ürün Çıkarma Fonksiyonu
  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Sepeti Temizleme
  const clearCart = () => {
    setCartItems([]);
  };

  // Toplam ürün sayısı
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Toplam fiyat hesabı
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 5. Kendi Hook'umuz (Sayfalarda kullanmak için bunu çağıracağız)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};