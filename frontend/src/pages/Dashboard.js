import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import CampaignCard from '../components/campaigns/CampaignCard';

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      {profile && profile.stats && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Số chiến dịch đã tạo</h3>
            <p className="text-3xl font-bold text-primary-600">
              {profile.stats.campaignsCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Số lần quyên góp</h3>
            <p className="text-3xl font-bold text-green-600">
              {profile.stats.donationsCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Tổng đã quyên góp</h3>
            <p className="text-3xl font-bold text-blue-600">
              {new Intl.NumberFormat('vi-VN').format(profile.stats.totalDonated)} VNĐ
            </p>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Tên:</span> {user?.name}</p>
          <p><span className="font-semibold">Email:</span> {user?.email}</p>
          {user?.walletAddress && (
            <p>
              <span className="font-semibold">Ví blockchain:</span>{' '}
              <span className="font-mono text-sm">{user.walletAddress}</span>
            </p>
          )}
        </div>
      </div>

      {/* My Campaigns */}
      {profile && profile.campaigns && profile.campaigns.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Chiến dịch của tôi</h2>
            <Link
              to="/create-campaign"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Tạo chiến dịch mới
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {profile.campaigns.map((campaign) => (
              <CampaignCard key={campaign.id || campaign._id} campaign={campaign} />
            ))}
          </div>
        </div>
      )}

      {/* My Donations */}
      {profile && profile.donations && profile.donations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quyên góp của tôi</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chiến dịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profile.donations.map((donation) => (
                  <tr key={donation.id || donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/campaigns/${donation.campaign.id || donation.campaign._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {donation.campaign.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                      {new Intl.NumberFormat('vi-VN').format(donation.amount)} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                      {donation.txHash ? donation.txHash.slice(0, 20) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!profile?.campaigns || profile.campaigns.length === 0) &&
       (!profile?.donations || profile.donations.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Bạn chưa có chiến dịch hoặc quyên góp nào</p>
          <Link
            to="/create-campaign"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block"
          >
            Tạo chiến dịch đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
