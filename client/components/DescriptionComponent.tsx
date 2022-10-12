import { useState } from 'react'
import { ConnectButton, Loading } from 'web3uikit'
import { useMoralis } from 'react-moralis'

import MaticIconComponent from './MaticIconComponent'
import { ethers } from 'ethers'

interface Props {
  isWeb3Enabled: boolean
  contractBalance: any
  joinFee: any
  memberCount: String
  numberGettingPaid: String
  interval: String | null
  currentMemberNumber: any
  join: () => void
  isLoading: boolean
  isFetching: boolean
}

const DescriptionComponent: React.FC<Props> = ({
  isWeb3Enabled,
  contractBalance,
  joinFee,
  memberCount,
  numberGettingPaid,
  currentMemberNumber,
  interval,
  join,
  isLoading,
  isFetching,
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div>
        <h1 className="text-2xl text-gray-100 font-bold mb-4">
          Crypto savers // deFI - SACCO
        </h1>
        <div className="flex flex-row items-center">
          <h3 className="text-gray-400">Join with </h3>
          <div className=" flex flex-row items-center">
            <h3 className="text-gray-400 ml-2">
              {ethers.utils.formatUnits(joinFee, 'ether')}
            </h3>
            <MaticIconComponent />
          </div>
        </div>
        <h3 className="text-gray-400">{memberCount} Members</h3>
        <h3 className="text-green-400">{numberGettingPaid} Next</h3>
        <h3 className="text-red-500 text-sm">Payout every {interval} secs</h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        {isWeb3Enabled ? (
          currentMemberNumber != '0' ? (
            <h1 className="text-gray-400">
              Your number is: {currentMemberNumber}
            </h1>
          ) : isLoading || isFetching ? (
            <div
              style={{
                backgroundColor: '#ECECFE',
                borderRadius: '10px',
                padding: '18px',
              }}
            >
              <Loading size={12} spinnerColor="#2E7DAF" spinnerType="wave" />
            </div>
          ) : (
            <button
              onClick={join}
              className="p-2 bg-green-500 w-full px-10 rounded-full text-white"
              disabled={isLoading || isFetching}
            >
              JOIN
            </button>
          )
        ) : (
          <ConnectButton moralisAuth={false} />
        )}

        {isWeb3Enabled && (
          <div className="flex flex-row items-center justify-center mt-2">
            <h3 className=" text-gray-100 ">
              Bal - {ethers.utils.formatUnits(contractBalance, 'ether')}{' '}
            </h3>
            <MaticIconComponent />
          </div>
        )}
      </div>
    </div>
  )
}

export default DescriptionComponent
