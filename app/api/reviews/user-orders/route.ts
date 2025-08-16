import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || parseInt(userId) !== user.id) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 403 });
    }

    // Kullanıcının ödenmiş siparişlerini ve ürünlerini getir
    const orders = await prisma.order.findMany({
      where: {
        userId: parseInt(userId),
        status: "PAID" // Sadece ödenmiş siparişler
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Her sipariş için, yorum yapılmamış ürünleri filtrele
    const ordersWithAvailableProducts = await Promise.all(
      orders.map(async (order) => {
        const availableProducts = [];
        
        for (const item of order.orderItems) {
          // Bu ürün için bu siparişte yorum yapılıp yapılmadığını kontrol et
          const existingReview = await prisma.review.findFirst({
            where: {
              userId: parseInt(userId),
              productId: item.productId,
              orderId: order.id
            }
          });

          // Eğer yorum yapılmamışsa, ürünü ekle
          if (!existingReview) {
            availableProducts.push(item);
          }
        }

        return {
          ...order,
          orderItems: availableProducts
        };
      })
    );

    // Sadece yorum yapılabilecek ürünü olan siparişleri döndür
    const filteredOrders = ordersWithAvailableProducts.filter(
      order => order.orderItems.length > 0
    );

    return NextResponse.json({ orders: filteredOrders });

  } catch (error) {
    console.error("Kullanıcı siparişleri getirme hatası:", error);
    return NextResponse.json({ 
      message: "Siparişler yüklenirken bir hata oluştu" 
    }, { status: 500 });
  }
}
