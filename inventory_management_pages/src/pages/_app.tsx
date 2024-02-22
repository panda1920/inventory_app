import type { AppProps } from 'next/app'
import Head from 'next/head'
import { StrictMode, useEffect } from 'react'

import Header from '@/components/header/header'
import { loginAction } from '@/store/slice/user'
import store from '@/store/store'
import Provider from '@/components/app/provider'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const { user, ...restProps } = pageProps

  useEffect(() => {
    if (!user) return
    store.dispatch(loginAction({ username: user.username }))
  })

  return (
    <StrictMode>
      <Provider>
        <Head>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <Header />
        <Component {...restProps} />
      </Provider>
    </StrictMode>
  )
}
