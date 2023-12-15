import { CircularProgress } from '@mui/material'
import { applyActionCode, signInWithCredential } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { getFirebaseAuth, getInitializedFirebaseAuth } from '@/helper/firebase'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearTemporaryCredentialAction, getTemporaryCredential } from '@/store/slice/user'

/**
 * A page to handle firebase auth email action
 * https://firebase.google.com/docs/auth/custom-email-handler
 */
export default function Auth() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()
  const temporaryCredential = useAppSelector(getTemporaryCredential)
  const { mode, oobCode, apiKey, continueUrl } = router.query
  console.log(
    '🚀 ~ file: index.tsx:22 ~ Auth ~ mode, oobCode, apiKey, continueUrl:',
    mode,
    oobCode,
    apiKey,
    continueUrl,
  )

  useEffect(() => {
    const handleEmailAction = async () => {
      // basic parameter check
      if (!isParametersValid(mode, oobCode, apiKey, continueUrl)) {
        console.error('Invalid params')
        return router.replace('/')
      }

      if (mode === 'verifyEmail') {
        // TODO: think about delegating this whole chunk to a hook
        // TODO: error handling
        // TODO: think about how to verify email login accounts
        // verify code
        await applyActionCode(getFirebaseAuth(), oobCode as string)
        toastAccountVerified()

        // TODO: need to login to backend as well
        if (temporaryCredential) {
          await signInWithCredential(getInitializedFirebaseAuth(), temporaryCredential)
          dispatch(clearTemporaryCredentialAction())
          toastLoginSuccess()
        }

        // TODO: handle continueUrl with more flexibility
        router.push(continueUrl as string)
      }
    }

    handleEmailAction()
  })

  function toastAccountVerified() {
    enqueueSnackbar('Your account has been verified.', { variant: 'success' })
  }
  function toastLoginSuccess() {
    enqueueSnackbar('You are now logged in.', { variant: 'success' })
  }

  return <CircularProgress />
}

function isParametersValid(mode: any, oobCode: any, apiKey: any, continueUrl: any) {
  if (mode !== 'resetPassword' || mode !== 'recoverEmail' || mode !== 'verifyEmail') return false

  if (!oobCode || !apiKey || !continueUrl) return false

  return true
}

export const getServerSideProps = withServerSideHooks(async () => ({ props: {} }))
