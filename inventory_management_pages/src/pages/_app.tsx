import { createTheme, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SnackbarProvider } from 'notistack'
import { StrictMode, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import Header from '@/components/header/header'
import { loginAction } from '@/store/slice/user'
import store, { persistor } from '@/store/store'
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
  const { user, ...restProps } = pageProps

  useEffect(() => {
    if (!user) return
    store.dispatch(loginAction({ username: user.username }))
  })

  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={5000}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            preventDuplicate
          >
            <ThemeProvider theme={customTheme}>
              <Head>
                <meta name='viewport' content='initial-scale=1, width=device-width' />
              </Head>
              <Header />
              <Component {...restProps} />
            </ThemeProvider>
          </SnackbarProvider>
        </PersistGate>
      </ReduxProvider>
    </StrictMode>
  )
}
