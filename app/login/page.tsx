"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Giriş başarısız");
      return;
    }
    router.replace("/");
  };
  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-4">Giriş Yap</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="E-posta" type="email" onChange={(e)=>setForm((f:any)=>({...f,email:e.target.value}))} />
        <input className="w-full border p-2 rounded" placeholder="Şifre" type="password" onChange={(e)=>setForm((f:any)=>({...f,password:e.target.value}))} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Giriş Yap</button>
      </form>
    </div>
  );
}


