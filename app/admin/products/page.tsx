"use client";
import { useState, useEffect } from "react";
import { Package, Search, Edit, Trash2, Check, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?time=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setProducts(products.map(p => p.id === id ? { ...p, isActive: newStatus } : p));
    await fetch("/api/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istiyor musunuz?")) return;
    setProducts(products.filter(p => p.id !== id)); 
    await fetch("/api/products", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    // Metin kutusundaki virgüllü linkleri listeye çevir
    const imagesArray = typeof editingProduct.images === 'string' 
        ? editingProduct.images.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "")
        : editingProduct.images;

    const payload = { ...editingProduct, images: imagesArray };

    await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const startNewProduct = () => {
    setEditingProduct({
        name: "", price: 0, stock: 0, description: "", 
        image: "", images: [], 
        link: "", category: "Genel", isActive: true
    });
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2"><Package className="text-blue-600" /> Ürün Yönetimi</h1>
        <div className="flex gap-2">
            <input type="text" placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-2 rounded-lg" />
            <button onClick={startNewProduct} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">+ Yeni Ürün</button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow border-l-4 flex items-center justify-between gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300 w-full h-full p-4" />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.price} ₺ | Stok: {product.stock}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(product.id, product.isActive)} className={`px-3 rounded-full text-xs font-bold ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.isActive ? "Aktif" : "Pasif"}</button>
              <button onClick={() => setEditingProduct(product)} className="p-2 hover:bg-gray-100 rounded"><Edit size={20} /></button>
              <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-gray-100 rounded text-red-500"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ürün Düzenle</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Ürün Adı" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" className="border p-2 rounded" placeholder="Fiyat" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} required />
                <input type="number" className="border p-2 rounded" placeholder="Stok" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} required />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500">Ana Resim URL</label>
                <input className="w-full border p-2 rounded" placeholder="https://..." value={editingProduct.image || ""} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Ek Resimler (Virgülle ayırarak)</label>
                <textarea 
                    className="w-full border p-2 rounded h-20 text-sm" 
                    placeholder="https://resim1.jpg, https://resim2.jpg"
                    value={Array.isArray(editingProduct.images) ? editingProduct.images.join(', ') : editingProduct.images || ""}
                    onChange={(e) => setEditingProduct({...editingProduct, images: e.target.value})}
                />
              </div>

              <input className="w-full border p-2 rounded" placeholder="Kategori" value={editingProduct.category || ""} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Tedarikçi Linki" value={editingProduct.link || ""} onChange={(e) => setEditingProduct({...editingProduct, link: e.target.value})} />
              
              <div className="flex gap-2 mt-4 pt-2 border-t">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-200 p-2 rounded">İptal</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}