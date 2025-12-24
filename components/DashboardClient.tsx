"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, Package, CheckCircle, Send } from "lucide-react";

export default function DashboardClient({ user, products }: { user: any, products: any[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null); // Sipariş başarılı state'i

  // Sepete Ekle
  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Siparişi Kaydet ve Onay Ekranı Göster
  const handleOrder = async () => {
    if (cart.length === 0) return alert("Sepetiniz boş!");
    setLoading(true);

    try {
      const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      
      // 1. Veritabanına Kaydet
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, total }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. WhatsApp Mesajını Hazırla
      const telefonNo = "905333715577"; 
      const urunListesi = cart.map(i => `• ${i.name} (${i.qty} Adet)`).join('\n');
      const mesaj = `📦 *YENİ SİPARİŞ*\n` +
                    `🔢 Sipariş No: #${data.orderId}\n` +
                    `👤 Müşteri: ${user.company || user.name}\n` +
                    `💰 Toplam: ${total} TL\n\n` +
                    `🛒 *Ürünler:*\n${urunListesi}\n\n` +
                    `✅ Siparişi onaylıyor musunuz?`;

      const wpLink = `https://wa.me/${telefonNo}?text=${encodeURIComponent(mesaj)}`;
      
      // 3. Başarılı Ekranına Geç (Link ile birlikte)
      setOrderSuccess({
        id: data.orderId,
        link: wpLink,
        total: total
      });
      
      setCart([]); // Sepeti temizle

    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- EĞER SİPARİŞ BAŞARILIYSA BU EKRANI GÖSTER ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-2 border-green-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sipariş Kaydedildi!</h2>
          <p className="text-slate-500 mb-6">
            Siparişiniz sistemimize düştü. Şimdi son adım olarak WhatsApp üzerinden onay mesajını gönderin.
          </p>
          
          <a 
            href={orderSuccess.link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setOrderSuccess(null)} // Tıklayınca ana ekrana dön
            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-green-200/50"
          >
            <Send size={24} />
            WhatsApp ile Gönder
          </a>
          
          <button onClick={() => setOrderSuccess(null)} className="mt-4 text-sm text-slate-400 underline">
            WhatsApp kullanmıyorum, panele dön
          </button>
        </div>
      </div>
    );
  }

  // --- NORMAL PANEL EKRANI ---
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{user.company || user.email}</h1>
          <p className="text-xs text-slate-500">Hoşgeldiniz, {user.name || "Bayi"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingCart className="text-slate-600" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <button onClick={() => router.push("/api/auth/signout")} className="text-sm text-red-500 hover:underline flex items-center gap-1">
            <LogOut size={16} /> Çıkış
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ürün Kataloğu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-2">Stok: {product.stock} Adet</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-blue-600">{product.price} ₺</span>
                  <button onClick={() => addToCart(product)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sepete Ekle</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="col-span-2 p-8 text-center text-gray-500">Ürün bulunamadı.</div>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Package size={20} /> Sipariş Özeti</h2>
          {cart.length === 0 ? <p className="text-slate-400 text-center py-4">Sepetiniz boş.</p> : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.name} <span className="text-slate-400">x{item.qty}</span></span>
                  <span className="font-bold">{(item.price * item.qty).toLocaleString()} ₺</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-2 font-bold text-lg flex justify-between">
                <span>Toplam</span><span>{cart.reduce((acc, i) => acc + i.price * i.qty, 0).toLocaleString()} ₺</span>
              </div>
              <button onClick={handleOrder} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition mt-4 disabled:opacity-50">
                {loading ? "Kaydediliyor..." : "Siparişi Tamamla"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}