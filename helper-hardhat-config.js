const { ethers } = require('hardhat')

const networkConfig = {
  31337: {
    name: 'hardhat',
    interval: '120',
    upkeepRegisteryAddress: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
    upkeepRegistrarAddress: '0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d',
  },
  5: {
    name: 'goerli',
    interval: '120',
    upkeepRegisteryAddress: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
    upkeepRegistrarAddress: '0x9806cf6fBc89aBF286e8140C42174B94836e36F2',
  },
  80001: {
    name: 'mumbai',
    interval: '120',
    upkeepRegisteryAddress: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
    upkeepRegistrarAddress: '0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d',
  },
  1: {
    name: 'mainnet',
    interval: '120',
  },
}

const developmentChains = ['localhost', 'hardhat']

const JOIN_FEE = ethers.utils.parseEther('0.02')

module.exports = {
  networkConfig,
  JOIN_FEE,
  developmentChains,
}
