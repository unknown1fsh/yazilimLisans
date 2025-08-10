import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import LogoutButton from "@/app/ui/LogoutButton";

export const dynamic = "force-dynamic";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/">Anasayfa</Link>
        <Link href="/sepet">Sepetim</Link>
        {!user && (
          <>
            <Link href="/login">Giriş</Link>
            <Link href="/register">Kayıt</Link>
          </>
        )}
        {user && (
          <div className="flex items-center gap-3">
            <Link href="/profil" className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
              </svg>
              <span className="hidden sm:inline">Merhaba, {user.email}</span>
            </Link>
            <LogoutButton />
          </div>
        )}
      </nav>
    </header>
  );
}


