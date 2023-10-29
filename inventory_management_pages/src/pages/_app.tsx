import { createTheme, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import Header from '@/components/header/header'
import { createStore } from '@/store/store'
import '@/styles/globals.css'

const customTheme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        // { props: { variant: 'body1' }, style: { fontSize: 11, backgroundColor: 'blue' } },
        // { props: { variant: 'body2' }, style: { fontSize: 32 } },
      ],
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const { token, ...restProps } = pageProps
  const store = createStore(token ?? null)

  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <ThemeProvider theme={customTheme}>
          <Head>
            <meta name='viewport' content='initial-scale=1, width=device-width' />
          </Head>
          <Header />
          <Component {...restProps} />
        </ThemeProvider>
      </ReduxProvider>
    </StrictMode>
  )
}
