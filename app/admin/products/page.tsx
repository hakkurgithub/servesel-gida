"use client";
import { useState, useEffect } from "react";
import { Package, Search, Edit, Trash2, Check, X, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Düzenleme Modu İçin State'ler
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Verileri Çek
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // HIZLI GÜNCELLEME (Aktif/Pasif)
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    // 1. Önce ekranı güncelle (Donmayı engeller, hız hissi verir)
    const newStatus = !currentStatus;
    setProducts(products.map(p => p.id === id ? { ...p, isActive: newStatus } : p));

    // 2. Arka planda kaydet
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: newStatus }),
      });
    } catch (error) {
      alert("Güncelleme başarısız oldu!");
      fetchProducts(); // Hata olursa eski haline döndür
    }
  };

  // ÜRÜN SİLME
  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
    setProducts(products.filter(p => p.id !== id)); // Listeden hemen sil
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  // ÜRÜN GÜNCELLEME (Form Gönderimi)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Listeyi güncelle
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    
    // Veritabanına yaz
    await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
    });

    setEditingProduct(null); // Modalı kapat
  };

  // Arama Filtresi
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      
      {/* BAŞLIK VE ARAMA */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="text-blue-600" /> Ürün Yönetimi
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Ürün Ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* ÜRÜN LİSTESİ */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${product.isActive ? 'border-green-500' : 'border-red-500'} flex flex-col md:flex-row items-center justify-between gap-4`}>
            
            {/* Ürün Bilgisi */}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category || "Kategori Yok"} | Stok: {product.stock}</p>
              <div className="text-blue-600 font-bold mt-1">{product.price} ₺</div>
              {product.link && (
                 <a href={product.link} target="_blank" className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">
                    <ExternalLink size={12}/> Tedarikçi Linki
                 </a>
              )}
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-center gap-3">
              
              {/* Aktif/Pasif Butonu */}
              <button 
                onClick={() => toggleStatus(product.id, product.isActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {product.isActive ? <Check size={14}/> : <X size={14}/>}
                {product.isActive ? "Aktif" : "Pasif"}
              </button>

              {/* Düzenle Butonu */}
              <button 
                onClick={() => setEditingProduct(product)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
              >
                <Edit size={20} />
              </button>

              {/* Sil Butonu */}
              <button 
                onClick={() => handleDelete(product.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DÜZENLEME MODALI (POP-UP) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Ürünü Düzenle</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              
              <div>
                <label className="text-xs font-bold text-gray-500">Ürün Adı</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={editingProduct.name} 
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-500">Fiyat</label>
                  <input type="number" className="w-full border p-2 rounded" 
                    value={editingProduct.price} 
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Stok</label>
                  <input type="number" className="w-full border p-2 rounded" 
                    value={editingProduct.stock} 
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Resim URL</label>
                <input className="w-full border p-2 rounded" 
                  value={editingProduct.image || ""} 
                  placeholder="https://..."
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Tedarikçi Linki</label>
                <input className="w-full border p-2 rounded" 
                  value={editingProduct.link || ""} 
                  placeholder="Link yapıştır..."
                  onChange={(e) => setEditingProduct({...editingProduct, link: e.target.value})}
                />
              </div>

              <div className="flex gap-2 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300">İptal</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}