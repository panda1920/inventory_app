import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import MaterialProvider from '@/components/app/material-provider'
import NotistackProvider from '@/components/app/notistack-provider'
import store, { persistor } from '@/store/store'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MaterialProvider>
          <NotistackProvider>{children}</NotistackProvider>
        </MaterialProvider>
      </PersistGate>
    </ReduxProvider>
  )
}
