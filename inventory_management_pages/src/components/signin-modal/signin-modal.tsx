import { Box } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
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
    const auth = getFirebaseAuth()
    auth.signOut()
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    setPersistence(auth, inMemoryPersistence)

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('🚀 ~ file: signin-modal.tsx:20 ~ googleAuthHandler ~ result:', result)
      const uid = result.user.uid
      console.log('🚀 ~ file: signin-modal.tsx:30 ~ googleAuthHandler ~ uid:', uid)
      const idToken = await result.user.getIdToken()
      console.log('🚀 ~ file: signin-modal.tsx:34 ~ googleAuthHandler ~ idToken:', idToken)

      await sendToken(idToken)
    } catch (e) {
      console.error(e)
      close()
    }
  }

  const githubHandler = async () => {
    const auth = getFirebaseAuth()
    auth.signOut()
    const provider = new GithubAuthProvider()
    provider.addScope('read:user')
    provider.addScope('user:email')
    setPersistence(auth, inMemoryPersistence)

    try {
      const result = await signInWithPopup(auth, provider)
      console.log('🚀 ~ file: signin-modal.tsx:43 ~ githubHandler ~ result:', result)
    } catch (e) {
      console.error(e)
      close()
    }
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
    if (!response.ok) return
    const responseJson = await response.json()

    dispatch(loginAction({ username: responseJson.username }))
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <button onClick={googleAuthHandler}>Sign in with Google</button>
        <button onClick={githubHandler}>Sign in with github</button>
      </Box>
    </Dialog>
  )
}
