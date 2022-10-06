const { getNamedAccounts, deployments, ethers } = require('hardhat')
const { expect, assert } = require('chai')
const { JOIN_FEE } = require('../helper-hardhat-config')

describe('Sacco Contract tests', function () {
  let saccoContract, saccoAddress, deployer, signers, signer

  beforeEach(async function () {
    // Deploy  the contracts here...
    const accounts = await getNamedAccounts()
    deployer = accounts.deployer

    // Deploy here
    await deployments.fixture('all')

    // Get signers
    signers = await ethers.getSigners()
    signer = signers[0]

    const contract = await ethers.getContract('Sacco', deployer)
    saccoContract = await contract.connect(signer)
  })

  it('Should deploy successfully', async () => {
    assert(saccoContract.address)
  })

  // it('Should have an account', async () => {
  //   assert(account)
  // })

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

  describe('Join', () => {
    it('reverts when you do not pay enough eth', async () => {
      const litteEth = ethers.utils.parseEther('0.002')
      await expect(saccoContract.join({ value: litteEth })).to.be.reverted
    })

    it('Should increase the member count of the contract', async () => {
      await saccoContract.join({ value: JOIN_FEE })

      const count = await saccoContract.getMemberCount()
      assert.equal(count.toString(), '1')
    })

    it('Should increase the member number', async () => {
      await saccoContract.join({ value: JOIN_FEE })

      const memberNumber = await saccoContract.getMemberNumber(signer.address)
      assert.equal(memberNumber.toString(), '1')
    })

    it('Should increase the contract balance', async () => {
      await saccoContract.join({ value: JOIN_FEE })

      const balance = await saccoContract.getBalance()
      assert.equal(balance.toString(), JOIN_FEE)
    })

    it('Should add the user to the contract', async () => {
      await saccoContract.join({ value: JOIN_FEE })

      const joinedMember = await saccoContract.getMemberIndex(0)
      assert.equal(joinedMember.toString(), signer.address)
    })
  })
})
