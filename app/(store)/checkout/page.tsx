"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

type CartItemInput = { productId: number; quantity: number };
type Product = { id: number; title: string; price: number; isActive?: boolean };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemsParam = searchParams.get("items");
  const initialItems: CartItemInput[] = useMemo(() => {
    try {
      return itemsParam ? (JSON.parse(itemsParam) as CartItemInput[]) : [];
    } catch {
      return [];
    }
  }, [itemsParam]);

  const [step, setStep] = useState<number>(1);
  const [provider, setProvider] = useState<"mock" | "iyzico">("mock");

  const [buyer, setBuyer] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    district: "",
    postalCode: "",
    addressLine1: "",
  });

  const [extra, setExtra] = useState({
    companyName: "",
    taxNumber: "",
    addressLine2: "",
    notes: "",
  });

  const { data: productsResp } = useSWR<{ ok?: boolean; products?: Product[] }>(
    "/api/products",
    fetcher
  );
  const products = productsResp?.products ?? [];

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p] as const)), [products]);

  const items: CartItemInput[] = initialItems;

  const total = useMemo(() => {
    return items.reduce((acc, i) => {
      const p = productMap.get(i.productId);
      if (!p) return acc;
      return acc + Number(p.price) * i.quantity;
    }, 0);
  }, [items, productMap]);

  const nextFromStep1 = () => {
    if (!buyer.fullName.trim()) {
      alert("Ad Soyad gerekli");
      return;
    }
    if (!buyer.email.trim()) {
      alert("E-posta gerekli");
      return;
    }
    setStep(2);
  };

  const nextFromStep2 = () => {
    setStep(3);
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submitOrder = () => {
    // Ödeme ve siparişi tamamlama: redirect'lerin düzgün çalışması için form postu kullanıyoruz.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/checkout";
    form.style.display = "none";

    const emailInput = document.createElement("input");
    emailInput.name = "email";
    emailInput.value = buyer.email;
    form.appendChild(emailInput);

    const providerInput = document.createElement("input");
    providerInput.name = "provider";
    providerInput.value = provider;
    form.appendChild(providerInput);

    const itemsInput = document.createElement("input");
    itemsInput.name = "items";
    itemsInput.value = JSON.stringify(items);
    form.appendChild(itemsInput);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Satın Alma</h1>

      <Stepper current={step} />

      <div className="mt-6 rounded-lg border p-4 bg-white dark:bg-neutral-900">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">1. Adım: Satın Alan Kişi Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Ad Soyad" value={buyer.fullName} onChange={(v) => setBuyer({ ...buyer, fullName: v })} />
              <Input label="E-posta" type="email" value={buyer.email} onChange={(v) => setBuyer({ ...buyer, email: v })} />
              <Input label="Telefon" value={buyer.phone} onChange={(v) => setBuyer({ ...buyer, phone: v })} />
              <Input label="Ülke" value={buyer.country} onChange={(v) => setBuyer({ ...buyer, country: v })} />
              <Input label="Şehir" value={buyer.city} onChange={(v) => setBuyer({ ...buyer, city: v })} />
              <Input label="İlçe" value={buyer.district} onChange={(v) => setBuyer({ ...buyer, district: v })} />
              <Input label="Posta Kodu" value={buyer.postalCode} onChange={(v) => setBuyer({ ...buyer, postalCode: v })} />
              <Input label="Adres Satırı 1" value={buyer.addressLine1} onChange={(v) => setBuyer({ ...buyer, addressLine1: v })} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={nextFromStep1} className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">Kaydet ve Devam</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">2. Adım: Diğer Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Şirket Adı (Opsiyonel)" value={extra.companyName} onChange={(v) => setExtra({ ...extra, companyName: v })} />
              <Input label="Vergi No (Opsiyonel)" value={extra.taxNumber} onChange={(v) => setExtra({ ...extra, taxNumber: v })} />
              <Input label="Adres Satırı 2" value={extra.addressLine2} onChange={(v) => setExtra({ ...extra, addressLine2: v })} />
              <TextArea label="Notlar" value={extra.notes} onChange={(v) => setExtra({ ...extra, notes: v })} />
            </div>
            <div className="flex justify-between gap-2">
              <button onClick={goBack} className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">Geri</button>
              <button onClick={nextFromStep2} className="rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">Kaydet ve Devam</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">3. Adım: Ödeme ve Siparişi Tamamlama</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Section title="Sipariş Özeti">
                  {items.length === 0 ? (
                    <div className="text-sm opacity-70">Sepet boş veya ürün parametresi iletilmedi.</div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((i) => {
                        const p = productMap.get(i.productId);
                        return (
                          <div key={`${i.productId}`} className="flex items-center justify-between">
                            <div className="text-sm">{p?.title ?? `Ürün #${i.productId}`}</div>
                            <div className="text-sm opacity-70">x{i.quantity}</div>
                            <div className="text-sm font-medium">{p ? (Number(p.price) * i.quantity).toFixed(2) : "-"} TL</div>
                          </div>
                        );
                      })}
                      <div className="h-px bg-gray-200 dark:bg-neutral-800 my-2" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Toplam</div>
                        <div className="text-sm font-semibold">{total.toFixed(2)} TL</div>
                      </div>
                    </div>
                  )}
                </Section>

                <Section title="Ödeme Sağlayıcısı">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="provider" checked={provider === "mock"} onChange={() => setProvider("mock")} />
                      Mock (Test)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="provider" checked={provider === "iyzico"} onChange={() => setProvider("iyzico")} />
                      Iyzico
                    </label>
                  </div>
                </Section>
              </div>

              <div className="lg:col-span-1">
                <div className="rounded-lg border p-4 bg-gray-50 dark:bg-neutral-800">
                  <div className="text-sm opacity-70 mb-2">Özet</div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div>Ürün Toplam</div>
                    <div>{total.toFixed(2)} TL</div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div>Kargo</div>
                    <div>0 TL</div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-neutral-700 my-2" />
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <div>Genel Toplam</div>
                    <div>{total.toFixed(2)} TL</div>
                  </div>
                  <button
                    onClick={submitOrder}
                    disabled={items.length === 0 || !buyer.email}
                    className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Ödemeye Geç ve Tamamla
                  </button>
                  <button onClick={goBack} className="mt-2 w-full rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600">Geri</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  const steps = [
    { id: 1, label: "Kişi Bilgileri" },
    { id: 2, label: "Diğer Bilgiler" },
    { id: 3, label: "Ödeme" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {steps.map((s, idx) => (
        <div key={s.id} className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm ${current === s.id ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-neutral-900"}`}>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${current >= s.id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-neutral-800"}`}>{idx + 1}</span>
            <span>{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="text-sm">
      <div className="mb-1 opacity-70">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 bg-white dark:bg-neutral-900"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <div className="mb-1 opacity-70">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 bg-white dark:bg-neutral-900 min-h-24"
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-medium mb-2">{title}</div>
      <div className="rounded border p-3">{children}</div>
    </div>
  );
}


