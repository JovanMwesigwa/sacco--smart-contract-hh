import { ethers } from 'ethers'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { useToasts } from 'react-toast-notifications'

// import {
//   DescriptionComponent,
//   MemberTableComponent,
//   NavbarComponent,
// } from '../components'

const DescriptionComponent = dynamic(
  () => import('../components/DescriptionComponent'),
  { ssr: false }
)
const MemberTableComponent = dynamic(
  () => import('../components/MemberTableComponent'),
  { ssr: false }
)
const NavbarComponent = dynamic(() => import('../components/NavbarComponent'), {
  ssr: false,
})

import { ABI, CONTRACT_ADDRESS } from '../constants'

const WEBSOCKET_PROVIDER =
  process.env.NEXT_WEBSOCKET_PROVIDER ||
  'wss://polygon-mumbai.g.alchemy.com/v2/nwantinti'

// 0.35764279

const Home: NextPage = () => {
  const webSocketProvider = new ethers.providers.WebSocketProvider(
    WEBSOCKET_PROVIDER
  )

  const [contractBalance, setContractBalance] = useState('0')
  const [memberCount, setMemberCount] = useState('0')
  const [joinFee, setJoinFee] = useState('0')
  const [numberGettingPaid, setNumberGettingPaid] = useState('0')
  const [lastTimestamp, setLastTimestamp] = useState(null)
  const [currentMemberNumber, setCurrentMemberNumber] = useState(null)
  const [interval, setInterval] = useState(null)
  const [memberList, setMemberList] = useState([])
  const [memberDetails, setMemberDetails] = useState({})

  const { isWeb3Enabled, Moralis, account } = useMoralis()

  useEffect(() => {
    if (isWeb3Enabled) {
      populateData()
    }
  }, [isWeb3Enabled, account, contractBalance, numberGettingPaid])

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, webSocketProvider)

  const populateData = async () => {
    try {
      const balance: any = await getBalance()
      setContractBalance(balance.toString())

      const joinAmount: any = await getJoinFee()
      setJoinFee(joinAmount.toString())

      const members: any = await getMemberCount()
      setMemberCount(members.toString())

      const memberArray: any = await getMembersList()
      setMemberList(memberArray)

      const number: any = await getNumberGettingPaid()
      setNumberGettingPaid(number.toString())

      const userNumber: any = await getMemberNumber()
      setCurrentMemberNumber(userNumber.toString())
      console.log(userNumber.toString())

      const timestamp: any = await getLastTimestamp()
      setLastTimestamp(timestamp.toString())

      const saccoInterval: any = await getInterval()
      setInterval(saccoInterval.toString())

      const memberDetail: any = await getMembersDetails()
      setMemberDetails(memberDetail)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const { runContractFunction: getBalance } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getBalance',
    params: {},
  })

  const { runContractFunction: getJoinFee } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getJoinFee',
    params: {},
  })

  const { runContractFunction: getMemberCount } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getMemberCount',
    params: {},
  })

  const { runContractFunction: getNumberGettingPaid } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getNumberGettingPaid',
    params: {},
  })

  const { runContractFunction: getMemberNumber } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getMemberNumber',
    params: { memberAddress: account },
  })

  const { runContractFunction: getInterval } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getInterval',
    params: {},
  })

  const { runContractFunction: getMembersList } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getMembersList',
    params: {},
  })

  const { runContractFunction: getLastTimestamp } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getLastTimestamp',
    params: {},
  })

  const { runContractFunction: getMembersDetails } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getMembersDetails',
    params: {
      memberAddress_: account,
    },
  })

  const {
    runContractFunction: join,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'join',
    params: {},
    msgValue: joinFee,
  })

  const deposit = async () => {
    try {
      // sending 0.5 tokens with 18 decimals
      const options: any = {
        type: 'native',
        amount: Moralis.Units.ETH('0.02'),
        receiver: CONTRACT_ADDRESS,
      }
      let result = await Moralis.transfer(options)
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Head>
        <title>TeSacco</title>
        <meta
          name="Decentralized group savings application"
          content="Generated by create next app"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com"> */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="flex flex-col flex-1 mt-20">
        <NavbarComponent isWeb3Enabled={isWeb3Enabled} />

        <div className=" bg-gray-900 p-5 md:p-10 h-screen">
          <DescriptionComponent
            isWeb3Enabled={isWeb3Enabled}
            contractBalance={contractBalance}
            joinFee={joinFee}
            memberCount={memberCount}
            numberGettingPaid={numberGettingPaid}
            currentMemberNumber={currentMemberNumber}
            interval={interval}
            join={join}
            isLoading={isLoading}
            isFetching={isFetching}
            populateData={populateData}
            lastTimestamp={lastTimestamp}
            deposit={deposit}
            memberDetails={memberDetails}
            contract={contract}
          />
          <div className="w-full">
            <MemberTableComponent
              memberList={memberList}
              numberGettingPaid={numberGettingPaid}
            />
          </div>
        </div>
      </main>

      <footer className=""></footer>
    </div>
  )
}

export default Home
