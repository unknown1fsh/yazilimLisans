"use client";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  return r.json();
};

export default function SepetPage() {
  const { data } = useSWR("/api/cart", fetcher);
  if (!data) return <div className="p-8">Yükleniyor...</div>;
  if (data?.requiresLogin) return <div className="p-8">Sepeti görmek için lütfen giriş yapınız.</div>;
  const items = data?.items || [];
  const total = items.reduce((a: number, i: any) => a + Number(i.product.price) * i.quantity, 0);

  const payAll = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", provider: "iyzico", items: [] }),
    });
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      const j = await res.json();
      if (j.redirectUrl) window.location.href = j.redirectUrl;
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Sepetim</h1>
      <div className="space-y-3">
        {items.map((i: any) => (
          <div key={i.id} className="rounded border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.product.title}</div>
              <div className="text-sm opacity-70">Adet: {i.quantity}</div>
            </div>
            <div>{(Number(i.product.price) * i.quantity).toFixed(2)} TL</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Toplam: {total.toFixed(2)} TL</div>
        <button onClick={payAll} className="rounded bg-blue-600 px-4 py-2 text-white">Toplu Ödeme</button>
      </div>
    </div>
  );
}


