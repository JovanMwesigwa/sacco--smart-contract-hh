const { getNamedAccounts, deployments, ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { JOIN_FEE } = require('../helper-hardhat-config')

describe('Sacco Contract tests', function () {
  let saccoContract, saccoAddress, deployer

  beforeEach(async function () {
    // Deploy  the contracts here...
    const accounts = await getNamedAccounts()
    deployer = accounts.deployer

    // Deploy here
    await deployments.fixture('all')

    saccoContract = await ethers.getContract('Sacco', deployer)
  })

  it('Should deploy successfully', async () => {
    assert(saccoContract.address)
  })

  describe('Constructor', () => {
    it('Should set the join fee', async () => {
      const setFee = await saccoContract.getJoinFee()
      const converted = setFee.toString()
      assert.equal(JOIN_FEE, converted)
    })

    it('Should get a zero balance', async () => {
      const balance = await saccoContract.getBalance()
      const converted = balance.toString()
      assert.equal('0', converted)
    })

    it('Should set the user getting paid to 0', async () => {
      const numberGettingPaid = await saccoContract.getNumberGettingPaid()
      const converted = numberGettingPaid.toString()
      assert.equal('0', converted)
    })

    it('Should get the join fee', async () => {
      const joinFee = await saccoContract.getJoinFee()
      const converted = joinFee.toString()
      assert.equal(JOIN_FEE, converted)
    })
  })
})
