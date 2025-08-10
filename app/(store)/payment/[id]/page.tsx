import Link from "next/link";

async function getOrder(id: string) {
  const res = await fetch(`${process.env.APP_URL}/api/orders/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PaymentResult({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return <div className="p-8">Sipariş bulunamadı.</div>;
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Ödeme Durumu: {order.status}</h1>
      <ul className="space-y-3">
        {order.orderItems.map((i: any) => (
          <li key={i.id} className="rounded border p-4">
            <div className="font-medium">{i.product.title}</div>
            <div className="text-sm opacity-70">Adet: {i.quantity} | Fiyat: {Number(i.unitPrice).toFixed(2)} TL</div>
            {i.licenseKey?.key && (
              <div className="mt-2 rounded bg-green-50 p-2 text-green-800">Lisans Anahtarı: {i.licenseKey.key}</div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link className="underline" href="/">Anasayfa'ya dön</Link>
      </div>
    </div>
  );
}


