import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient"; 

export default async function DashboardPage() {
  // 1. Oturum Kontrolü
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/login"); // Giriş yapmamışsa login'e at
  }

  // 2. Kullanıcı Verisini Çek
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // 3. Ürünleri Veritabanından Çek
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });

  // 4. Client Bileşenine Gönder (Ekranı çizdir)
  return <DashboardClient user={user} products={products} />;
}