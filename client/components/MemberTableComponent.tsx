import MemberInfoComponent from './MemberInfoComponent'

interface Props {
  memberList: any
  numberGettingPaid: string | null
}

const MemberTableComponent: React.FC<Props> = ({
  memberList,
  numberGettingPaid,
}) => {
  return (
    <table className="table-fluid w-full my-10 rounded-md">
      <thead>
        <tr className="bg-gray-700 text-gray-400 ">
          <td className="p-4 text-lg">ICON</td>
          <td className="p-4 text-lg">NUMBER</td>
          <td className="p-4 text-lg">ADDRESS</td>
          <td className="p-4 text-lg">BALANCE</td>
          <td className="p-4 text-lg">STATUS</td>
        </tr>
      </thead>
      <tbody>
        {memberList.map((member: any) => (
          <MemberInfoComponent
            key={member.memberAddress}
            item={member}
            numberGettingPaid={numberGettingPaid}
          />
        ))}
      </tbody>
    </table>
  )
}

export default MemberTableComponent
