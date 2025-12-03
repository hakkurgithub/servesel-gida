import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Oturumu kontrol et (Sunucu tarafında)
  const session = await getServerSession(authOptions);

  // Eğer giriş yapılmamışsa, giriş sayfasına geri gönder
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        
        <h1 className="text-3xl font-bold text-green-600 mb-6">
          ✅ Giriş Başarılı!
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Admin Paneline Hoş Geldiniz
        </h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-700"><strong>Email:</strong> {session.user?.email}</p>
          <p className="text-gray-700"><strong>Rol:</strong> {session.user?.role || "Tanımsız"}</p>
          <p className="text-gray-700"><strong>Şirket:</strong> {session.user?.company || "Tanımsız"}</p>
        </div>

        <div className="mt-8">
            <a 
              href="/api/auth/signout" 
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              Çıkış Yap
            </a>
        </div>

      </div>
    </div>
  );
}