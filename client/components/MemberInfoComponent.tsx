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
      <td className="p-2 md:p-4 text-sm md:text-lg">
        <div>
          <Avatar isRounded theme="image" />
        </div>
      </td>
      <td className="p-4 md:text-lg">{item?.memberNumber?.toString()}</td>
      <td className="md:p-4 md:text-lg cursor-pointer hover:text-blue-200">
        <p className="md:hidden">{`${item.memberAddress.slice(
          0,
          4
        )}...${item.memberAddress.substr(-3)}`}</p>
        <p className="hidden md:flex">{item.memberAddress}</p>
      </td>
      <td className="hidden md:flex p-4 text-lg flex-row items-center">
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
            className="text-lg md:text-xl"
            color="#96fac0"
          />
        ) : (
          <Icon
            icon="fa-solid:window-close"
            className="text-lg md:text-xl"
            color="#f25591"
          />
        )}
      </td>
    </tr>
  )
}

export default MemberInfoComponent
