"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"PERSONAL" | "COMPANY">("PERSONAL");
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userType }),
    });
    if (!res.ok) {
      setError("Kayıt başarısız. Bilgileri kontrol ediniz.");
      return;
    }
    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Kayıt Ol</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" checked={userType === "PERSONAL"} onChange={() => setUserType("PERSONAL")} />
            Kişisel
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" checked={userType === "COMPANY"} onChange={() => setUserType("COMPANY")} />
            Şirket
          </label>
        </div>
        <input className="w-full border p-2 rounded" placeholder="Ad Soyad / Yetkili" onChange={(e)=>setForm((f:any)=>({...f,name:e.target.value}))} />
        <input className="w-full border p-2 rounded" placeholder="E-posta" type="email" onChange={(e)=>setForm((f:any)=>({...f,email:e.target.value}))} />
        <input className="w-full border p-2 rounded" placeholder="Şifre" type="password" onChange={(e)=>setForm((f:any)=>({...f,password:e.target.value}))} />
        {userType === "PERSONAL" && (
          <input className="w-full border p-2 rounded" placeholder="TC Kimlik No" onChange={(e)=>setForm((f:any)=>({...f,tcKimlikNo:e.target.value}))} />
        )}
        {userType === "COMPANY" && (
          <>
            <input className="w-full border p-2 rounded" placeholder="Şirket Adı" onChange={(e)=>setForm((f:any)=>({...f,companyName:e.target.value}))} />
            <input className="w-full border p-2 rounded" placeholder="Vergi Kimlik No" onChange={(e)=>setForm((f:any)=>({...f,vergiKimlikNo:e.target.value}))} />
          </>
        )}
        <input className="w-full border p-2 rounded" placeholder="Telefon" onChange={(e)=>setForm((f:any)=>({...f,phone:e.target.value}))} />
        <input className="w-full border p-2 rounded" placeholder="Adres" onChange={(e)=>setForm((f:any)=>({...f,address:e.target.value}))} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Kayıt Ol</button>
      </form>
    </div>
  );
}


