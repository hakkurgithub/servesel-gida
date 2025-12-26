import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 🟢 GET: Ürünleri Listele (En yeniden eskiye)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // DİKKAT: Yeni eklenenler en üstte görünür
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Ürünler çekilemedi" }, { status: 500 });
  }
}

// 🟡 POST: Yeni Ürün Ekle veya Güncelle
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Güvenlik: Sadece ADMIN işlem yapabilir
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz işlem! Admin olmalısın." }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description, price, image, category, stock, link, isActive } = body;

    // Fiyat ve Stok sayıya çevrilmeli
    const floatPrice = parseFloat(price);
    const intStock = parseInt(stock);

    let product;

    if (id) {
      // ID varsa GÜNCELLE
      product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: floatPrice,
          stock: intStock,
          image,
          category: category || "Genel",
          link: link || "", // Yeni link alanı
          isActive: isActive // Yeni aktiflik durumu
        },
      });
    } else {
      // ID yoksa YENİ EKLE
      product = await prisma.product.create({
        data: {
          name,
          description,
          price: floatPrice,
          stock: intStock,
          image,
          category: category || "Genel",
          link: link || "",
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "İşlem başarısız oldu" }, { status: 500 });
  }
}

// 🔴 DELETE: Ürün Sil
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

    const body = await req.json();
    await prisma.product.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ message: "Silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}