import { UserRecord } from 'firebase-admin/auth'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { auth } from '@/helper/firebase-admin'
import { GetServerSidePropsResultWithUserInfo } from '@/types/api'

/**
 * Helps define common operation that needs to take place
 * before and after the execution of per-page getServerSideProps() function
 * @param serversidePropsFunc
 * @returns
 */
export function withServerSideHooks<T extends object>(serversidePropsFunc: GetServerSideProps<T>) {
  return (async (context) => {
    // do something before here
    const claims = await decodeSession(context)
    const user = claims ? await auth.getUser(claims.uid) : undefined

    // execute route specific getServerSideProps()
    const propsResult = await serversidePropsFunc(context)

    // do something after here
    const propsResultWithUserInfo = await includeUserInfoToProps(propsResult, user)

    return propsResultWithUserInfo
  }) satisfies GetServerSideProps
}

export async function decodeSession(context: GetServerSidePropsContext) {
  const sessionCookie = context.req.cookies[cookieNames.sessionCookie] ?? ''

  try {
    return (await auth.verifySessionCookie(sessionCookie, true)) as IdTokenClaim
  } catch (e) {
    console.error(e)
    // invalidate session if failed to verify
    context.res.setHeader('Set-Cookie', eraseCookieString(cookieNames.sessionCookie))
    return undefined
  }
}

export async function includeUserInfoToProps<T>(
  propsResult: GetServerSidePropsResult<T>,
  claims?: UserRecord,
) {
  // do nothing when session info was not found
  if (!claims) return propsResult
  // do nothing when redirect or notfound
  if ('redirect' in propsResult || 'notFound' in propsResult) return propsResult

  const propsResultWithUserInfo: GetServerSidePropsResultWithUserInfo<T> = {
    props: {
      ...(await propsResult.props),
      user: { uid: claims.uid, username: claims.displayName ?? '' } as UserInfo,
    },
  }

  return propsResultWithUserInfo
}
