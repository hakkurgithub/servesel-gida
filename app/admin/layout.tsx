import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut, Home, AlertCircle } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Giriş yapmamışsa -> Login sayfasına at
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  // 2. Giriş yapmış ama ADMIN değilse -> Ekrana HATA bas (Yönlendirme yapma)
  if (session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <AlertCircle size={64} className="text-red-600 mb-4" />
        <h1 className="text-3xl font-bold text-red-800 mb-2">Yetkisiz Giriş!</h1>
        <p className="text-lg text-red-600 mb-6">
          Şu anki yetkiniz: <span className="font-bold bg-white px-2 py-1 rounded border border-red-200">{session.user?.role || "Bilinmiyor"}</span>
        </p>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 max-w-lg">
            <h3 className="font-bold text-slate-800 mb-2">Nasıl Çözülür?</h3>
            <p className="text-slate-600 mb-4">Admin panelini görmek için hesabını "Yönetici" yapmalısın.</p>
            <a href="/api/admin-yap" className="block w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                🚀 Beni Admin Yap (Tıkla)
            </a>
        </div>
        <Link href="/" className="mt-8 text-slate-500 hover:underline">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  // 3. Eğer ADMIN ise paneli göster
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded"><LayoutDashboard size={20} /></div>
            <h1 className="font-bold text-lg">Yönetim Paneli</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"><LayoutDashboard size={20} /> Genel Bakış</Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"><Package size={20} /> Ürünler</Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"><Users size={20} /> Kullanıcılar</Link>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm"><Home size={18} /> Siteye Dön</Link>
            <Link href="/api/auth/signout" className="flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition text-sm font-bold"><LogOut size={18} /> Çıkış Yap</Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}