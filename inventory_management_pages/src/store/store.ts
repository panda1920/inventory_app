import { combineReducers, configureStore } from '@reduxjs/toolkit'

import counterSlice from '@/store/slice/counter'
import userSlice from '@/store/slice/user'

const reducers = combineReducers({ user: userSlice.reducer, counter: counterSlice.reducer })

const store = configureStore({
  reducer: { user: userSlice.reducer, counter: counterSlice.reducer },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
      serializableCheck: {
        ignoredActions: ['user/saveTemporaryCredential'],
      },
    })
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
