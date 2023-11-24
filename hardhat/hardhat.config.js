require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: [
        {
          privateKey: '0x1111111111111111111111111111111111111111111111111111111111111111',
          balance: '1000000000000000000000', // 1000 ETH
        },
        {
          privateKey: '0x2222222222222222222222222222222222222222222222222222222222222222',
          balance: '2000000000000000000000', // 2000 ETH
        },
        {
          privateKey: '0x3333333333333333333333333333333333333333333333333333333333333333',
          balance: '3000000000000000000000', // 3000 ETH
        },
        {
          privateKey: '0x4444444444444444444444444444444444444444444444444444444444444444',
          balance: '4000000000000000000000', // 4000 ETH
        },
        // Mais contas podem ser adicionadas aqui
      ],
    },
  }
};
