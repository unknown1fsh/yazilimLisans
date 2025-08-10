import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.createMany({
    data: [
      { name: "İşletim Sistemleri", slug: "isletim-sistemleri" },
      { name: "Office Programları", slug: "office-programlari" },
      { name: "Antivirüs Yazılımları", slug: "antivirus-yazilimlari" },
    ],
    skipDuplicates: true,
  });

  const windows11Pro = await prisma.product.upsert({
    where: { slug: "windows-11-pro" },
    update: {},
    create: {
      title: "Windows 11 Pro Lisans Key",
      slug: "windows-11-pro",
      description:
        "Windows 11 Pro dijital lisans anahtarı. Online teslimat, hızlı etkinleştirme.",
      price: 149.9,
      imageUrl: "/window.svg",
      category: { connect: { slug: "isletim-sistemleri" } },
    },
  });

  const windows10Pro = await prisma.product.upsert({
    where: { slug: "windows-10-pro" },
    update: {},
    create: {
      title: "Windows 10 Pro Dijital Lisans Key",
      slug: "windows-10-pro",
      description:
        "Windows 10 Pro dijital lisans anahtarı. Online teslimat, hızlı etkinleştirme.",
      price: 129.9,
      imageUrl: "/window.svg",
      category: { connect: { slug: "isletim-sistemleri" } },
    },
  });

  const office2021 = await prisma.product.upsert({
    where: { slug: "office-2021-pro-plus" },
    update: {},
    create: {
      title: "Office 2021 Professional Plus Dijital Lisans Key",
      slug: "office-2021-pro-plus",
      description:
        "Office 2021 Pro Plus dijital lisans. Excel, Word, PowerPoint ve daha fazlası.",
      price: 279.9,
      imageUrl: "/window.svg",
      category: { connect: { slug: "office-programlari" } },
    },
  });

  // Örnek lisans anahtarları
  await prisma.licenseKey.createMany({
    data: [
      { key: "W11PRO-AAAAA-BBBBB-CCCCC-DDDDD", productId: windows11Pro.id },
      { key: "W11PRO-EEEEE-FFFFF-GGGGG-HHHHH", productId: windows11Pro.id },
      { key: "W10PRO-IIIII-JJJJJ-KKKKK-LLLLL", productId: windows10Pro.id },
      { key: "OFF21P-MMMMM-NNNNN-OOOOO-PPPPP", productId: office2021.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


