import {
  AuthCredential,
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  UserCredential,
  browserLocalPersistence,
  linkWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

import { InventoryAppClientError } from '@/helper/errors'
import { getFirebaseAuth, getInitializedFirebaseAuth } from '@/helper/firebase'
import { useAppDispatch } from '@/store/hooks'
import { loginAction, logoutAction } from '@/store/slice/user'

type UseAuthParams = {
  afterLoginAction?: () => void
  afterLogoutAction?: () => void
}

export function useAuth(params?: UseAuthParams) {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [temporaryAuthCredential, setTemporaryAuthCredential] = useState<AuthCredential>()

  // exposed functions
  const loginWithEmail = (email: string, password: string) => () =>
    loginWithCredential(authorizeWithEmail(email, password))

  const loginWithGoogle = () => loginWithCredential(authorizeWithGoogle)

  const loginWithGithub = () => loginWithCredential(authorizeWithGithub)

  async function loginToBackend(user: User) {
    await sendToken(await user.getIdToken())
    await signOut(getFirebaseAuth())
    dispatch(loginAction({ username: user.displayName ?? '---' }))
    toastLoginSuccess()
  }

  async function logoutFromBackend() {
    try {
      await logout()
    } catch (e) {
      console.error(e)
    }

    dispatch(logoutAction())
    toastLogoutSuccess()
    params?.afterLogoutAction?.()
  }

  // unexposed implmentation detail
  async function loginWithCredential(authorizeForCredential: () => Promise<UserCredential>) {
    try {
      const result = await authorizeForCredential()

      if (!result.user.emailVerified) return await promptAccountVerification(result)

      await loginToBackend(result.user)
      await linkTemporaryCredential(result.user)
    } catch (e: any) {
      console.error(e)
      // found an existing account using different credential
      if (e.code === 'auth/account-exists-with-different-credential')
        return await promptUserToSigninWithOtherMethods(e)

      if (e.code === 'auth/invalid-login-credentials') return toastInvalidCredentials()

      toastGenericLoginError()
    }

    params?.afterLoginAction?.()
  }

  async function promptAccountVerification(credential: UserCredential) {
    toastVerifyEmail()
    sendEmailVerification(credential.user, { handleCodeInApp: false, url: window.location.href })
    // make sure login state is persisted so it can be used later for verification process
    await getFirebaseAuth().setPersistence(browserLocalPersistence)
  }

  async function linkTemporaryCredential(user: User) {
    if (!temporaryAuthCredential) return

    // link credential if user attempted to login with other login methods
    try {
      await linkWithCredential(user, temporaryAuthCredential)
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
  function toastInvalidCredentials() {
    enqueueSnackbar('Failed to login.\nPlease check your email/password.', { variant: 'error' })
  }
  function toastGenericLoginError() {
    enqueueSnackbar('There was an error during login.\nPlease try again.', { variant: 'error' })
  }
  function toastLogoutSuccess() {
    enqueueSnackbar('You are now logged out.', { variant: 'success' })
  }

  return {
    loginWithEmail,
    loginWithGoogle,
    loginWithGithub,
    loginToBackend,
    logoutFromBackend,
  }
}

// independant data+functions
const googleAuthProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

const authorizeWithEmail = (email: string, password: string) => async () =>
  signInWithEmailAndPassword(getInitializedFirebaseAuth(), email, password)
const authorizeWithGithub = async () =>
  signInWithPopup(getInitializedFirebaseAuth(), githubProvider)
const authorizeWithGoogle = async () =>
  signInWithPopup(getInitializedFirebaseAuth(), googleAuthProvider)

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
async function logout() {
  const url = '/api/logout'
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(url, options)
  const responseJson = await response.json()
  if (response.ok) return responseJson

  throw new InventoryAppClientError(responseJson.messasge ?? 'Error during logout')
}
