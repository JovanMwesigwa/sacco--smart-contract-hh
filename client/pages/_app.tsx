import type { AppProps } from 'next/app'
import { MoralisProvider } from 'react-moralis'
import { ToastProvider, useToasts } from 'react-toast-notifications'
import { NotificationProvider } from 'web3uikit'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp
