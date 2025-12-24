"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", company: "", taxNo: "", address: "", phone: "" });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/register", { // API'ye istek atıyoruz
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Bayi Başvurusu</h2>
        {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">{error}</div>}
        
        <input name="company" placeholder="Şirket Adı" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />
        <input name="email" type="email" placeholder="E-Posta" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />
        <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />
        <input name="taxNo" placeholder="Vergi No" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />
        <input name="phone" placeholder="Telefon" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />
        <textarea name="address" placeholder="Adres" onChange={handleChange} required className="w-full border p-2 mb-3 rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Kayıt Ol</button>
      </form>
    </div>
  );
}