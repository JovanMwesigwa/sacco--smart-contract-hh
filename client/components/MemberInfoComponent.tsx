import { Avatar } from 'web3uikit'
import MaticIconComponent from './MaticIconComponent'
import { Icon } from '@iconify/react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { ABI, CONTRACT_ADDRESS } from '../constants'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// 1.4022
// 1.4422

interface Props {
  item: any
  numberGettingPaid: String | null
}

const MemberInfoComponent: React.FC<Props> = ({ item, numberGettingPaid }) => {
  const { isWeb3Enabled, chainId, Moralis, account } = useMoralis()

  const [memberInfo, setMemberInfo] = useState<any>({})

  useEffect(() => {
    if (isWeb3Enabled) {
      populateData()
    }
  }, [isWeb3Enabled])

  const populateData = async () => {
    try {
      const response: any = await getMembersDetails()
      setMemberInfo(response)
    } catch (error) {
      console.log(error)
    }
  }

  const {
    runContractFunction: getMembersDetails,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getMembersDetails',
    params: {
      memberAddress_: item.memberAddress,
    },
  })

  if (isLoading || isFetching) return null

  return (
    <tr className="text-gray-300 border-b-2 border-gray-500">
      <td className="p-4 text-lg">
        <div>
          <Avatar isRounded theme="image" />
        </div>
      </td>
      <td className="p-4 text-lg">{item?.memberNumber?.toString()}</td>
      <td className="p-4 text-lg cursor-pointer hover:text-blue-200">
        {item.memberAddress}
      </td>
      <td className="p-4 text-lg flex flex-row items-center">
        {memberInfo.memberBalance ? (
          <>
            {ethers.utils.formatUnits(
              memberInfo?.memberBalance?.toString(),
              'ether'
            )}
            <MaticIconComponent />
          </>
        ) : (
          <>
            0.0
            <MaticIconComponent />
          </>
        )}
      </td>
      <td className="p-4">
        {numberGettingPaid === item?.memberNumber?.toString() ? (
          <Icon
            icon="bi:clipboard-check-fill"
            className="text-xl"
            color="#96fac0"
          />
        ) : (
          <Icon
            icon="fa-solid:window-close"
            className="text-xl"
            color="#f25591"
          />
        )}
      </td>
    </tr>
  )
}

export default MemberInfoComponent
