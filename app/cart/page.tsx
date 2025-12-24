"use client";

import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// 👇 BURAYI KENDİ NUMARANLA DEĞİŞTİR
const WHATSAPP_NUMBER = "905333715577"; 

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const [customerName, setCustomerName] = useState("");

  const handleWhatsAppOrder = () => {
    if (!customerName.trim()) {
      alert("Lütfen sipariş vermeden önce Adınızı veya Firma Adınızı giriniz.");
      return;
    }

    let message = `*YENİ SİPARİŞ TALEBİ* \n`;
    message += `Tarih: ${new Date().toLocaleDateString('tr-TR')} \n`;
    message += `Müşteri: *${customerName.toUpperCase()}* \n`; 
    message += `----------------------------\n`;

    cartItems.forEach((item) => {
      message += `- *${item.name}* \n`;
      message += `  ${item.quantity} Adet x ${item.price.toFixed(2)} ₺ \n`;
      message += `  (Toplam: ${(item.price * item.quantity).toFixed(2)} ₺) \n\n`;
    });

    const kdv = cartTotal * 0.01;
    const genelToplam = cartTotal + kdv;

    message += `----------------------------\n`;
    message += `Ara Toplam: ${cartTotal.toFixed(2)} ₺\n`;
    message += `KDV (%1): ${kdv.toFixed(2)} ₺\n`;
    message += `*GENEL TOPLAM: ${genelToplam.toFixed(2)} ₺*\n`;
    message += `----------------------------\n`;
    message += `Lütfen siparişimi onaylayınız.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // --- GÖRÜNÜM KISMI ---

  // Durum 1: Sepet Boşsa
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sepetinizde ürün bulunmuyor.</h2>
        <Link href="/menu" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  // Durum 2: Sepet Doluysa
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Alışveriş Sepetim</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sol Taraf: Ürün Listesi */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <div className="col-span-6">Ürün</div>
              <div className="col-span-2 text-center">Fiyat</div>
              <div className="col-span-2 text-center">Adet</div>
              <div className="col-span-2 text-center">Toplam</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-xs text-gray-400">Resim Yok</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline mt-1 font-semibold">
                      [Kaldır]
                    </button>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 md:text-center text-sm text-gray-600">
                  <span className="md:hidden font-bold">Birim Fiyat: </span>{item.price.toFixed(2)} ₺
                </div>
                <div className="col-span-1 md:col-span-2 md:text-center text-sm">
                  <span className="md:hidden font-bold">Adet: </span>x {item.quantity}
                </div>
                <div className="col-span-1 md:col-span-2 md:text-center font-bold text-gray-800">
                   {(item.price * item.quantity).toFixed(2)} ₺
                </div>
              </div>
            ))}
          </div>
          <button onClick={clearCart} className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
            Sepeti Temizle
          </button>
        </div>

        {/* Sağ Taraf: Sipariş Özeti */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sipariş Özeti</h2>
            
            <div className="flex justify-between items-center mb-2 text-gray-600">
              <span>Ara Toplam</span>
              <span>{cartTotal.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>KDV (%1)</span>
              <span>{(cartTotal * 0.01).toFixed(2)} ₺</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold text-blue-900">
                <span>Genel Toplam</span>
                <span>{(cartTotal * 1.01).toFixed(2)} ₺</span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Adınız / Firma Adınız <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Örn: Servesel Market"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors text-center"
            >
              WhatsApp ile Sipariş Ver
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              "Sipariş Ver" butonuna tıkladığınızda WhatsApp uygulaması açılacaktır.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}