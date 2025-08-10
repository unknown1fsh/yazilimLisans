import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await getCurrentUser();
  if (!session) return <div className="p-8">Devam etmek için lütfen giriş yapınız.</div>;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return <div className="p-8">Kullanıcı bulunamadı.</div>;
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-4">Profil</h1>
      <div className="space-y-2 text-sm">
        <div><span className="opacity-70">E-posta:</span> {user.email}</div>
        {user.name && <div><span className="opacity-70">Ad Soyad / Yetkili:</span> {user.name}</div>}
        <div><span className="opacity-70">Tip:</span> {user.userType}</div>
        {user.userType === "PERSONAL" && user.tcKimlikNo && (
          <div><span className="opacity-70">TC Kimlik No:</span> {user.tcKimlikNo}</div>
        )}
        {user.userType === "COMPANY" && (
          <>
            {user.companyName && <div><span className="opacity-70">Şirket Adı:</span> {user.companyName}</div>}
            {user.vergiKimlikNo && <div><span className="opacity-70">Vergi No:</span> {user.vergiKimlikNo}</div>}
          </>
        )}
        {user.phone && <div><span className="opacity-70">Telefon:</span> {user.phone}</div>}
        {user.address && <div><span className="opacity-70">Adres:</span> {user.address}</div>}
      </div>
    </div>
  );
}


