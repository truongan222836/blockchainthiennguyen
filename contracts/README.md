# Smart Contracts

## CharityCampaign.sol

Smart contract chính để quản lý các chiến dịch thiện nguyện trên blockchain.

### Tính năng:
- Tạo chiến dịch mới
- Quyên góp cho chiến dịch
- Theo dõi quyên góp
- Rút tiền khi chiến dịch hoàn thành
- Xem lịch sử quyên góp

### Deploy:
```bash
# Sử dụng Hardhat hoặc Remix IDE
# Cập nhật CONTRACT_ADDRESS trong .env sau khi deploy
```

### Functions:
- `createCampaign()`: Tạo chiến dịch mới
- `donate()`: Quyên góp cho chiến dịch
- `getCampaign()`: Lấy thông tin chiến dịch
- `getCampaignDonations()`: Lấy danh sách quyên góp
- `withdrawFunds()`: Rút tiền (chỉ creator)
