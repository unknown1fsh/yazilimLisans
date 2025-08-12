export default function GuvenilirlikPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Neden Bize Güvenmelisiniz?</h1>
      <p className="mt-3 opacity-80">
        Dijital Yazılım Lisansı satışı konusunda şeffaf, hızlı ve güvenilir bir deneyim sunuyoruz. Tüm lisanslar %100 orijinaldir ve üretici onaylıdır.
      </p>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          title: "%100 Orijinal Lisans",
          desc: "Ürün anahtarları resmî tedarik kanallarından temin edilir.",
        },{
          title: "Anında Teslimat",
          desc: "Ödeme sonrası saniyeler içinde lisans anahtarınız e-postanıza gönderilir.",
        },{
          title: "7/24 Destek",
          desc: "WhatsApp ve e-posta üzerinden gerçek kişi desteği.",
        }].map((b) => (
          <div key={b.title} className="rounded-xl border p-5 bg-white dark:bg-neutral-900">
            <div className="text-base font-semibold">{b.title}</div>
            <div className="text-sm opacity-70 mt-1">{b.desc}</div>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-xl border p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl font-semibold">Müşteri Memnuniyeti Politikası</h2>
        <ul className="list-disc pl-5 mt-3 space-y-1 text-sm opacity-90">
          <li>14 gün iade/değişim garantisi (kullanılmamış anahtarlar için).</li>
          <li>Teslimat sorunlarında anında yeniden gönderim veya iade.</li>
          <li>Güvenli ödeme altyapısı ve KVKK uyumlu veri işleme.</li>
        </ul>
      </section>

      <section className="mt-10 rounded-xl border p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl font-semibold">Yasal ve Belgeler</h2>
        <p className="mt-2 text-sm opacity-80">
          Satın aldığınız lisans anahtarları, ilgili yazılım sağlayıcılarının lisans anlaşmalarına uygun şekilde sunulmaktadır. Talep halinde fatura düzenlenir.
        </p>
      </section>
    </main>
  );
}


