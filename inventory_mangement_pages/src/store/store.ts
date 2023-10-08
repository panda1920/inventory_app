import { configureStore } from '@reduxjs/toolkit'

import userSlice from '@/store/slice/user'

const store = configureStore({
  reducer: { user: userSlice.reducer },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
