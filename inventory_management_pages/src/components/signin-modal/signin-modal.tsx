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
import { useSnackbar } from 'notistack'

import { InventoryAppClientError } from '@/helper/errors'
import { getFirebaseAuth } from '@/helper/firebase'
import { useAppDispatch } from '@/store/hooks'
import { loginAction } from '@/store/slice/user'

const googleAuthProvider = new GoogleAuthProvider()
googleAuthProvider.addScope('profile')
googleAuthProvider.addScope('email')

const githubProvider = new GithubAuthProvider()
githubProvider.addScope('read:user')
githubProvider.addScope('user:email')

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const loginWithProvider = async (provider: AuthProvider) => {
    try {
      const result = await authorizeWithProvider(provider)
      await sendToken(await result.user.getIdToken())
      dispatch(loginAction({ username: result.user.displayName ?? '---' }))
      enqueueSnackbar('You are now logged in.', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('There was an error during login. Please try again.', { variant: 'error' })
    }

    close()
  }

  const authorizeWithProvider = async (provider: AuthProvider) => {
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
    throw new InventoryAppClientError('Login Failed')
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <button onClick={() => loginWithProvider(googleAuthProvider)}>Sign in with Google</button>
        <button onClick={() => loginWithProvider(githubProvider)}>Sign in with github</button>
      </Box>
    </Dialog>
  )
}
