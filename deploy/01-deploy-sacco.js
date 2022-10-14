const { network } = require('hardhat')
const { JOIN_FEE, networkConfig } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
const INTERVAL = 120

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const upkeepRegisteryAddress =
    networkConfig[chainId]['upkeepRegisteryAddress']

  const args = [JOIN_FEE, INTERVAL, upkeepRegisteryAddress]

  // Deploy the sacco contract on both chainn
  if (chainId === 31337) {
    log(`Local network detected!`)

    await deploy('Sacco', {
      from: deployer,
      args: args,
      log: true,
    })
  } else {
    const saccoContract = await deploy('Sacco', {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: 6,
    })

    log('Verifying...')
    await verify(saccoContract.address, args)
  }
}

module.exports.tags = ['all', 'deploy']
