# Website Ứng Dụng Blockchain Cho Thiện Nguyện

## Mô tả
Hệ thống website ứng dụng blockchain để đảm bảo tính an toàn, minh bạch trong hoạt động thiện nguyện. Cho phép tạo chiến dịch, tìm kiếm chiến dịch và quản lý quyên góp một cách minh bạch trên blockchain.

## Tính năng chính
- ✅ Tạo chiến dịch thiện nguyện
- ✅ Tìm kiếm chiến dịch
- ✅ Quyên góp minh bạch trên blockchain
- ✅ Theo dõi lịch sử quyên góp
- ✅ Xác thực người dùng
- ✅ Dashboard quản lý

## Cấu trúc dự án
```
├── frontend/        # Frontend React
├── backend/         # Backend Express.js
├── contracts/       # Smart Contracts Solidity
└── README.md
```

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm run install-all
```

### 2. Cấu hình môi trường
- Tạo file `.env` trong thư mục `backend/` với các biến môi trường cần thiết
- Tạo file `.env` trong thư mục `frontend/` với các biến môi trường cần thiết
- Cấu hình kết nối database và blockchain

### 3. Chạy ứng dụng
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Công nghệ sử dụng
- **Frontend**: React, Tailwind CSS, Web3.js
- **Backend**: Node.js, Express.js, SQLite, Sequelize
- **Blockchain**: Solidity, Ethereum (hoặc blockchain tương thích)

## License
MIT
