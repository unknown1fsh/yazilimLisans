import Image from "next/image";
import { Suspense } from "react";
import Products from "@/app/ui/products";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">

      <section className="mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h2 className="text-3xl font-semibold">Uygun Fiyatlı Dijital Lisanslar</h2>
        <p className="mt-2 opacity-90">Anında teslimat, güvenli ödeme, %100 orijinal ürün.</p>
      </section>

      <section className="mt-10">
        <h3 className="mb-4 text-xl font-semibold">Bu Haftanın Popüler Ürünleri</h3>
        <Suspense fallback={<div>Yükleniyor...</div>}>
          {/* @ts-expect-error Async Server Component */}
          <Products />
        </Suspense>
      </section>
    </main>
  );
}
