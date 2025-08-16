"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  slug: string;
}

interface Order {
  id: number;
  createdAt: string;
  orderItems: Array<{
    productId: number;
    product: Product;
  }>;
}

interface ReviewFormProps {
  userId: number;
}

export default function ReviewForm({ userId }: ReviewFormProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`/api/reviews/user-orders?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !selectedProduct || !comment.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId.toString()),
          productId: parseInt(selectedProduct),
          orderId: parseInt(selectedOrder),
          rating,
          comment: comment.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Yorumunuz başarıyla gönderildi!");
        setComment("");
        setRating(5);
        setSelectedOrder("");
        setSelectedProduct("");
        // Sayfayı yenile
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.message || "Yorum gönderilirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOrderData = orders.find(order => order.id.toString() === selectedOrder);
  const availableProducts = selectedOrderData?.orderItems || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Henüz Sipariş Bulunmuyor
        </h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Henüz hiç sipariş vermediniz veya yorum yapabileceğiniz ürün bulunmuyor.
        </p>
        <p className="text-sm text-gray-500">
          Ürün satın aldıktan sonra buradan yorum yapabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sipariş Seçimi */}
      <div className="space-y-3">
        <label htmlFor="order" className="block text-sm font-semibold text-gray-700">
          Sipariş Seçin
        </label>
        <div className="relative">
          <select
            id="order"
            value={selectedOrder}
            onChange={(e) => {
              setSelectedOrder(e.target.value);
              setSelectedProduct("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            required
          >
            <option value="">Sipariş seçin</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Sipariş #{order.id} - {new Date(order.createdAt).toLocaleDateString("tr-TR")}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ürün Seçimi */}
      {selectedOrder && (
        <div className="space-y-3">
          <label htmlFor="product" className="block text-sm font-semibold text-gray-700">
            Ürün Seçin
          </label>
          <div className="relative">
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              required
            >
              <option value="">Ürün seçin</option>
              {availableProducts.map((item) => (
                <option key={item.productId} value={item.productId}>
                  {item.product.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Puanlama */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Puanınız
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400`}
            >
              ★
            </button>
          ))}
          <span className="ml-4 text-lg font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            {rating}/5
          </span>
        </div>
      </div>

      {/* Yorum Metni */}
      <div className="space-y-3">
        <label htmlFor="comment" className="block text-sm font-semibold text-gray-700">
          Yorumunuz
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
          placeholder="Ürün hakkında deneyimlerinizi paylaşın... (En az 10 karakter)"
          required
          minLength={10}
        />
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Yorumunuz en az 10 karakter olmalıdır</span>
          <span className={comment.length >= 10 ? "text-green-600" : "text-gray-400"}>
            {comment.length}/10
          </span>
        </div>
      </div>

      {/* Gönder Butonu */}
      <button
        type="submit"
        disabled={isSubmitting || comment.length < 10}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Gönderiliyor...
          </div>
        ) : (
          "Yorumu Gönder"
        )}
      </button>
    </form>
  );
}
