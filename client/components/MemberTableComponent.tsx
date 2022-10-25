import MemberInfoComponent from './MemberInfoComponent'
import { Loading } from 'web3uikit'

interface Props {
  memberList: any
  numberGettingPaid: string | null
  isLoading: any
  isFetching: any
}

const MemberTableComponent: React.FC<Props> = ({
  memberList,
  numberGettingPaid,
  isLoading,
  isFetching,
}) => {
  if (isLoading || isFetching) {
    return <Loading size={12} spinnerColor="#2E7DAF" spinnerType="loader" />
  }
  return (
    <table className="table-fluid w-full my-10 rounded-md">
      <thead>
        <tr className="bg-gray-700 text-gray-400 ">
          <td className="p-2 md:p-4 text-sm md:text-lg">ICON</td>
          <td className="p-2 md:p-4 text-sm md:text-lg">NUMBER</td>
          <td className="p-2 md:p-4 text-sm md:text-lg">ADDRESS</td>
          <td className="hidden md:flex p-2 md:p-4 text-sm md:text-lg">
            BALANCE
          </td>
          <td className="p-2 md:p-4 text-sm md:text-lg">STATUS</td>
        </tr>
      </thead>
      <tbody>
        {(!isLoading || !isFetching) && (
          <>
            {memberList?.map((member: any) => (
              <MemberInfoComponent
                key={member.memberAddress}
                item={member}
                numberGettingPaid={numberGettingPaid}
              />
            ))}
          </>
        )}
      </tbody>
    </table>
  )
}

export default MemberTableComponent
