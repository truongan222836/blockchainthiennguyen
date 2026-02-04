import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useWeb3 } from '../context/Web3Context';
import toast from 'react-hot-toast';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user, API_URL } = useAuth();
  const { web3, contract, account, connectWallet, CONTRACT_ADDRESS } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    goalAmount: '',
    category: 'other',
    endDate: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      toast.error('Vui lòng kết nối ví blockchain trước');
      connectWallet();
      return;
    }

    if (!contract) {
      toast.error('Lỗi kết nối smart contract');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Campaign on Blockchain
      console.log("Current Contract Address:", contract.options.address);
      console.log("Expected Contract Address:", CONTRACT_ADDRESS);

      // FORCE UPDATE ADDRESS TO BE SAFE
      contract.options.address = CONTRACT_ADDRESS;

      const goalAmountWei = web3.utils.toWei(formData.goalAmount.toString(), 'ether'); // Assume input is in simplified unit, converting to Wei
      const endDateUnix = Math.floor(new Date(formData.endDate).getTime() / 1000);

      const toastId = toast.loading(`Đang gửi giao dịch đến: ${CONTRACT_ADDRESS.substring(0, 6)}...`);

      const tx = await contract.methods.createCampaign(
        formData.title,
        formData.description,
        goalAmountWei,
        endDateUnix
      ).send({ from: account });

      toast.dismiss(toastId);
      toast.success('Giao dịch thành công trên Blockchain!');

      const event = tx.events.CampaignCreated;
      const onChainId = event.returnValues.campaignId;
      const txHash = tx.transactionHash;

      // 2. Save to Backend
      const response = await axios.post(
        `${API_URL}/campaigns`,
        {
          ...formData,
          goalAmount: parseFloat(formData.goalAmount),
          blockchainTxHash: txHash,
          contractAddress: CONTRACT_ADDRESS,
          onChainId: onChainId.toString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Đồng bộ dữ liệu thành công!');
      const newId = response.data?.data?.id || response.data?.data?._id;
      if (newId) {
        navigate(`/campaigns/${newId}`);
      } else {
        navigate('/campaigns');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Tạm chiến dịch thất bại');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'education', label: 'Giáo dục' },
    { value: 'health', label: 'Sức khỏe' },
    { value: 'disaster', label: 'Thiên tai' },
    { value: 'poverty', label: 'Xóa đói giảm nghèo' },
    { value: 'environment', label: 'Môi trường' },
    { value: 'other', label: 'Khác' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Tạo chiến dịch mới</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề chiến dịch *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Nhập tiêu đề chiến dịch"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chiến dịch *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Mô tả chi tiết về chiến dịch thiện nguyện của bạn..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL hình ảnh
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền mục tiêu (VNĐ) *
            </label>
            <input
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              required
              min="1"
              step="1000"
              placeholder="1000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày kết thúc *
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {!account && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              ⚠️ Vui lòng kết nối ví blockchain để tạo chiến dịch trên blockchain (Cronos Testnet)
            </p>
            <button
              type="button"
              onClick={connectWallet}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm font-medium"
            >
              Kết nối Ví
            </button>
          </div>
        )}



        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Hủy
          </button>
        </div>
      </form>
      <div className="mt-4 text-center text-xs text-gray-400">
        Debug: Contract Address = {CONTRACT_ADDRESS}
      </div>
    </div>
  );
};

export default CreateCampaign;
