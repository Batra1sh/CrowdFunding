require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    defaultNetwork: 'sepolia',
    networks: {
      hardhat: {},
      sepolia: {
        url: 'https://rpc.ankr.com/eth_sepolia', // This is the endpoint use to interact to the blockchain
        accounts: [`0x${process.env.PRIVATE_KEY}`] // This is the account we are going to use to deploy our smart contract
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};