"use client"; // Etkileşim (tıklama) olacağı için bu gereklidir

import Image from "next/image";
import { useCart, CartItem } from "@/components/CartProvider"; // Context'imizi çağırıyoruz

interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string; // Resim yolu
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart(); // CartProvider'dan ekleme fonksiyonunu al

  const handleAddToCart = () => {
    // Sepete eklenecek nesneyi hazırlıyoruz
    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // İlk eklemede miktar her zaman 1'dir
      image: product.image,
    };

    addToCart(itemToAdd); // Fonksiyonu çalıştır
    alert(`${product.name} sepete eklendi!`); // (İstersen sonra daha şık bir bildirim yaparız)
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-white flex flex-col items-center text-center">
      
      {/* Ürün Resmi (Örnek resim yoksa gri kutu gösterir) */}
      <div className="relative w-full h-40 mb-4 bg-gray-100 rounded-md overflow-hidden">
        {product.image ? (
            // Next.js Image optimizasyonu
           <Image 
             src={product.image} 
             alt={product.name} 
             fill 
             className="object-cover"
           />
        ) : (
          <span className="flex items-center justify-center h-full text-gray-400">Resim Yok</span>
        )}
      </div>

      {/* Ürün Bilgileri */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-green-600 font-bold text-xl mb-4">{product.price.toFixed(2)} ₺</p>

      {/* Sepete Ekle Butonu */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
      >
        <span>Sepete Ekle</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </button>
    </div>
  );
}