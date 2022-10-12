import { ConnectButton } from 'web3uikit'

const NavbarComponent: React.FC<any> = () => {
  return (
    <div>
      <ConnectButton moralisAuth={false} />
      <h1>My nav bar</h1>
    </div>
  )
}

export default NavbarComponent
