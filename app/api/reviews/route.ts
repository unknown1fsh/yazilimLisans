import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

// Yorum oluşturma
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const { userId, productId, orderId, rating, comment } = await request.json();

    // Kullanıcının kendi ID'si ile eşleşip eşleşmediğini kontrol et
    if (user.id !== userId) {
      return NextResponse.json({ message: "Yetkisiz işlem" }, { status: 403 });
    }

    // Kullanıcının bu ürünü bu siparişte satın alıp almadığını kontrol et
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        orderId: orderId,
        productId: productId,
        order: {
          userId: userId,
          status: "PAID" // Sadece ödenmiş siparişler için yorum yapılabilir
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json({ 
        message: "Bu ürün için yorum yapamazsınız. Ürünü satın almanız gerekiyor." 
      }, { status: 400 });
    }

    // Daha önce yorum yapılıp yapılmadığını kontrol et
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: userId,
        productId: productId,
        orderId: orderId
      }
    });

    if (existingReview) {
      return NextResponse.json({ 
        message: "Bu ürün için zaten yorum yapmışsınız." 
      }, { status: 400 });
    }

    // Yorumu oluştur
    const review = await prisma.review.create({
      data: {
        userId: userId,
        productId: productId,
        orderId: orderId,
        rating: rating,
        comment: comment,
        isApproved: false // Admin onayı gerekli
      }
    });

    return NextResponse.json({ 
      message: "Yorumunuz başarıyla gönderildi ve onay için bekliyor.",
      review 
    });

  } catch (error) {
    console.error("Yorum oluşturma hatası:", error);
    return NextResponse.json({ 
      message: "Yorum oluşturulurken bir hata oluştu" 
    }, { status: 500 });
  }
}

// Onaylanmış yorumları listeleme
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        isApproved: true // Sadece onaylanmış yorumlar
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ reviews });

  } catch (error) {
    console.error("Yorumları listeleme hatası:", error);
    return NextResponse.json({ 
      message: "Yorumlar yüklenirken bir hata oluştu" 
    }, { status: 500 });
  }
}
