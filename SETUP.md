# Hướng dẫn cài đặt và chạy dự án

## Yêu cầu hệ thống

- Node.js (v16 trở lên)
- SQLite (tự động cài đặt với npm)
- MetaMask hoặc ví blockchain tương thích
- npm hoặc yarn

## Bước 1: Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài đặt từng phần:
cd backend && npm install
cd ../frontend && npm install
```

## Bước 2: Cấu hình Backend

1. Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
JWT_SECRET=your-secret-key-here-change-this
JWT_EXPIRE=7d
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NODE_ENV=development
```

**Lưu ý:** Không cần MongoDB nữa! Hệ thống sử dụng SQLite, database sẽ tự động được tạo tại `backend/data/charity.db` khi chạy lần đầu.

## Bước 3: Cấu hình Frontend

1. Tạo file `.env` trong thư mục `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
REACT_APP_BLOCKCHAIN_RPC_URL=http://localhost:8545
```

## Bước 4: Deploy Smart Contract (Tùy chọn)

1. Sử dụng Remix IDE hoặc Hardhat để compile và deploy contract `CharityCampaign.sol`
2. Copy địa chỉ contract sau khi deploy và cập nhật vào `.env` files

## Bước 5: Chạy ứng dụng

### Chạy cả Frontend và Backend cùng lúc:
```bash
npm run dev
```

### Hoặc chạy riêng biệt:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

## Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Tính năng chính

✅ **Tạo chiến dịch**: Người dùng có thể tạo chiến dịch thiện nguyện mới
✅ **Tìm kiếm chiến dịch**: Tìm kiếm theo từ khóa, danh mục, trạng thái
✅ **Quyên góp**: Quyên góp cho chiến dịch thông qua blockchain
✅ **Dashboard**: Xem thống kê và quản lý chiến dịch của mình
✅ **Xác thực**: Đăng ký, đăng nhập với JWT
✅ **Blockchain**: Tích hợp Web3 và MetaMask

## Lưu ý

- Database SQLite sẽ tự động được tạo tại `server/data/charity.db` khi chạy lần đầu
- Cần kết nối ví blockchain (MetaMask) để sử dụng tính năng quyên góp
- Smart contract cần được deploy trước khi sử dụng tính năng blockchain đầy đủ

## Troubleshooting

### Lỗi kết nối Database:
- Đảm bảo thư mục `server/data/` có quyền ghi
- Xóa file `server/data/charity.db` và restart server để tạo lại database

### Lỗi CORS:
- Đảm bảo backend đã cấu hình CORS đúng
- Kiểm tra REACT_APP_API_URL trong frontend `.env`

### Lỗi Web3:
- Cài đặt MetaMask extension
- Đảm bảo đã kết nối ví trong trình duyệt
