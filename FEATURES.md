# Tính năng hệ thống

## 🎯 Tính năng chính

### 1. Quản lý Chiến dịch Thiện nguyện
- ✅ **Tạo chiến dịch**: Người dùng có thể tạo chiến dịch thiện nguyện mới với đầy đủ thông tin
- ✅ **Xem danh sách**: Hiển thị tất cả chiến dịch với phân trang
- ✅ **Chi tiết chiến dịch**: Xem thông tin chi tiết, tiến độ, lịch sử quyên góp
- ✅ **Cập nhật/Xóa**: Người tạo có thể cập nhật hoặc xóa chiến dịch của mình

### 2. Tìm kiếm và Lọc
- ✅ **Tìm kiếm theo từ khóa**: Tìm kiếm trong tiêu đề và mô tả
- ✅ **Lọc theo danh mục**: Giáo dục, Sức khỏe, Thiên tai, Xóa đói giảm nghèo, Môi trường, Khác
- ✅ **Lọc theo trạng thái**: Đang hoạt động, Hoàn thành, Đã hủy
- ✅ **Phân trang**: Hỗ trợ phân trang cho danh sách lớn

### 3. Quyên góp
- ✅ **Quyên góp cho chiến dịch**: Người dùng có thể quyên góp với số tiền tùy chọn
- ✅ **Lời nhắn**: Thêm lời nhắn khi quyên góp
- ✅ **Lịch sử quyên góp**: Xem tất cả quyên góp của một chiến dịch
- ✅ **Theo dõi trên blockchain**: Mỗi quyên góp được ghi lại trên blockchain

### 4. Xác thực và Bảo mật
- ✅ **Đăng ký/Đăng nhập**: Hệ thống xác thực với JWT
- ✅ **Bảo vệ routes**: Routes được bảo vệ yêu cầu đăng nhập
- ✅ **Mã hóa mật khẩu**: Mật khẩu được hash bằng bcrypt
- ✅ **JWT Token**: Xác thực bằng JWT token

### 5. Dashboard
- ✅ **Thống kê cá nhân**: Xem số chiến dịch đã tạo, số lần quyên góp, tổng tiền đã quyên góp
- ✅ **Chiến dịch của tôi**: Danh sách tất cả chiến dịch đã tạo
- ✅ **Quyên góp của tôi**: Lịch sử tất cả quyên góp đã thực hiện

### 6. Blockchain Integration
- ✅ **Kết nối ví**: Kết nối MetaMask hoặc ví tương thích
- ✅ **Smart Contract**: Tích hợp với smart contract Solidity
- ✅ **Giao dịch minh bạch**: Tất cả giao dịch được lưu trên blockchain
- ✅ **Transaction Hash**: Mỗi quyên góp có transaction hash để kiểm tra

## 🎨 Giao diện

### Frontend
- ✅ **Responsive Design**: Tương thích mobile, tablet, desktop
- ✅ **Modern UI**: Sử dụng Tailwind CSS với thiết kế hiện đại
- ✅ **User-friendly**: Giao diện trực quan, dễ sử dụng
- ✅ **Loading States**: Hiển thị trạng thái loading
- ✅ **Error Handling**: Xử lý lỗi và hiển thị thông báo

### Components
- ✅ Navbar với navigation
- ✅ Campaign Cards với progress bar
- ✅ Search và Filter components
- ✅ Donation form
- ✅ Dashboard với statistics

## 🔧 Backend API

### Endpoints

#### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

#### Campaigns
- `GET /api/campaigns` - Lấy danh sách (có search, filter, pagination)
- `GET /api/campaigns/:id` - Lấy chi tiết
- `POST /api/campaigns` - Tạo mới (yêu cầu auth)
- `PUT /api/campaigns/:id` - Cập nhật (yêu cầu auth, chỉ creator)
- `DELETE /api/campaigns/:id` - Xóa (yêu cầu auth, chỉ creator hoặc admin)

#### Donations
- `GET /api/donations` - Lấy danh sách (có filter)
- `GET /api/donations/:id` - Lấy chi tiết
- `POST /api/donations` - Tạo quyên góp mới (yêu cầu auth)

#### Users
- `GET /api/users/profile` - Lấy profile và thống kê (yêu cầu auth)
- `PUT /api/users/profile` - Cập nhật profile (yêu cầu auth)

## 📊 Database Models

### User
- name, email, password (hashed)
- walletAddress
- role (user, admin, organization)
- avatar

### Campaign
- title, description, image
- goalAmount, currentAmount
- creator (ref User)
- category, status
- startDate, endDate
- blockchainTxHash, contractAddress
- donations array

### Donation
- campaign (ref Campaign)
- donor (ref User)
- amount
- message
- txHash (blockchain transaction hash)
- blockNumber
- status

## 🔐 Bảo mật

- ✅ Password hashing với bcrypt
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Transaction verification trên blockchain

## 🚀 Công nghệ sử dụng

### Frontend
- React 18
- React Router
- Tailwind CSS
- Web3.js
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB với Mongoose
- JWT
- bcryptjs
- Web3.js

### Blockchain
- Solidity Smart Contracts
- Ethereum (hoặc blockchain tương thích)
- Web3.js integration
