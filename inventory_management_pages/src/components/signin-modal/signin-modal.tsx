import { Box } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  UserCredential,
  inMemoryPersistence,
  linkWithCredential,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useSnackbar } from 'notistack'

import { InventoryAppClientError } from '@/helper/errors'
import { getFirebaseAuth } from '@/helper/firebase'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearCredentialAction,
  getTemporaryCredential,
  loginAction,
  saveCredentialAction,
} from '@/store/slice/user'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const temporaryCredential = useAppSelector(getTemporaryCredential)

  const loginWithCredential = async (authorizeForCredential: () => Promise<UserCredential>) => {
    try {
      const result = await authorizeForCredential()

      // if credential is coming from an unverified source, force verification
      if (!result.user.emailVerified) {
        toastVerifyEmail()
        return sendEmailVerification(result.user)
      }

      // otherwise just login to backen
      await loginToBackend(result)
    } catch (e: any) {
      console.error(e)
      // found an existing account using different credential
      if (e.code === 'auth/account-exists-with-different-credential')
        return await promptUserToSigninWithOtherMethods(e)

      toastGenericLoginError()
    }

    close()
  }

  async function loginToBackend(credential: UserCredential) {
    await sendToken(await credential.user.getIdToken())
    dispatch(loginAction({ username: credential.user.displayName ?? '---' }))
    toastLoginSuccess()

    if (!temporaryCredential) return
    try {
      // link credential if user attempted to login with other login methods
      await linkWithCredential(credential.user, temporaryCredential)
      toastLinkingSuccess()
      dispatch(clearCredentialAction())
    } catch (e) {
      console.error(e)
    }
  }

  async function promptUserToSigninWithOtherMethods(e: AuthError) {
    const credential = OAuthProvider.credentialFromError(e)

    try {
      if (!credential) throw new InventoryAppClientError('Login error')
      dispatch(saveCredentialAction({ credential }))
      toastSigninWithOtherMethods()
    } catch (e) {
      console.error(e)
      toastGenericLoginError()
    }
  }

  // API call
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

  // toast functions
  function toastVerifyEmail() {
    enqueueSnackbar(
      'Verification email has been sent.\nPlease verify your account by clicking the link in email.',
      { variant: 'info' },
    )
  }
  function toastLinkingSuccess() {
    enqueueSnackbar('Your account has been successfully linked to a new login method.', {
      variant: 'success',
    })
  }
  function toastLoginSuccess() {
    enqueueSnackbar('You are now logged in.', { variant: 'success' })
  }
  function toastSigninWithOtherMethods() {
    enqueueSnackbar(
      `There is already an existing account.\nPlease signin with previously used method to link your current`,
      { variant: 'info' },
    )
  }
  function toastGenericLoginError() {
    enqueueSnackbar('There was an error during login.\nPlease try again.', { variant: 'error' })
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Login</DialogTitle>
      <Box>
        <button onClick={() => loginWithCredential(authorizeWithEmail)}>Sign in with email</button>
        <button onClick={() => loginWithCredential(authorizeWithGoogle)}>
          Sign in with Google
        </button>
        <button onClick={() => loginWithCredential(authorizeWithGithub)}>
          Sign in with github
        </button>
      </Box>
    </Dialog>
  )
}

const googleAuthProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
const initializeAuth = () => {
  const auth = getFirebaseAuth()
  auth.signOut()
  setPersistence(auth, inMemoryPersistence)

  return auth
}

const authorizeWithEmail = async () =>
  signInWithEmailAndPassword(initializeAuth(), 'korean.panda@gmail.com', 'password')
const authorizeWithGithub = async () => signInWithPopup(initializeAuth(), githubProvider)
const authorizeWithGoogle = async () => signInWithPopup(initializeAuth(), googleAuthProvider)
