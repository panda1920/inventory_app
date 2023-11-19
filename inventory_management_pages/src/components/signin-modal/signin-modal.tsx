import { Box } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth'

import { getFirebaseAuth } from '@/helper/firebase'
import { useAppDispatch } from '@/store/hooks'
import { loginAction } from '@/store/slice/user'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const dispatch = useAppDispatch()

  const googleAuthHandler = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    popupLoginWithProvider(provider)
  }

  const githubAuthHandler = async () => {
    const provider = new GithubAuthProvider()
    provider.addScope('read:user')
    provider.addScope('user:email')

    popupLoginWithProvider(provider)
  }

  const popupLoginWithProvider = async (provider: AuthProvider) => {
    try {
      const result = await popupAuthorizationWithProvider(provider)
      console.log('🚀 ~ file: signin-modal.tsx:56 ~ popupLoginWithProvider ~ result:', result)
      const response = await sendToken(await result.user.getIdToken())
      console.log('🚀 ~ file: signin-modal.tsx:58 ~ popupLoginWithProvider ~ response:', response)
      dispatch(loginAction({ username: result.user.displayName ?? '---' }))
    } catch (e) {
      console.error(e)
      close()
    }
  }

  const popupAuthorizationWithProvider = async (provider: AuthProvider) => {
    const auth = getFirebaseAuth()
    auth.signOut()
    setPersistence(auth, inMemoryPersistence)

    return signInWithPopup(auth, provider)
  }

  async function sendToken(token: string) {
    const url = '/api/login'
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    }

    const response = await fetch(url, options)
    if (response.ok) return await response.json()

    console.error(response.body)
    console.error(response.status)
    throw Error('Login Failed')
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <button onClick={googleAuthHandler}>Sign in with Google</button>
        <button onClick={githubAuthHandler}>Sign in with github</button>
      </Box>
    </Dialog>
  )
}
