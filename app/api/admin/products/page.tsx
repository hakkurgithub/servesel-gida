"use client";
import { useState, useEffect } from "react";
import { Package, Edit, Trash2, Plus, X, CheckCircle, XCircle, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State (Link ve isActive eklendi)
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    link: "",      // YENİ
    isActive: true // YENİ (isPublic yerine isActive kullandık veritabanı ile uyumlu olsun diye)
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products"); // API'den verileri çek
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Veri çekme hatası", error);
    } finally {
      setLoading(false);
    }
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
        link: product.link || "",     // YENİ
        isActive: product.isActive    // YENİ
    });
    setIsEditing(true);
    // Mobilde sayfayı yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Formu Sıfırla (Ekleme Modu)
  const handleCancel = () => {
    setForm({ id: null, name: "", price: "", stock: "", image: "", description: "", link: "", isActive: true });
    setIsEditing(false);
  };

  // Kaydet (Ekle veya Güncelle)
  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        
        if (res.ok) {
            alert(form.id ? "Ürün güncellendi!" : "Ürün eklendi!");
            fetchProducts(); // Listeyi yenile (En yeni en üste gelecek)
            handleCancel();
        } else {
            const errorData = await res.json();
            alert("Hata: " + (errorData.error || "Bilinmeyen hata"));
        }
    } catch (error) {
        alert("Sunucu bağlantı hatası!");
    }
  };

  // Sil
  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (res.ok) fetchProducts();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Package size={32} className="text-blue-600" /> Ürün Yönetimi
        </h1>
        {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all">
                <Plus size={20} /> Yeni Ürün Ekle
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM ALANI (Sol Taraf) */}
        {isEditing && (
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-blue-100 sticky top-6">
                    <h2 className="text-xl font-bold mb-4 flex justify-between items-center text-slate-800">
                        {form.id ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                        <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 bg-gray-50 p-1 rounded-full"><X size={20} /></button>
                    </h2>
                    
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Ürün Adı</label>
                            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                        
                        {/* YENİ: Link Alanı */}
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1">
                                <LinkIcon size={14}/> Ürün Linki / Tedarikçi URL
                            </label>
                            <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Fiyat (TL)</label>
                                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border border-gray-300 p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">Stok</label>
                                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full border border-gray-300 p-2 rounded" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Resim Linki (URL)</label>
                            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full border border-gray-300 p-2 rounded" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Açıklama</label>
                            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 p-2 rounded h-24" placeholder="Ürün özellikleri..." />
                        </div>
                        
                        {/* YENİ: Aktif/Pasif Kutusu */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                            <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 text-blue-600 rounded cursor-pointer" />
                            <label htmlFor="active" className="font-semibold cursor-pointer select-none text-gray-700">Ürün Yayında (Aktif)</label>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={handleCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">İptal</button>
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">Kaydet</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* LİSTE ALANI */}
        <div className={isEditing ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                        <tr>
                            <th className="