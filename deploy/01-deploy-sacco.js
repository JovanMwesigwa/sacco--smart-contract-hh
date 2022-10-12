const { network } = require('hardhat')
const { JOIN_FEE } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
const INTERVAL = 30

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const args = [JOIN_FEE, INTERVAL]

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
      waitConfirmations: network.config.blockConfirmation || 1,
    })

    log('Verifying...')
    await verify(saccoContract.address, args)
  }
}

module.exports.tags = ['all', 'deploy']
