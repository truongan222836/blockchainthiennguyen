import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../context/Web3Context';
import toast from 'react-hot-toast';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, API_URL } = useAuth();
  const { web3, contract, account, connectWallet } = useWeb3();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}`);
      setCampaign(response.data.data);
    } catch (error) {
      toast.error('Không tìm thấy chiến dịch');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Vui lòng đăng nhập để quyên góp');
      navigate('/login');
      return;
    }

    if (!account) {
      toast.error('Vui lòng kết nối ví blockchain');
      connectWallet();
      return;
    }

    if (!contract) {
      toast.error("Lỗi kết nối Smart Contract");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (!amount || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setDonating(true);

    try {
      // 1. Donate on Blockchain
      if (!campaign.onChainId) {
        throw new Error("Chiến dịch này chưa được đồng bộ lên Blockchain");
      }

      // Conversion Rate (Simulated): 1 CRO = 2500 VND
      const RATE = 2500;
      const amountCRO = amount / RATE;
      const amountWei = web3.utils.toWei(amountCRO.toFixed(18), 'ether');

      const toastId = toast.loading('Đang chờ xác nhận giao dịch trên Metamask...');

      const tx = await contract.methods.donate(campaign.onChainId, donationMessage || "Donation")
        .send({ from: account, value: amountWei });

      toast.dismiss(toastId);
      toast.success('Quyên góp thành công trên Blockchain!');
      const txHash = tx.transactionHash;
      // Convert BigInt to string to avoid serialization error
      const blockNumber = tx.blockNumber ? tx.blockNumber.toString() : null;

      // 2. Save to Backend
      const response = await axios.post(
        `${API_URL}/donations`,
        {
          campaignId: id,
          amount: amount,
          message: donationMessage,
          txHash: txHash,
          blockNumber: blockNumber
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Đồng bộ quyên góp thành công!');
      setDonationAmount('');
      setDonationMessage('');
      fetchCampaign();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Quyên góp thất bại');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {campaign.image && (
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          )}

          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
            <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
          </div>

          {/* Donations History */}
          {campaign.donations && campaign.donations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Lịch sử quyên góp</h2>
              <div className="space-y-4">
                {campaign.donations.slice(0, 10).map((donation, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {donation.donor?.name || 'Ẩn danh'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.timestamp).toLocaleString('vi-VN')}
                        </p>
                        {donation.message && (
                          <p className="text-gray-700 mt-1">{donation.message}</p>
                        )}
                      </div>
                      <p className="text-lg font-bold text-primary-600">
                        {new Intl.NumberFormat('vi-VN').format(donation.amount)} VNĐ
                      </p>
                    </div>
                    {donation.txHash && (
                      <p className="text-xs text-gray-500 mt-2 font-mono">
                        TX: {donation.txHash.slice(0, 20)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Đã quyên góp</span>
                <span className="font-semibold text-primary-600">
                  {new Intl.NumberFormat('vi-VN').format(campaign.currentAmount)} VNĐ
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Mục tiêu: {new Intl.NumberFormat('vi-VN').format(campaign.goalAmount)} VNĐ</span>
                <span>{progress > 0 && progress < 0.1 ? '< 0.1' : progress.toFixed(1)}%</span>
              </div>
            </div>

            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {campaign.status === 'active' ? 'Đang hoạt động' :
                    campaign.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Danh mục:</span>
                <span className="font-semibold">{campaign.category}</span>
              </div>
              {daysLeft > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-semibold">{daysLeft} ngày</span>
                </div>
              )}
            </div>

            {/* Donate Form */}
            {campaign.status === 'active' && (
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền quyên góp (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    min="1"
                    step="1000"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lời nhắn (tùy chọn)
                  </label>
                  <textarea
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    placeholder="Nhập lời nhắn..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={donating || !account}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {donating ? 'Đang xử lý...' : 'Quyên góp ngay'}
                </button>

                {!account && (
                  <p className="text-xs text-red-600 text-center">
                    Vui lòng kết nối ví blockchain để quyên góp
                  </p>
                )}
              </form>
            )}

            {campaign.creator && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-1">Người tạo:</p>
                <p className="font-semibold">{campaign.creator.name}</p>
                <p className="text-xs text-gray-500">{campaign.creator.email}</p>
              </div>
            )}

            {campaign.contractAddress && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600 mb-1">Contract Address:</p>
                <p className="text-xs font-mono text-primary-600 break-all">
                  {campaign.contractAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
