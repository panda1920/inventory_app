import { createTheme, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ReactNode } from 'react'

import store, { persistor } from '@/store/store'

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

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={5000}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          preventDuplicate
        >
          <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
        </SnackbarProvider>
      </PersistGate>
    </ReduxProvider>
  )
}
