"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sayfa açılınca hafızadan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sepet her değiştiğinde hafızayı güncelle
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Miktar Artır
  const increaseQty = (id: string) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  // Miktar Azalt
  const decreaseQty = (id: string) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item;
      }
      return item;
    }));
  };

  // Ürünü Sil
  const removeItem = (id: string) => {
    if (confirm("Bu ürünü sepetten çıkarmak istiyor musunuz?")) {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  // Toplam Tutar
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // SİPARİŞİ TAMAMLA
  const completeOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            items: cart, 
            total: totalAmount 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Siparişiniz başarıyla alındı! Teşekkür ederiz.");
        setCart([]); // Sepeti boşalt
        localStorage.removeItem("cart"); // Hafızayı temizle
        router.push("/dashboard"); // Ana sayfaya dön
      } else {
        alert("❌ Hata: " + data.error);
      }
    } catch (error) {
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Başlık ve Geri Dön */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.push("/dashboard")} className="p-2 bg-white rounded-full shadow hover:bg-gray-100">
                <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Sepetim</h1>
        </div>

        {cart.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-400 text-xl mb-4">Sepetinizde ürün bulunmuyor.</p>
              <button onClick={() => router.push("/dashboard")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
                Alışverişe Başla
              </button>
           </div>
        ) : (
           <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Ürün Listesi */}
              <div className="flex-1 space-y-4">
                 {cart.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                        
                        {/* Resim */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Resim Yok</div>
                            )}
                        </div>

                        {/* Bilgi */}
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.price} ₺ / Adet</p>
                        </div>

                        {/* Miktar Kontrolü */}
                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                            <button onClick={() => decreaseQty(item.id)} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-100">
                                <Minus size={16} />
                            </button>
                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)} className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-100">
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Tutar ve Sil */}
                        <div className="flex items-center gap-6">
                            <span className="font-bold text-blue-600 text-lg w-24 text-right">
                                {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                            </span>
                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                 ))}
              </div>

              {/* Sipariş Özeti Kartı */}
              <div className="lg:w-80">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-10">
                      <h3 className="text-xl font-bold mb-6 text-slate-800">Özet</h3>
                      
                      <div className="flex justify-between mb-2 text-gray-600">
                          <span>Ara Toplam</span>
                          <span>{totalAmount.toLocaleString("tr-TR")} ₺</span>
                      </div>
                      <div className="flex justify-between mb-4 text-gray-600">
                          <span>KDV (%0)</span>
                          <span>0 ₺</span>
                      </div>
                      
                      <div className="border-t pt-4 mb-6">
                          <div className="flex justify-between text-2xl font-bold text-slate-800">
                              <span>Toplam</span>
                              <span>{totalAmount.toLocaleString("tr-TR")} ₺</span>
                          </div>
                      </div>

                      <button 
                        onClick={completeOrder} 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? "İşleniyor..." : (
                            <>
                                <CheckCircle size={20} /> Siparişi Onayla
                            </>
                        )}
                      </button>
                  </div>
              </div>

           </div>
        )}
      </div>
    </div>
  );
}