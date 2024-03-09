import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import appSlice from '@/store/slice/app'
import modalSlice from '@/store/slice/modal'
import userSlice from '@/store/slice/user'

// https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig
const persistConfig = {
  key: 'root-store',
  storage,
  debug: process.env.NODE_ENV !== 'production',
  blacklist: ['user', 'modal'],
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userSlice.reducer,
    app: appSlice.reducer,
    modal: modalSlice.reducer,
  }),
)

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      // https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'modal/setLoginModal',
          'modal/setSignupModal',
          'user/login/rejected',
          'user/logout/rejected',
        ],
      },
    })
  },
})

export default store

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
