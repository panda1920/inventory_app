import type { AppProps } from 'next/app'
import { StrictMode, useEffect } from 'react'

import Layout from '@/components/app/layout'
import Provider from '@/components/app/provider'
import { saveSession } from '@/store/slice/user'
import store from '@/store/store'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const { user, ...restProps } = pageProps

  useEffect(() => {
    if (!user) return
    store.dispatch(saveSession({ username: user.username }))
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
