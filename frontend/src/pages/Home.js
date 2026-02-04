import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import CampaignCard from '../components/campaigns/CampaignCard';

const Home = () => {
  const { API_URL } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns?limit=6`);
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Blockchain Thiện Nguyện
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Đảm bảo tính an toàn, minh bạch trong hoạt động thiện nguyện
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/campaigns"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Khám phá chiến dịch
            </Link>
            <Link
              to="/create-campaign"
              className="px-8 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-400 transition"
            >
              Tạo chiến dịch
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">An toàn</h3>
              <p className="text-gray-600">
                Tất cả giao dịch được lưu trữ trên blockchain, đảm bảo không thể thay đổi
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-xl font-semibold mb-2">Minh bạch</h3>
              <p className="text-gray-600">
                Mọi quyên góp đều được công khai và có thể kiểm tra trên blockchain
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Nhanh chóng</h3>
              <p className="text-gray-600">
                Quyên góp được xử lý ngay lập tức, không qua trung gian
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Chiến dịch nổi bật</h2>
            <Link
              to="/campaigns"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id || campaign._id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
