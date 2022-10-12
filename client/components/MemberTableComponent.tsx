import MemberInfoComponent from './MemberInfoComponent'

const MemberTableComponent: React.FC<any> = () => {
  return (
    <table className="table-fluid w-full my-10 rounded-md">
      <tr className="bg-gray-700 text-gray-400 ">
        <td className="p-4 text-lg">ICON</td>
        <td className="p-4 text-lg">NUMBER</td>
        <td className="p-4 text-lg">ADDRESS</td>
        <td className="p-4 text-lg">BALANCE</td>
        <td className="p-4 text-lg">STATUS</td>
      </tr>
      <tbody>
        <MemberInfoComponent />
        <MemberInfoComponent />
      </tbody>
    </table>
  )
}

export default MemberTableComponent
