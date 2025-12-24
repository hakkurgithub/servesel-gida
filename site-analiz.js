const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
const srcPagesDir = path.join(process.cwd(), 'src', 'pages');

console.log("\n🔍 SİTE ANALİZİ BAŞLIYOR...\n");
console.log("------------------------------------------------");

// 1. Pages Router Kalıntısı Kontrolü
if (fs.existsSync(srcPagesDir)) {
    console.log("⚠️ UYARI: 'src/pages' klasörü bulundu!");
    console.log("   Next.js App Router kullanıyorsan bu klasör çakışma yaratabilir.");
    console.log("   Eğer içindekileri taşıdıysan, bu klasörü silmen önerilir.\n");
} else {
    console.log("✅ Temiz: 'src/pages' klasörü (eski yapı) yok. Harika.\n");
}

// 2. Rota Tarayıcı Fonksiyonu
function scanRoutes(dir, basePath = '') {
    if (!fs.existsSync(dir)) return [];

    const items = fs.readdirSync(dir, { withFileTypes: true });
    let routes = [];

    items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
            // Klasör ise içine gir (Recursive)
            // Parantezli klasörleri (ör: (auth)) yoksayma, rota ismine dahil etme
            const nextBasePath = item.name.startsWith('(') ? basePath : `${basePath}/${item.name}`;
            routes = [...routes, ...scanRoutes(fullPath, nextBasePath)];
        } else {
            // Dosya ise kontrol et
            if (item.name === 'page.tsx' || item.name === 'page.jsx') {
                const route = basePath === '' ? '/' : basePath;
                routes.push(`📄 SAYFA: http://localhost:3000${route}`);
            } else if (item.name === 'route.ts' || item.name === 'route.js') {
                routes.push(`⚡ API  : http://localhost:3000${basePath}`);
            }
        }
    });

    return routes;
}

// 3. Analizi Çalıştır
if (fs.existsSync(appDir)) {
    console.log("📂 MEVCUT ROTALAR (App Router):");
    const routes = scanRoutes(appDir);
    
    if (routes.length > 0) {
        routes.sort().forEach(r => console.log(r));
    } else {
        console.log("   ❌ Hiçbir sayfa bulunamadı. 'app' klasörü boş mu?");
    }
} else {
    console.log("❌ HATA: 'app' klasörü bulunamadı. Proje dizininde misin?");
}

console.log("\n------------------------------------------------");
console.log("✅ Analiz Tamamlandı.\n");