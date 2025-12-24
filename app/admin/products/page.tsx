"use client";

import Link from "next/link";
import { useState } from "react";

// Başlangıç Verileri
const initialProducts = [
  { id: 1, name: "Tam Yağlı Beyaz Peynir (Teneke)", price: 1250.00, stock: 45, category: "Süt Ürünleri" },
  { id: 2, name: "Siyah Zeytin (Gemlik) - 10kg", price: 890.00, stock: 20, category: "Zeytin" },
  { id: 3, name: "Tereyağı (Tuzsuz) - 1kg", price: 340.50, stock: 15, category: "Süt Ürünleri" },
  { id: 4, name: "Kaşar Peyniri (Taze) - 2kg", price: 680.00, stock: 32, category: "Süt Ürünleri" },
  { id: 5, name: "Domates Salçası - 5kg", price: 450.00, stock: 100, category: "Konserve" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  // 🔴 SİLME İŞLEVİ (ÇALIŞIYOR)
  const handleDelete = (id: number) => {
    if(confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // 🟢 YENİ ÜRÜN EKLEME (ÇALIŞIYOR)
  const handleAddProduct = () => {
    const name = prompt("Ürün Adı:");
    if (!name) return; // İptal edilirse dur
    
    const priceStr = prompt("Fiyat (₺):", "100");
    const price = parseFloat(priceStr || "0");
    
    const stockStr = prompt("Stok Adedi:", "10");
    const stock = parseInt(stockStr || "0");

    const category = prompt("Kategori:", "Genel");

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name: name,
      price: price,
      stock: stock,
      category: category || "Genel"
    };

    setProducts([newProduct, ...products]);
  };

  // 🔵 DÜZENLEME İŞLEVİ (ÇALIŞIYOR)
  const handleEdit = (id: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newName = prompt("Ürün adını düzenle:", product.name);
    if (newName === null) return; // İptal

    const newPriceStr = prompt("Fiyatı düzenle:", product.price.toString());
    const newStockStr = prompt("Stok adedini düzenle:", product.stock.toString());

    setProducts(products.map(p => {
        if (p.id === id) {
            return {
                ...p,
                name: newName,
                price: parseFloat(newPriceStr || "0"),
                stock: parseInt(newStockStr || "0")
            };
        }
        return p;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sol Menü */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Yönetim<span className="text-blue-500">Paneli</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors text-gray-300">Panel Özeti</Link>
          <Link href="/admin/products" className="block px-4 py-3 bg-blue-600 rounded-lg text-white">Ürün Yönetimi</Link>
          <Link href="/admin/orders" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors text-gray-300">Siparişler</Link>
          <Link href="/" className="block px-4 py-3 mt-8 border-t border-slate-700 hover:bg-slate-800 rounded-lg text-gray-400">← Siteye Dön</Link>
        </nav>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ürün Yönetimi</h1>
            <p className="text-gray-500">Stoktaki ürünleri düzenle veya yeni ürün ekle.</p>
          </div>
          <button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm active:scale-95 transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Ürün Ekle
          </button>
        </header>

        {/* Ürün Tablosu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-4">Ürün Adı</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Stok</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{p.name}</td>
                  <td className="p-4 text-gray-500"><span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">{p.category}</span></td>
                  <td className="p-4 font-bold text-slate-700">{p.price.toFixed(2)} ₺</td>
                  <td className="p-4">
                    {p.stock < 20 ? <span className="text-red-600 font-bold">{p.stock} Adet (Kritik)</span> : <span className="text-green-600">{p.stock} Adet</span>}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(p.id)} className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 hover:bg-blue-50 rounded">Düzenle</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}