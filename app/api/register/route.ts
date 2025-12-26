import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Gelen veriyi Zod ile kontrol et
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        // DÜZELTME: .errors yerine .issues kullanıyoruz
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, company, taxNo, address, phone } = validation.data;

    // 2. E-posta daha önce alınmış mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanımda." },
        { status: 400 }
      );
    }

    // 3. Şifreyi şifrele (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company,
        taxNo,
        address,
        phone,
        role: "BUYER", // Varsayılan rol
      },
    });

    // Şifreyi geri dönüşten çıkar (Güvenlik)
    // Not: user değişkeninden password'ü ayırıyoruz
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Kayıt başarılı!", user: userWithoutPassword },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json(
      { error: "Kayıt oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}