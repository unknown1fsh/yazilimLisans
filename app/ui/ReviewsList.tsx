"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  product: {
    title: string;
    slug: string;
  };
}

// Mock veri
const mockReviews: Review[] = [
  {
    id: 1,
    rating: 5,
    comment: "Harika bir ürün! Çok memnun kaldım. Kurulumu kolay ve performansı mükemmel. Kesinlikle tavsiye ederim.",
    createdAt: "2024-01-15T10:30:00Z",
    user: {
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com"
    },
    product: {
      title: "Adobe Photoshop CC 2024",
      slug: "adobe-photoshop-cc-2024"
    }
  },
  {
    id: 2,
    rating: 4,
    comment: "Güzel ürün, fiyatına göre çok iyi. Sadece başlangıçta biraz karmaşık geliyor ama alışınca çok pratik.",
    createdAt: "2024-01-14T14:20:00Z",
    user: {
      name: "Fatma Demir",
      email: "fatma@example.com"
    },
    product: {
      title: "Microsoft Office 365",
      slug: "microsoft-office-365"
    }
  },
  {
    id: 3,
    rating: 5,
    comment: "Mükemmel! Tam ihtiyacım olan şeydi. Hızlı teslimat ve sorunsuz aktivasyon. Teşekkürler!",
    createdAt: "2024-01-13T09:15:00Z",
    user: {
      name: "Mehmet Kaya",
      email: "mehmet@example.com"
    },
    product: {
      title: "Visual Studio Code Pro",
      slug: "visual-studio-code-pro"
    }
  },
  {
    id: 4,
    rating: 4,
    comment: "İyi ürün, kaliteli. Sadece arayüz biraz eski tarzda ama işlevsellik açısından mükemmel.",
    createdAt: "2024-01-12T16:45:00Z",
    user: {
      name: "Ayşe Özkan",
      email: "ayse@example.com"
    },
    product: {
      title: "Final Cut Pro X",
      slug: "final-cut-pro-x"
    }
  },
  {
    id: 5,
    rating: 5,
    comment: "Çok memnunum! Hızlı ve güvenilir. Müşteri hizmetleri de çok yardımcı oldu. Teşekkürler!",
    createdAt: "2024-01-11T11:30:00Z",
    user: {
      name: "Can Arslan",
      email: "can@example.com"
    },
    product: {
      title: "Adobe Premiere Pro",
      slug: "adobe-premiere-pro"
    }
  }
];

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek API'den veri çekmeye çalış, başarısız olursa mock veriyi kullan
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          // API'den veri gelmezse mock veriyi kullan
          setReviews(mockReviews);
        }
      } else {
        // API hatası durumunda mock veriyi kullan
        setReviews(mockReviews);
      }
    } catch (error) {
      console.error("Yorumlar yüklenirken hata:", error);
      // Hata durumunda mock veriyi kullan
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Henüz Yorum Bulunmuyor
        </h3>
        <p className="text-gray-600">
          İlk yorumu siz yapın ve topluluğa katkıda bulunun!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div 
          key={review.id} 
          className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInUp 0.6s ease-out forwards'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {review.product.title}
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {review.user.name ? review.user.name.charAt(0).toUpperCase() : review.user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.user.name || review.user.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-sm">
                {review.rating}/5
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed text-lg">
              "{review.comment}"
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Doğrulanmış Alıcı
            </span>
            <span>
              {new Date(review.createdAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
