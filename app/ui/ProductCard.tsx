"use client";
import React from "react";

type Props = {
  id: number;
  title: string;
  price: number | string;
};

export default function ProductCard({ id, title, price }: Props) {
  const addToCart = async () => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, quantity: 1 }),
    });
    if (res.ok) alert("Sepete eklendi");
    else alert("Giriş yapınız veya tekrar deneyiniz");
  };

  return (
    <div className="rounded-lg border p-4 bg-white dark:bg-neutral-900">
      <div className="aspect-video bg-gray-100 dark:bg-neutral-800 rounded mb-3 flex items-center justify-center">
        <span className="text-sm opacity-60">{title}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm opacity-70">{Number(price).toFixed(2)} TL</div>
        </div>
        <div className="flex items-center gap-2">
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="email" value="test@example.com" />
            <input type="hidden" name="provider" value="iyzico" />
            <input type="hidden" name="items" value={JSON.stringify([{ productId: id, quantity: 1 }])} />
            <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700">Satın Al</button>
          </form>
          <button onClick={addToCart} className="rounded bg-gray-800 px-3 py-2 text-white text-sm hover:bg-gray-900">Sepete Ekle</button>
        </div>
      </div>
    </div>
  );
}


