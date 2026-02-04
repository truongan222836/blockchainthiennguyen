# 🚀 Hướng dẫn cài đặt nhanh - SQLite

## ✅ Đã chuyển đổi sang SQLite

Hệ thống **KHÔNG CẦN MongoDB** nữa, sử dụng **SQLite** (file database).

## 📦 Bước 1: Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install-all
```

Hoặc cài đặt từng phần:
```bash
cd backend
npm install

cd ../frontend
npm install
```

## ⚙️ Bước 2: Cấu hình

### Backend (.env)
Tạo file `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key-here-change-this
JWT_EXPIRE=7d
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NODE_ENV=development
```

### Frontend (.env)
Tạo file `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
REACT_APP_BLOCKCHAIN_RPC_URL=http://localhost:8545
```

## 🎯 Bước 3: Chạy ứng dụng

```bash
# Chạy cả frontend và backend
npm run dev
```

Hoặc chạy riêng:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 📁 Database

- **Vị trí:** `backend/data/charity.db`
- **Tự động tạo:** Database sẽ tự động được tạo khi chạy backend lần đầu
- **Không cần cài đặt:** SQLite được cài đặt tự động với npm

## ✨ Tính năng

✅ Tạo chiến dịch thiện nguyện
✅ Tìm kiếm chiến dịch (từ khóa, danh mục, trạng thái)
✅ Quyên góp với blockchain
✅ Dashboard cá nhân
✅ Đăng ký/Đăng nhập

## 🔧 Troubleshooting

### Lỗi database
- Xóa `backend/data/charity.db` và restart backend
- Đảm bảo thư mục `backend/data/` có quyền ghi

### Lỗi module not found
```bash
cd backend
npm install
```

### Lỗi port đã sử dụng
- Đổi PORT trong `backend/.env`
- Hoặc đóng process đang dùng port 5000

## 📚 Tài liệu thêm

- Xem `SQLITE_SETUP.md` để biết chi tiết về SQLite
- Xem `SETUP.md` để biết hướng dẫn đầy đủ
- Xem `FEATURES.md` để biết tất cả tính năng

## 🎉 Hoàn thành!

Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health
