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

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
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
