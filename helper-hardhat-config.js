const { ethers } = require('hardhat')

const networkConfig = {
  31337: {
    name: 'hardhat',
    interval: '30',
  },
  5: {
    name: 'goerli',
    interval: '30',
  },
  1: {
    name: 'mainnet',
    interval: '30',
  },
}

const developmentChains = ['localhost', 'hardhat']

const JOIN_FEE = ethers.utils.parseEther('0.02')

module.exports = {
  networkConfig,
  JOIN_FEE,
  developmentChains,
}
