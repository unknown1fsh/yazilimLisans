import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Products from "@/app/ui/products";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="mt-4 overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
              <span className="size-2 rounded-full bg-emerald-400" />
              Anında Teslimat
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
              Dijital Yazılım Lisansı – Güvenilir, Hızlı, Uygun Fiyatlı
            </h1>
            <p className="mt-3 text-white/90">
              %100 orijinal lisans anahtarları. Satın alma sonrası saniyeler içinde teslim. 7/24 destek.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="#populer" className="rounded-lg bg-white text-blue-700 px-4 py-2 text-sm font-medium hover:bg-white/90">Popüler Ürünler</Link>
              <Link href="/guvenilirlik" className="rounded-lg bg-white/10 text-white px-4 py-2 text-sm font-medium hover:bg-white/20">Neden Biz?</Link>
            </div>
          </div>
          <div className="relative min-h-72">
            <Image src="/globe.svg" alt="Globe" fill className="object-cover opacity-80" />
          </div>
        </div>
      </section>

      {/* Güven Rozetleri */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "256-bit SSL", desc: "Güvenli ödeme" },
          { title: "Anında Teslim", desc: "Dakikalar içinde" },
          { title: "%100 Orijinal", desc: "Resmi lisans" },
          { title: "7/24 Destek", desc: "WhatsApp canlı" },
        ].map((b) => (
          <div key={b.title} className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
            <div className="text-sm font-semibold">{b.title}</div>
            <div className="text-xs opacity-70">{b.desc}</div>
          </div>
        ))}
      </section>

      {/* Popüler Ürünler */}
      <section id="populer" className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">Bu Haftanın Popüler Ürünleri</h3>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          {/* @ts-expect-error Async Server Component */}
          <Products />
        </Suspense>
      </section>

      {/* Sosyal Kanıt */}
      <section className="mt-14">
        <h3 className="text-xl font-semibold mb-4">Kullanıcı Yorumları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Murat K.", text: "Satın alır almaz lisans anahtarı geldi. Sorunsuz etkinleştirdim.", rating: 5 },
            { name: "Selin A.", text: "Fiyatlar çok uygun. Destek ekibi hızlı.", rating: 5 },
            { name: "Ahmet D.", text: "Office lisansım 1 dk içinde teslim edildi, güvenilir.", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-gray-200 dark:bg-neutral-800" />
                <div className="text-sm font-medium">{t.name}</div>
              </div>
              <div className="mt-2 text-sm opacity-80">{t.text}</div>
              <div className="mt-2 text-amber-500">{"★".repeat(t.rating)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp Destek Butonu */}
      <a
        href="https://wa.me/905550000000"
        target="_blank"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg hover:bg-green-600"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.48 0 .13 5.35.13 11.93c0 2.1.55 4.07 1.52 5.78L0 24l6.46-1.65a11.84 11.84 0 005.6 1.43h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.48-8.37zM12.07 21.2h-.01c-1.9 0-3.76-.51-5.39-1.48l-.39-.23-3.84.98 1.03-3.74-.25-.39a9.79 9.79 0 01-1.5-5.02c0-5.43 4.42-9.86 9.86-9.86 2.64 0 5.11 1.03 6.97 2.9a9.77 9.77 0 012.89 6.97c0 5.44-4.43 9.87-9.87 9.87zm5.42-7.37c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.18-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
        WhatsApp Destek
      </a>
    </main>
  );
}
