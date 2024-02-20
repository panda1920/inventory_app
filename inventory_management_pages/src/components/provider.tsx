import { createTheme, ThemeProvider } from '@mui/material'
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ReactNode } from 'react'

import store, { persistor } from '@/store/store'

// https://mui.com/material-ui/customization/theming/
const customTheme = createTheme({
  // https://mui.com/material-ui/guides/typescript/#customization-of-theme
  palette: {
    primary: { main: '#A7CECB' },
    secondary: { main: '#75704E' },
    tertiary: { main: '#FFEDE1' },
    // primary: { main: '#435058' },
    // background: { main: '#FFEDE1' },
    error: { main: '#B7245C' },
  },
  // customize breakpoints so it aligns with tailwind values
  // https://tailwindcss.com/docs/responsive-design
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  typography: {
    fontSize: 12,
  },
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
        <ThemeProvider theme={customTheme}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            preventDuplicate
            action={Dismiss}
          >
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

function Dismiss(snackbarId: SnackbarKey) {
  const { closeSnackbar } = useSnackbar()

  return (
    <button onClick={() => closeSnackbar(snackbarId)} className='pr-[8px]'>
      Dismiss
    </button>
  )
}
