"use client";
import { useState, useEffect } from "react";
import { Package, Edit, Trash2, Plus, X, CheckCircle, XCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    isPublic: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // Formu Doldur (Düzenleme Modu)
  const handleEdit = (product: any) => {
    setForm({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image || "",
        description: product.description || "",
        isPublic: product.public
    });
    setIsEditing(true);
  };

  // Formu Sıfırla (Ekleme Modu)
  const handleCancel = () => {
    setForm({ id: null, name: "", price: "", stock: "", image: "", description: "", isPublic: true });
    setIsEditing(false);
  };

  // Kaydet (Ekle veya Güncelle)
  const handleSave = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
        alert(form.id ? "Ürün güncellendi!" : "Ürün eklendi!");
        fetchProducts();
        handleCancel();
    } else {
        alert("Hata oluştu!");
    }
  };

  // Sil
  const handleDelete = async (id: number) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (res.ok) fetchProducts();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Package size={32} /> Ürün Yönetimi
        </h1>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Plus size={20} /> Yeni Ürün Ekle
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM ALANI (Sol Taraf) */}
        {isEditing && (
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 sticky top-6">
                    <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                        {form.id ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                        <button onClick={handleCancel} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
                    </h2>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ürün Adı</label>
                            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Fiyat (TL)</label>
                                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Stok</label>
                                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border p-2 rounded" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Resim Linki (URL)</label>
                            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border p-2 rounded" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Ürün Açıklaması / Özellikler</label>
                            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-2 rounded h-24" placeholder="Ürün özellikleri..." />
                        </div>
                        <div className="flex items-center gap-2 py-2">
                            <input type="checkbox" id="public" checked={form.isPublic} onChange={e => setForm({...form, isPublic: e.target.checked})} className="w-5 h-5 text-blue-600" />
                            <label htmlFor="public" className="font-semibold cursor-pointer">Ürün Yayında (Aktif)</label>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">Kaydet</button>
                            <button type="button" onClick={handleCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300">İptal</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* LİSTE ALANI (Sağ Taraf - Form kapalıysa tam genişlik) */}
        <div className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                        <tr>
                            <th className="p-4">Resim</th>
                            <th className="p-4">Ürün Adı</th>
                            <th className="p-4">Fiyat</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                        {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={20} className="text-gray-400"/>}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-900">
                                    {p.name}
                                    <div className="text-xs text-slate-500">Stok: {p.stock}</div>
                                </td>
                                <td className="p-4 font-bold text-slate-700">{p.price} ₺</td>
                                <td className="p-4">
                                    {p.public ? (
                                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit"><CheckCircle size={14}/> Aktif</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full w-fit"><XCircle size={14}/> Pasif</span>
                                    )}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div className="p-8 text-center text-gray-500">Henüz ürün eklenmemiş.</div>}
            </div>
        </div>

      </div>
    </div>
  );
}