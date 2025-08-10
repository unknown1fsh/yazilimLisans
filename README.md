# yazilimLisans

Yazılım Lisans mağazası (Next.js 15, TypeScript, Tailwind, Prisma/MySQL)

Özellikler:
- Ürün/kategori listeleme
- Sepet, toplu ödeme (mock gateway) ve lisans otomatik teslimat
- Üyelik (Kişisel/Şirket), profil sayfası
- Iyzico entegrasyon altyapısı (mock yönlendirme)

Geliştirme:
```
npm install
npm run dev
```

Ortam değişkenleri `.env` örneği:
```
DATABASE_URL="mysql://root:12345@localhost:3306/yazilim_lisans"
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=YazilimLisans
```
