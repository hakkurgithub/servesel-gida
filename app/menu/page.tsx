// app/menu/page.tsx
"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

// Örnek veriler (Bunları ileride veritabanından çekeceğiz)
const initialProducts = [
  { id: 1, name: "Süzme Peynir (1kg)", price: 120.50, image: "" },
  { id: 2, name: "Siyah Zeytin (2kg)", price: 240.00, image: "" },
  { id: 3, name: "Tereyağı (500gr)", price: 185.90, image: "" },
  { id: 4, name: "Kaşar Peyniri (Teker)", price: 850.00, image: "" },
];

export default function MenuPage() {
  // Sayfa içinde ürünleri veya kategorileri yönetmek istersen state burada kalabilir
  const [products] = useState(initialProducts);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Toptan Ürünlerimiz</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          // useCart mantığı ProductCard'ın içinde gizlidir, burada çağırmaya gerek yok.
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}