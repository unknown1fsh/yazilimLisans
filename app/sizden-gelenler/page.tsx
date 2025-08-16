import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import ReviewForm from "@/app/ui/ReviewForm";
import ReviewsList from "@/app/ui/ReviewsList";

export const dynamic = "force-dynamic";

export default async function SizdenGelenlerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Sizden Gelenler
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Deneyimlerinizi paylaşın, diğer kullanıcılara yardımcı olun. 
              Satın aldığınız ürünler hakkında yorum yaparak topluluğa katkıda bulunun.
            </p>
          </div>
          
          {/* Review Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Deneyimlerinizi Paylaşın
                </h2>
                <p className="text-gray-600">
                  Satın aldığınız ürünler için yorum yapın
                </p>
              </div>
            </div>
            <ReviewForm userId={user.id} />
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Kullanıcı Yorumları
                </h2>
                <p className="text-gray-600">
                  Diğer kullanıcıların deneyimleri
                </p>
              </div>
            </div>
            <ReviewsList />
          </div>
        </div>
      </div>
    </div>
  );
}
