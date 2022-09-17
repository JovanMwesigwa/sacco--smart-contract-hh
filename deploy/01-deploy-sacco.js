const { network } = require('hardhat')
const { JOIN_FEE } = require('../helper-hardhat-config')
const INTERVAL = 30

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // Deploy the sacco contract on both chainn
  if (chainId === 31337) {
    log(`Local network detected!`)

    await deploy('Sacco', {
      from: deployer,
      args: [JOIN_FEE, INTERVAL],
      log: true,
    })
  }
}

module.exports.tags = ['all', 'deploy']
