import { prisma } from "@/app/lib/prisma";
import ProductCard from "@/app/ui/ProductCard";

export default async function Products() {
  const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p: any) => (
        <ProductCard key={p.id} id={p.id} title={p.title} price={Number(p.price)} />
      ))}
    </div>
  );
}

