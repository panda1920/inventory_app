import { ParsedUrlQuery } from 'querystring'

import { UserRecord } from 'firebase-admin/auth'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next'

import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { auth } from '@/helper/firebase-admin'

/**
 * Helps define common operation that needs to take place
 * before and after the execution of per-page getServerSideProps() function
 * @param serversidePropsFunc
 * @returns
 */
export function withServerSideHooks<T extends object>(
  serversidePropsFunc: GetServerSidePropsWithAuthenticatedUser<T> = emptyProps<T>,
) {
  return (async (context: GetServerSidePropsContextWithAuthenticatedUser) => {
    // do something before here
    const claims = await decodeSession(context)
    const user = claims ? await auth.getUser(claims.uid) : undefined
    context.user = user

    // execute route specific getServerSideProps()
    const propsResult = await serversidePropsFunc(context)

    // do something after here
    const propsResultWithUserInfo = await includeUserInfoToProps(propsResult, user)

    return propsResultWithUserInfo
  }) satisfies GetServerSideProps
}

async function emptyProps<T extends object>() {
  return {
    props: {} as T,
  }
}

async function decodeSession(context: GetServerSidePropsContext) {
  const sessionCookie = context.req.cookies[cookieNames.sessionCookie]

  if (!sessionCookie) return

  try {
    return (await auth.verifySessionCookie(sessionCookie, true)) as IdTokenClaim
  } catch (e) {
    console.error(e)
    // invalidate session if failed to verify
    context.res.setHeader('Set-Cookie', eraseCookieString(cookieNames.sessionCookie))
    return undefined
  }
}

async function includeUserInfoToProps<T>(
  propsResult: GetServerSidePropsResult<T>,
  claims?: UserRecord,
) {
  // do nothing when session info was not found
  if (!claims) return propsResult
  // do nothing when redirect or notfound
  if ('redirect' in propsResult || 'notFound' in propsResult) return propsResult

  const propsResultWithUserInfo = {
    props: {
      ...(await propsResult.props),
      user: { uid: claims.uid, username: claims.displayName ?? '' } as UserInfo,
    },
  } satisfies GetServerSidePropsResultWithUserInfo<T>

  return propsResultWithUserInfo
}

type GetServerSidePropsResultWithUserInfo<T> = GetServerSidePropsResult<T & { user: UserInfo }>

type GetServerSidePropsContextWithAuthenticatedUser<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = GetServerSidePropsContext<Params, Preview> & {
  user?: UserRecord
}

type GetServerSidePropsWithAuthenticatedUser<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContextWithAuthenticatedUser<Params, Preview>,
) => Promise<GetServerSidePropsResult<Props>>
