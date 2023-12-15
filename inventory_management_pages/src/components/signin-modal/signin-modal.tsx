import { Box } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import {
  AuthCredential,
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  ProviderId,
  UserCredential,
  linkWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

import { InventoryAppClientError } from '@/helper/errors'
import { getInitializedFirebaseAuth } from '@/helper/firebase'
import { useAppDispatch } from '@/store/hooks'
import { loginAction, saveTemporaryCredentialAction } from '@/store/slice/user'

type SigninModalProps = {
  isOpen: boolean
  close: () => void
}

export default function SigninModal({ isOpen, close }: SigninModalProps) {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [temporaryAuthCredential, setTemporaryAuthCredential] = useState<AuthCredential>()

  const loginWithCredential = async (authorizeForCredential: () => Promise<UserCredential>) => {
    try {
      const result = await authorizeForCredential()

      if (!result.user.emailVerified) await promptAccountVerification(result)
      else await loginToBackend(result)
    } catch (e: any) {
      console.error(e)
      // found an existing account using different credential
      if (e.code === 'auth/account-exists-with-different-credential')
        return await promptUserToSigninWithOtherMethods(e)

      toastGenericLoginError()
    }

    close()
  }

  async function promptAccountVerification(credential: UserCredential) {
    toastVerifyEmail()
    sendEmailVerification(credential.user, { handleCodeInApp: false, url: window.location.href })
    if (credential.providerId === ProviderId.PASSWORD) return

    // save credential so it can be used to auto login after verification
    const providerCredential = OAuthProvider.credentialFromResult(credential)
    if (providerCredential)
      dispatch(saveTemporaryCredentialAction({ credential: providerCredential }))
  }

  async function loginToBackend(credential: UserCredential) {
    await sendToken(await credential.user.getIdToken())
    dispatch(loginAction({ username: credential.user.displayName ?? '---' }))
    toastLoginSuccess()

    if (!temporaryAuthCredential) return

    // link credential if user attempted to login with other login methods
    try {
      await linkWithCredential(credential.user, temporaryAuthCredential)
      toastLinkingSuccess()
      setTemporaryAuthCredential(undefined)
    } catch (e) {
      console.error(e)
    }
  }

  async function promptUserToSigninWithOtherMethods(e: AuthError) {
    const credential = OAuthProvider.credentialFromError(e)

    try {
      if (!credential) throw new InventoryAppClientError('Login error')
      setTemporaryAuthCredential(credential)
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

const authorizeWithEmail = async () =>
  signInWithEmailAndPassword(getInitializedFirebaseAuth(), 'korean.panda@gmail.com', 'password')
const authorizeWithGithub = async () =>
  signInWithPopup(getInitializedFirebaseAuth(), githubProvider)
const authorizeWithGoogle = async () =>
  signInWithPopup(getInitializedFirebaseAuth(), googleAuthProvider)
