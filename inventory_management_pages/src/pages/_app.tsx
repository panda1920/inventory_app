import type { AppProps } from 'next/app'
import { StrictMode, useEffect } from 'react'

import Provider from '@/components/app/provider'
import { loginAction } from '@/store/slice/user'
import store from '@/store/store'
import '@/styles/globals.css'
import Layout from '@/components/app/layout'

export default function App({ Component, pageProps }: AppProps) {
  const { user, ...restProps } = pageProps

  useEffect(() => {
    if (!user) return
    store.dispatch(loginAction({ username: user.username }))
  })

  return (
    <StrictMode>
      <Provider>
        <Layout>
          <Component {...restProps} />
        </Layout>
      </Provider>
    </StrictMode>
  )
}
