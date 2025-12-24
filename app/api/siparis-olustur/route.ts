import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import twilio from "twilio";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, cart } = body;

    // 1. Kullanıcıyı Bul
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
        return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 400 });
    }

    // 2. Veritabanına Kaydet
    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    const newOrder = await prisma.order.create({
      data: {
        userId: dbUser.id,
        items: JSON.stringify(cart),
        total: total,
        status: "Hazırlanıyor",
      },
    });

    // --- BİLDİRİM SİSTEMİ ---

    const mesajMetni = `
    📦 YENİ SİPARİŞ! (No: #${newOrder.id})
    👤 Müşteri: ${dbUser.company || dbUser.email} 
    📞 Telefon: ${dbUser.phone || "Yok"}
    💰 Tutar: ${total} TL
    `;
    // Yukarıdaki satırda "dbUser.name" yerine "dbUser.company" yapıldı.

    // A) Email Gönder
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: 'kurt.hakki@gmail.com',
                subject: `Yeni Sipariş: #${newOrder.id}`,
                text: mesajMetni,
            });
            console.log("Email gönderildi.");
        } catch (e) {
            console.error("Email hatası:", e);
        }
    }

    // B) WhatsApp Gönder
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+905333715577', 
                body: mesajMetni
            });
            console.log("WhatsApp gönderildi.");
        } catch (e) {
            console.error("WhatsApp hatası:", e);
        }
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error: any) {
    console.error("Sipariş Hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız: " + error.message }, { status: 500 });
  }
}