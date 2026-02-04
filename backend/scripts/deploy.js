const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const deploy = async () => {
    try {
        console.log('🔄 Đang chuẩn bị deploy smart contract...');

        // 1. Đọc source code contract
        const contractPath = path.resolve(__dirname, '../../contracts/CharityCampaign.sol');
        if (!fs.existsSync(contractPath)) {
            throw new Error(`Không tìm thấy file contract tại: ${contractPath}`);
        }
        const source = fs.readFileSync(contractPath, 'utf8');

        // 2. Compile contract
        console.log('📦 Đang compile contract...');
        const input = {
            language: 'Solidity',
            sources: {
                'CharityCampaign.sol': {
                    content: source,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            const errors = output.errors.filter(e => e.severity === 'error');
            if (errors.length > 0) {
                console.error('❌ Lỗi compile:', errors);
                return;
            }
        }

        const contractFile = output.contracts['CharityCampaign.sol']['CharityCampaign'];
        const bytecode = contractFile.evm.bytecode.object;
        const abi = contractFile.abi;

        // Lưu ABI mới nhất
        const abiPath = path.resolve(__dirname, '../../contracts/CharityCampaign.abi.json');
        fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
        console.log('✅ Đã cập nhật ABI file');

        // 3. Kết nối Blockchain
        const rpcUrl = "https://evm-t3.cronos.org";
        const web3 = new Web3(rpcUrl);

        // 4. Lấy Private Key
        let privateKey = process.env.PRIVATE_KEY.trim();
        if (!privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey;
        }

        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        console.log(`🚀 Đang deploy từ ví: ${account.address}`);
        const balance = await web3.eth.getBalance(account.address);
        console.log(`💰 Số dư: ${web3.utils.fromWei(balance, 'ether')} TCRO`);

        // 5. Deploy
        const contract = new web3.eth.Contract(abi);

        const deployTx = contract.deploy({
            data: bytecode
        });

        const estimatedGas = await deployTx.estimateGas();
        console.log(`⛽ Estimated Gas: ${estimatedGas}`);

        const deployedContract = await deployTx.send({
            from: account.address,
            gas: (estimatedGas * 120n / 100n).toString(), // Buffer gas + BigInt math
            gasPrice: (await web3.eth.getGasPrice()).toString()
        });

        console.log('--------------------------------------------------');
        console.log('✅ DEPLOY THÀNH CÔNG!');
        console.log(`📍 Contract Address: ${deployedContract.options.address}`);
        console.log('--------------------------------------------------');
        console.log('👉 Vui lòng copy địa chỉ trên và cập nhật vào file:');
        console.log('   frontend/src/context/Web3Context.js (biến CONTRACT_ADDRESS)');
        console.log('   backend/.env (biến CONTRACT_ADDRESS)');

    } catch (error) {
        console.error('❌ Lỗi Deploy:', error);
    }
}

deploy();
