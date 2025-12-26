import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz Erişim" }, { status: 401 });
    }

    // Tüm verileri paralel çek (Daha hızlı çalışır)
    const [userCount, productCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(), // Eğer Order tablosunu henüz oluşturmadıysan burayı sil veya 0 yaz.
    ]);

    return NextResponse.json({
      totalUsers: userCount,
      totalProducts: productCount,
      totalOrders: orderCount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı" }, { status: 500 });
  }
}