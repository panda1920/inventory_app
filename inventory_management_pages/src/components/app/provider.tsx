import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ReactNode } from 'react'

import store, { persistor } from '@/store/store'
import MaterialProvider from '@/components/app/material-provider'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MaterialProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            preventDuplicate
            action={Dismiss}
          >
            {children}
          </SnackbarProvider>
        </MaterialProvider>
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
