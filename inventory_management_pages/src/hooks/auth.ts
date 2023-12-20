import {
  AuthCredential,
  AuthError,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  UserCredential,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
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
  const loginWithGoogleHandler = () => loginWithCredential(authorizeWithGoogle)

  const loginWithGithubHandler = () => loginWithCredential(authorizeWithGithub)

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

  async function loginWithEmail(email: string, password: string) {
    await loginWithCredential(authorizeWithEmail(email, password))
  }

  async function signupWithEmailAndPassword(email: string, password: string) {
    await loginWithCredential(authorizeWithNewEmail(email, password))
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

      switch (e.code) {
        case 'auth/account-exists-with-different-credential':
          await await promptUserToLoginWithOtherMethods(e)
          break
        case 'auth/invalid-login-credentials':
          toastInvalidCredentials()
          break
        case 'auth/email-already-in-use':
          toastEmailUsed()
          break
        default:
          toastGenericLoginError()
      }
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

  async function promptUserToLoginWithOtherMethods(e: AuthError) {
    const credential = OAuthProvider.credentialFromError(e)

    try {
      if (!credential) throw new InventoryAppClientError('Login error')
      setTemporaryAuthCredential(credential)
      toastLoginWithOtherMethods()
    } catch (e) {
      console.error(e)
      toastGenericLoginError()
    }
  }

  // toast functions
  function toastLinkingSuccess() {
    enqueueSnackbar('Your account has been successfully linked to a new login method.', {
      variant: 'success',
    })
  }
  function toastLoginSuccess() {
    enqueueSnackbar('You are now logged in.', { variant: 'success' })
  }
  function toastLogoutSuccess() {
    enqueueSnackbar('You are now logged out.', { variant: 'success' })
  }
  function toastVerifyEmail() {
    enqueueSnackbar(
      'Verification email has been sent.\nPlease verify your account by clicking the link in email.',
      { variant: 'info' },
    )
  }
  function toastLoginWithOtherMethods() {
    enqueueSnackbar(
      `There is already an existing account.\nPlease login with previously used method to link your current`,
      { variant: 'info' },
    )
  }
  function toastInvalidCredentials() {
    enqueueSnackbar('Failed to login.\nPlease check your email/password.', { variant: 'error' })
  }
  function toastGenericLoginError() {
    enqueueSnackbar('There was an error during login.\nPlease try again.', { variant: 'error' })
  }

  function toastEmailUsed() {
    enqueueSnackbar('Failed to signup.\nThe email provided is already used', { variant: 'error' })
  }

  return {
    loginWithEmail,
    loginWithGoogleHandler,
    loginWithGithubHandler,
    loginToBackend,
    logoutFromBackend,
    signupWithEmailAndPassword,
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
const authorizeWithNewEmail = (email: string, password: string) => async () =>
  createUserWithEmailAndPassword(getInitializedFirebaseAuth(), email, password)

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
