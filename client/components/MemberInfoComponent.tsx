import { Avatar } from 'web3uikit'
import MaticIconComponent from './MaticIconComponent'
import { Icon } from '@iconify/react'

const MemberInfoComponent: React.FC<any> = () => {
  return (
    <tr className="text-gray-300 border-b-2 border-gray-500">
      <td className="p-4 text-lg">
        <div>
          <Avatar isRounded theme="image" />
        </div>
      </td>
      <td className="p-4 text-lg">225</td>
      <td className="p-4 text-lg cursor-pointer hover:text-blue-200">
        0x5236gwehjgkjdaedt78823742
      </td>
      <td className="p-4 text-lg flex flex-row items-center">
        0.02 <MaticIconComponent />
      </td>
      <td className="p-4">
        <Icon
          icon="bi:clipboard-check-fill"
          className="text-xl"
          color="#96fac0"
        />
      </td>
    </tr>
  )
}

export default MemberInfoComponent
