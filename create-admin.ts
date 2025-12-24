const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Şifreyi şifrele
  const password = "170105"; 
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Kullanıcı oluşturuluyor...");

  // Kullanıcıyı oluştur veya varsa güncelle
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      company: 'Yönetim',
      role: 'ADMIN',        
      taxNo: '1111111111', 
      address: 'Merkez Yönetim Ofisi', 
      phone: '05333715577',
    },
  });

  console.log(`✅ İşlem Başarılı! Admin: ${user.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Hata:", e);
    await prisma.$disconnect();
    process.exit(1);
  });