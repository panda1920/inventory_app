import { ParsedUrlQuery } from 'querystring'

import { CircularProgress } from '@mui/material'
import { applyActionCode } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

import { InventoryAppClientError } from '@/helper/errors'
import { getFirebaseAuth } from '@/helper/firebase'
import { withServerSideHooks } from '@/helper/serverside-hooks'
import { useAuth } from '@/hooks/auth'

type FirebaseAuthEmailHandlerParams = {
  mode: 'resetPassword' | 'recoverEmail' | 'verifyEmail'
  oobCode: string
  apiKey: string
  continueUrl: string
}

/**
 * A page to handle firebase auth email action
 * https://firebase.google.com/docs/auth/custom-email-handler
 */
export default function Auth() {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { loginToBackend } = useAuth()

  useEffect(() => {
    const handleEmailAction = async () => {
      try {
        // basic parameter check
        if (!isValidFirebaseAuthEmailHandlerParams(router.query)) {
          throw new InventoryAppClientError('Invalid params')
        }
        const { mode, oobCode, continueUrl } = router.query

        if (mode === 'verifyEmail') {
          // verify code
          await applyActionCode(getFirebaseAuth(), oobCode as string)
          toastAccountVerified()

          // automatically login as persisted user
          const persistedUser = getFirebaseAuth().currentUser
          if (persistedUser) await loginToBackend(persistedUser)

          return router.push(continueUrl as string)
        }
      } catch (e) {
        console.error(e)
        return router.replace('/')
      }
    }

    handleEmailAction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toastAccountVerified() {
    enqueueSnackbar('Your account has been verified.', { variant: 'success' })
  }

  return <CircularProgress />
}

function isValidFirebaseAuthEmailHandlerParams(
  queryParams: ParsedUrlQuery,
): queryParams is FirebaseAuthEmailHandlerParams {
  const { mode, oobCode, apiKey, continueUrl } = queryParams

  // should not be undefined or string[]
  if (!mode || !oobCode || !apiKey || !continueUrl) return false
  if (
    Array.isArray(mode) ||
    Array.isArray(oobCode) ||
    Array.isArray(apiKey) ||
    Array.isArray(continueUrl)
  )
    return false

  // should be a certain mode
  if (!['resetPassword', 'recoverEmail', 'verifyEmail'].find((_mode) => _mode === mode))
    return false

  // should be website url
  if (!continueUrl.startsWith(process.env.NEXT_PUBLIC_SITE_URL || '')) return false

  return true
}

export const getServerSideProps = withServerSideHooks()
