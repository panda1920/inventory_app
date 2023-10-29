import { configureStore } from '@reduxjs/toolkit'

import counterSlice from '@/store/slice/counter'
import { createUserSlice } from '@/store/slice/user'

export function createStore(token: string | null) {
  return configureStore({
    reducer: { user: createUserSlice({ token }).reducer, counter: counterSlice.reducer },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>

export type AppDispatch = ReturnType<typeof createStore>['dispatch']
