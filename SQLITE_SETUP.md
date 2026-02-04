# Hướng dẫn cài đặt SQLite

## ✅ Đã chuyển đổi từ MongoDB sang SQLite

Hệ thống hiện sử dụng **SQLite** với **Sequelize ORM** thay vì MongoDB.

## 📦 Cài đặt

### Bước 1: Cài đặt dependencies

```bash
cd server
npm install
```

Các package đã được cập nhật:
- ✅ `sequelize` - ORM cho SQLite
- ✅ `sqlite3` - Driver cho SQLite
- ❌ Đã xóa `mongoose` (không cần MongoDB nữa)

### Bước 2: Cấu hình môi trường

Tạo file `.env` trong thư mục `server/`:

```env
PORT=5000
JWT_SECRET=your-secret-key-here-change-this
JWT_EXPIRE=7d
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NODE_ENV=development
```

**Lưu ý:** Không cần `MONGODB_URI` nữa vì SQLite sử dụng file database.

### Bước 3: Chạy server

```bash
cd server
npm run dev
```

## 📁 Cấu trúc Database

Database file sẽ được tạo tự động tại:
```
server/data/charity.db
```

Thư mục `server/data/` sẽ được tạo tự động khi chạy lần đầu.

## 🗄️ Cấu trúc bảng

### Bảng `users`
- id (INTEGER, PRIMARY KEY)
- name (STRING)
- email (STRING, UNIQUE)
- password (STRING, hashed)
- walletAddress (STRING)
- role (ENUM: user, admin, organization)
- avatar (STRING)
- createdAt, updatedAt (TIMESTAMP)

### Bảng `campaigns`
- id (INTEGER, PRIMARY KEY)
- title (STRING)
- description (TEXT)
- image (STRING)
- goalAmount (DECIMAL)
- currentAmount (DECIMAL)
- creatorId (INTEGER, FOREIGN KEY -> users.id)
- category (ENUM)
- status (ENUM: active, completed, cancelled)
- startDate (DATE)
- endDate (DATE)
- blockchainTxHash (STRING)
- contractAddress (STRING)
- createdAt, updatedAt (TIMESTAMP)

### Bảng `donations`
- id (INTEGER, PRIMARY KEY)
- campaignId (INTEGER, FOREIGN KEY -> campaigns.id)
- donorId (INTEGER, FOREIGN KEY -> users.id)
- amount (DECIMAL)
- message (TEXT)
- txHash (STRING, UNIQUE)
- blockNumber (INTEGER)
- status (ENUM: pending, confirmed, failed)
- createdAt, updatedAt (TIMESTAMP)

## 🔄 Migration và Sync

Database sẽ tự động sync khi server khởi động:
- Tạo các bảng nếu chưa tồn tại
- Cập nhật schema nếu có thay đổi (với `alter: true`)

## 💡 Ưu điểm của SQLite

✅ **Không cần cài đặt server database** - SQLite là file-based
✅ **Dễ backup** - Chỉ cần copy file `.db`
✅ **Nhẹ và nhanh** - Phù hợp cho development và small-medium projects
✅ **Portable** - Database file có thể di chuyển dễ dàng

## 🛠️ Quản lý Database

### Xem database bằng SQLite Browser

1. Tải **DB Browser for SQLite**: https://sqlitebrowser.org/
2. Mở file `server/data/charity.db`
3. Xem và chỉnh sửa dữ liệu trực tiếp

### Backup database

```bash
# Copy file database
cp server/data/charity.db server/data/charity.db.backup
```

### Reset database

Xóa file và restart server:
```bash
rm server/data/charity.db
# Server sẽ tạo lại database mới khi khởi động
```

## 📝 Lưu ý

- Database file sẽ được tạo tự động lần đầu chạy
- Đảm bảo thư mục `server/data/` có quyền ghi
- SQLite phù hợp cho development và production nhỏ
- Với production lớn, có thể chuyển sang PostgreSQL/MySQL bằng cách thay đổi config trong `server/config/database.js`

## 🚀 Sẵn sàng sử dụng!

Sau khi cài đặt, chạy server và database sẽ tự động được tạo. Không cần cài đặt MongoDB nữa!
