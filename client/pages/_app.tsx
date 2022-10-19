import type { AppProps } from 'next/app'
import { MoralisProvider } from 'react-moralis'
import dynamic from 'next/dynamic'
import { ToastProvider } from 'react-toast-notifications'
import { NotificationProvider } from 'web3uikit'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        {/* <ToastProvider> */}
        <Component {...pageProps} />
        {/* </ToastProvider> */}
      </NotificationProvider>
    </MoralisProvider>
  )
}

// export default MyApp
export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
