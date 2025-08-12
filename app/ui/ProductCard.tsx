"use client";
import React from "react";
import { toast } from "sonner";

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
    if (res.ok) toast.success("Sepete eklendi");
    else toast.error("Giriş yapınız veya tekrar deneyiniz");
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
          <a
            href={`/checkout?items=${encodeURIComponent(JSON.stringify([{ productId: id, quantity: 1 }]))}`}
            className="rounded bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700"
          >
            Satın Al
          </a>
          <button onClick={addToCart} className="rounded bg-gray-800 px-3 py-2 text-white text-sm hover:bg-gray-900">Sepete Ekle</button>
        </div>
      </div>
    </div>
  );
}


