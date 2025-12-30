import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { id, name, description, price, image, images, category, stock, link, isActive } = body;

  const floatPrice = parseFloat(price);
  const intStock = parseInt(stock);

  if (id) {
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price: floatPrice, stock: intStock, image, images, category, link, isActive },
    });
    return NextResponse.json(product);
  } else {
    let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9ğüşıöç-]/g, '') + "-" + Date.now();
    const product = await prisma.product.create({
      data: { name, slug, description, price: floatPrice, stock: intStock, image, images: images || [], category, link, isActive: isActive ?? true },
    });
    return NextResponse.json(product);
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  const body = await req.json();
  await prisma.product.delete({ where: { id: body.id } });
  return NextResponse.json({ message: "Silindi" });
}