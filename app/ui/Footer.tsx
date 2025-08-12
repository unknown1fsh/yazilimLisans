import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t py-8 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-base font-semibold mb-2">{process.env.NEXT_PUBLIC_APP_NAME ?? "YazilimLisans"}</div>
          <p className="opacity-70">
            Orijinal dijital yazılım lisansları. Anında teslimat, güvenli ödeme, 7/24 destek.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-2">Hızlı Bağlantılar</div>
          <ul className="space-y-1 opacity-80">
            <li><Link href="/">Anasayfa</Link></li>
            <li><Link href="/guvenilirlik">Güvenilirlik</Link></li>
            <li><Link href="/iletisim">İletişim</Link></li>
            <li><Link href="/sepet">Sepet</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">İletişim</div>
          <ul className="space-y-1 opacity-80">
            <li>E-posta: destek@ornek-lisans.com</li>
            <li>Telefon: +90 555 000 00 00</li>
            <li>WhatsApp: <Link className="underline" href="https://wa.me/905550000000" target="_blank">Hemen yazın</Link></li>
            <li>Çalışma saatleri: 09:00 - 23:00 (7 gün)</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-2">Güven</div>
          <ul className="space-y-1 opacity-80">
            <li>256-bit SSL Şifreleme</li>
            <li>%100 Orijinal Lisans</li>
            <li>Anında Teslim</li>
            <li>14 Gün İade Garantisi</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 opacity-60">© {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME ?? "YazilimLisans"}. Tüm hakları saklıdır.</div>
    </footer>
  );
}


