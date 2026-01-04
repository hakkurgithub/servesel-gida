import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Tohumlama (Seeding) başlıyor...')

  // 1. Önce bir Admin (Satıcı) Oluştur (Yoksa hata verir çünkü ürünün sahibi olması lazım)
  // E-posta adresini ve şifreyi değiştirebilirsin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@servesel.com' },
    update: {},
    create: {
      email: 'admin@servesel.com',
      name: 'Servesel Admin',
      password: 'admin', // Gerçekte hashlenmeli ama test için böyle kalsın
      role: 'ADMIN',
      company: 'Servesel Merkez',
      phone: '05555555555',
      isApproved: true,
    },
  })

  console.log(`👤 Admin kullanıcısı hazır: ${admin.id}`)

  // 2. Örnek Ürün Verileri (Yeni Şemaya Uygun)
  const products = [
    {
      name: 'Aydın Zeytinyağı 5 Lt Teneke',
      slug: 'aydin-zeytinyagi-5-lt-teneke',
      description: 'Doğal sızma, asitsiz zeytinyağı.',
      price: 2150,
      stock: 50,
      image: 'https://placehold.co/600x400/png?text=Zeytinyagi',
      images: [],
      category: 'Gıda',
      isActive: true,
      sellerId: admin.id, // <-- ARTIK NUMBER DEĞİL, STRING ID
    },
    {
      name: 'Domates Salçası 19 Lt Kova',
      slug: 'domates-salcasi-19-lt-kova',
      description: 'Güneşte kurutulmuş, katkısız salça.',
      price: 2000,
      stock: 100,
      image: 'https://placehold.co/600x400/png?text=Salca',
      images: [],
      category: 'Gıda',
      isActive: true,
      sellerId: admin.id,
    },
    {
      name: 'Purnell Safran',
      slug: 'purnell-safran',
      description: 'Orijinal safran.',
      price: 2850,
      stock: 20,
      image: 'https://placehold.co/600x400/png?text=Safran',
      images: [],
      category: 'Baharat',
      isActive: true,
      sellerId: admin.id,
    },
  ]

  // 3. Ürünleri Veritabanına Yaz
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  console.log(`✅ ${products.length} adet ürün eklendi.`)
  console.log('🚀 Tohumlama tamamlandı.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })