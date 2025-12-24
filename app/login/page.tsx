"use client";
import { useState, Suspense } from "react"; // Suspense eklendi (Build hatası almamak için)
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

// 1. İç Bileşen (Form Mantığı Burada)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // HATA ÇÖZÜMÜ: Buraya soru işareti (?) ekledik
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (res?.error) {
      setError("Hatalı e-posta veya şifre!");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
             <input type="email" placeholder="E-Posta" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full pl-10 border p-3 rounded" required />
          </div>
          <div className="relative">
             <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
             <input type="password" placeholder="Şifre" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full pl-10 border p-3 rounded" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded font-bold hover:bg-blue-800 disabled:opacity-50">
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">Hesabın yok mu? <Link href="/register" className="text-blue-600 font-bold">Kayıt Ol</Link></p>
    </div>
  );
}

// 2. Ana Bileşen (Suspense ile Sarmaladık)
// Not: useSearchParams kullanıldığı için Suspense şarttır, yoksa yine build hatası alırsın.
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}