const { Web3 } = require('web3');
const { Campaign, User, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// 🔹 CẤU HÌNH KẾT NỐI
const RPC_URL = "https://evm-t3.cronos.org"; // Cronos Testnet
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Đọc ABI từ file JSON
const abiPath = path.resolve(__dirname, '../../contracts/CharityCampaign.abi.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

const web3 = new Web3(RPC_URL);
const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

// 🔹 HÀM ĐỒNG BỘ DỮ LIỆU TỪ BLOCKCHAIN
const syncFromBlockchain = async () => {
    try {
        console.log('🔄 Đang kết nối tới Cronos Testnet...');
        console.log(`📍 Contract Address: ${CONTRACT_ADDRESS}`);

        // 1. Lấy tổng số chiến dịch trên Blockchain
        const campaignCount = await contract.methods.campaignCount().call();
        console.log(`📊 Tìm thấy ${campaignCount} chiến dịch trên Blockchain.\n`);

        // Đảm bảo kết nối Database
        await sequelize.authenticate();

        // 2. Tạo một User "System Admin" để gán cho các chiến dịch được phục hồi
        const [adminUser] = await User.findOrCreate({
            where: { email: 'blockchain_sync@system.local' },
            defaults: {
                name: 'Blockchain Sync Bot',
                password: 'password123', // Mật khẩu ngẫu nhiên
                role: 'admin',
                walletAddress: '0x0000000000000000000000000000000000000000'
            }
        });

        // 3. Quét từng chiến dịch
        for (let i = 1; i <= campaignCount; i++) {
            try {
                // Lấy thông tin từ Smart Contract
                const campaignData = await contract.methods.getCampaign(i).call();

                // Giải mã dữ liệu trả về (Struct trong Solidity trả về Array/Object)
                const onChainId = campaignData.id || campaignData[0];
                const title = campaignData.title || campaignData[1];
                const description = campaignData.description || campaignData[2];
                const creatorAddress = campaignData.creator || campaignData[3];
                const goalAmountWei = campaignData.goalAmount || campaignData[4];
                const currentAmountWei = campaignData.currentAmount || campaignData[5];
                const endDateUnix = campaignData.endDate || campaignData[7];
                const isActive = campaignData.isActive || campaignData[8];

                // Chuyển đổi đơn vị
                const goalAmount = parseFloat(web3.utils.fromWei(goalAmountWei, 'ether')) * 2500; // Giả sử tỉ giá 1 TCRO = 2500 VND (như logic frontend)
                const currentAmount = parseFloat(web3.utils.fromWei(currentAmountWei, 'ether')) * 2500;

                // Kiểm tra xem đã có trong DB chưa
                const existingCampaign = await Campaign.findOne({ where: { onChainId: onChainId.toString() } });

                if (!existingCampaign) {
                    // Nếu chưa có -> Tạo mới (Phục hồi)
                    await Campaign.create({
                        title: title,
                        description: description,
                        image: 'https://via.placeholder.com/800x400?text=Restored+from+Blockchain', // Placeholder vì Blockchain không lưu ảnh
                        goalAmount: goalAmount > 0 ? goalAmount : 1000000, // Fallback nếu goal = 0
                        currentAmount: currentAmount,
                        category: 'other', // Mặc định
                        endDate: new Date(Number(endDateUnix) * 1000),
                        creatorId: adminUser.id, // Gán cho Admin Bot
                        status: isActive ? 'active' : 'completed',
                        onChainId: onChainId.toString(),
                        contractAddress: CONTRACT_ADDRESS,
                        blockchainTxHash: 'restored_from_chain_' + Date.now() // Hash giả
                    });
                    console.log(`✅ Đã phục hồi chiến dịch #${onChainId}: ${title}`);
                } else {
                    console.log(`⏩ Chiến dịch #${onChainId} đã tồn tại. Bỏ qua.`);
                }

            } catch (err) {
                console.error(`❌ Lỗi khi đọc chiến dịch #${i}:`, err.message);
            }
        }


        console.log('\n🎉 HOÀN TẤT ĐỒNG BỘ DỮ LIỆU!');
        // process.exit(0); // Removed for module usage

    } catch (error) {
        console.error('❌ Lỗi hệ thống:', error);
        // process.exit(1); // Removed for module usage
        throw error; // Propagate error
    }
};

// Nếu chạy trực tiếp từ command line
if (require.main === module) {
    syncFromBlockchain()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = syncFromBlockchain;
