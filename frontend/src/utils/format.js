// Utility functions for formatting

export const formatCurrency = (amount, currency = 'VNĐ') => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ' + currency;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min((current / goal) * 100, 100);
};

export const getDaysLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
