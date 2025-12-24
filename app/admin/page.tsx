"use client";

import Link from "next/link";

export default function AdminDashboard() {
  // Veritabanı yerine şimdilik statik veriler kullanıyoruz
  const stats = {
    totalUsers: 124,
    totalProducts: 45,
    totalOrders: 18,
    totalRevenue: 28540.00
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sol Menü (Sidebar) */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Yönetim<span className="text-blue-500">Paneli</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 bg-blue-600 rounded-lg text-white">
            Panel Özeti
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
            Ürün Yönetimi
          </Link>
          <Link href="/admin/orders" className="block px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
            Siparişler
          </Link>
          <Link href="/" className="block px-4 py-3 mt-8 border-t border-slate-700 hover:bg-slate-800 rounded-lg text-gray-400">
            ← Siteye Dön
          </Link>
        </nav>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Genel Bakış</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin Kullanıcısı</span>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
              A
            </div>
          </div>
        </header>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Kullanıcı Sayısı */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Toplam Müşteri</h3>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>

          {/* Ürün Sayısı */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Aktif Ürünler</h3>
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3.75h3.75M12 7.5a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25m-6 0h6m-3.75 3.75h-1.5" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
          </div>

          {/* Sipariş Sayısı */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Bekleyen Sipariş</h3>
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
          </div>

          {/* Toplam Ciro */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Toplam Ciro</h3>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>

        {/* Son İşlemler Tablosu Örneği */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Son Siparişler</h2>
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 font-semibold">
              <tr>
                <th className="p-4">Müşteri</th>
                <th className="p-4">Tarih</th>
                <th className="p-4">Tutar</th>
                <th className="p-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">Ahmet Yılmaz</td>
                <td className="p-4">15.12.2024</td>
                <td className="p-4">1.250 ₺</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Tamamlandı</span></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">Servesel Market</td>
                <td className="p-4">14.12.2024</td>
                <td className="p-4">8.400 ₺</td>
                <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">Hazırlanıyor</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}