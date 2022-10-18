import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MoralisProvider } from 'react-moralis'
import { ToastProvider, useToasts } from 'react-toast-notifications'

import { NotificationProvider } from 'web3uikit'

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
