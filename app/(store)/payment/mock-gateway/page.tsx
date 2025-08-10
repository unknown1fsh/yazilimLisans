"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MockGateway() {
  const router = useRouter();
  const sp = useSearchParams();
  const orderId = sp.get("orderId");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) router.replace("/");
  }, [orderId, router]);

  const paySuccess = async () => {
    if (!orderId) return;
    setLoading(true);
    // Ödeme başarılı: mock olarak /api/webhooks/payment'a PAID bildirimi gönderelim
    await fetch("/api/webhooks/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: Number(orderId), status: "PAID", paymentRef: `MOCK-${orderId}` }),
    });
    alert("Ödeme başarılı, lütfen mail adresinizi kontrol ediniz.");
    router.replace(`/payment/${orderId}`);
  };

  const payFail = async () => {
    if (!orderId) return;
    setLoading(true);
    await fetch("/api/webhooks/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: Number(orderId), status: "FAILED", paymentRef: `MOCK-${orderId}` }),
    });
    router.replace(`/payment/${orderId}`);
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold">Mock Ödeme Sayfası</h1>
      <p className="mt-2 text-sm opacity-80">Sipariş No: {orderId}</p>
      <div className="mt-6 flex gap-3">
        <button onClick={paySuccess} disabled={loading} className="rounded bg-green-600 px-4 py-2 text-white">
          Ödemeyi Tamamla
        </button>
        <button onClick={payFail} disabled={loading} className="rounded bg-red-600 px-4 py-2 text-white">
          Ödeme Başarısız
        </button>
      </div>
    </div>
  );
}


