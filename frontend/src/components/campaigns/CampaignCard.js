import React from 'react';
import { Link } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Link to={`/campaigns/${campaign.id || campaign._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
        {campaign.image && (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {campaign.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
              {getStatusText(campaign.status)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {campaign.description}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Tiến độ</span>
              <span className="font-semibold">
                {progress > 0 && progress < 0.1 ? '< 0.1' : progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Đã quyên góp: <span className="font-semibold text-primary-600">
                {new Intl.NumberFormat('vi-VN').format(campaign.currentAmount)} VNĐ
              </span>
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Mục tiêu: <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN').format(campaign.goalAmount)} VNĐ
              </span>
            </span>
            {daysLeft > 0 && (
              <span>Còn {daysLeft} ngày</span>
            )}
          </div>

          {campaign.creator && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Bởi: {campaign.creator.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
