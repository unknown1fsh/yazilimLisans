import Link from "next/link";

export default function IletisimPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">İletişim</h1>
      <p className="mt-2 opacity-80">Bize her zaman ulaşabilirsiniz. Ortalama dönüş süremiz: 15 dakika.</p>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
          <div className="font-semibold">E-posta</div>
          <div className="text-sm opacity-80 mt-1">destek@ornek-lisans.com</div>
        </div>
        <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
          <div className="font-semibold">Telefon</div>
          <div className="text-sm opacity-80 mt-1">+90 555 000 00 00</div>
        </div>
        <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
          <div className="font-semibold">WhatsApp</div>
          <Link href="https://wa.me/905550000000" target="_blank" className="text-sm text-green-600 mt-1 underline">Hemen yazın</Link>
        </div>
      </section>

      <section className="mt-8 rounded-xl border p-6 bg-white dark:bg-neutral-900">
        <h2 className="text-xl font-semibold">Bize Yazın</h2>
        <form className="mt-4 grid grid-cols-1 gap-4 max-w-xl">
          <input className="rounded border px-3 py-2 bg-white dark:bg-neutral-900" placeholder="Ad Soyad" />
          <input className="rounded border px-3 py-2 bg-white dark:bg-neutral-900" placeholder="E-posta" type="email" />
          <textarea className="rounded border px-3 py-2 min-h-28 bg-white dark:bg-neutral-900" placeholder="Mesajınız" />
          <button type="button" className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">Gönder</button>
        </form>
      </section>
    </main>
  );
}


