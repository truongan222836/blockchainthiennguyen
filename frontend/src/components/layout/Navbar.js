import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';
import {
  HomeIcon,
  PlusCircleIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                💝 Blockchain Thiện Nguyện
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/campaigns"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 transition"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
              Tìm kiếm
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-campaign"
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-1" />
                  Tạo chiến dịch
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 transition"
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-red-600 transition"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Đăng ký
                </Link>
              </>
            )}

            {!account && (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Kết nối Wallet
              </button>
            )}

            {account && (
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
