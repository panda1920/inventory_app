import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/store/store'

type ModalState = {
  isLoginOpen: boolean
  isSignupOpen: boolean
}

const modalSlice = createSlice({
  name: 'modal',
  initialState: { isLoginOpen: false, isSignupOpen: false } as ModalState,
  reducers: {
    setLoginModal(state, action: PayloadAction<(state: ModalState) => boolean>) {
      state.isLoginOpen = action.payload(state)
    },
    setSignupModal(state, action: PayloadAction<(state: ModalState) => boolean>) {
      state.isSignupOpen = action.payload(state)
    },
  },
})

export default modalSlice

// actions
export const { setLoginModal, setSignupModal } = modalSlice.actions

// selectors
export const getIsLoginOpen = (state: RootState) => state.modal.isLoginOpen
export const getIsSignupOpen = (state: RootState) => state.modal.isSignupOpen
