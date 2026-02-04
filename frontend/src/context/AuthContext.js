import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkAuth();
    connectWallet();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Initialize Web3
          const Web3 = (await import('web3')).default;
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Đăng nhập thành công!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      return { success: false, error: error.response?.data };
    }
  };

  const register = async (name, email, password, walletAddress) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        walletAddress: walletAddress || account || ''
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Đăng ký thành công!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      return { success: false, error: error.response?.data };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Đã đăng xuất');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    web3,
    account,
    connectWallet,
    API_URL
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
