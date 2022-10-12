import { Avatar, ConnectButton, CryptoLogos } from 'web3uikit'

interface Props {
  isWeb3Enabled: boolean
}

const NavbarComponent: React.FC<Props> = ({ isWeb3Enabled }) => {
  return (
    <nav>
      <div className="w-full h-20 bg-gray-800 px-8 flex drop-shadow-md flex-row items-center fixed top-0 left-0 right-0 justify-between z-20">
        <div className="flex flex-row items-center justify-center">
          <Avatar isRounded theme="image" />
          <h1 className="text-xl font-bold ml-2 text-white">TeSACCO</h1>
        </div>
        <div className="flex flex-row">
          {isWeb3Enabled && <ConnectButton moralisAuth={false} />}
          <CryptoLogos
            chain="polygon"
            // onClick={function noRefCheck(){}}
            size="40px"
          />
        </div>
      </div>
    </nav>
  )
}

export default NavbarComponent
