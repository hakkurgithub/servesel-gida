"use client"; // 👈 Hook kullandığımız için bu satır şart!

import Link from 'next/link';
import { useCart } from "@/components/CartProvider"; // CartProvider'dan veriyi çekiyoruz

export default function Header() {
  const { cartCount } = useCart(); // Sepetteki güncel ürün sayısını al

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      {/* Sol taraf: Logo veya Site İsmi */}
      <div className="text-xl font-bold">
        <Link href="/" className="text-blue-800 hover:text-blue-600 transition-colors">
            Servesel<span className="text-orange-500">Gıda</span>
        </Link>
      </div>

      {/* Sağ taraf: Sepet Butonu */}
      <nav>
        <Link href="/cart" className="relative p-2 group inline-block">
            {/* SVG İkonu */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors"
            >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>

            {/* Dinamik Bildirim Sayısı */}
            {/* Eğer sepette ürün varsa (cartCount > 0) bu kırmızı topu göster */}
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm border border-white">
                    {cartCount}
                </span>
            )}
        </Link>
      </nav>
    </header>
  );
}