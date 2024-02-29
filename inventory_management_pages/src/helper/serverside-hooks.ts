import { ParsedUrlQuery } from 'querystring'

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next'

import { decodeSessionCookie, decodeTokenCookie } from '@/helper/api'
import { cookieNames, createUserTokenCookie, eraseCookieString } from '@/helper/cookies'
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
    const user = await extractUserInfoFromContext(context)
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

async function extractUserInfoFromContext(context: GetServerSidePropsContext) {
  let user: UserInfo | undefined

  // first attempt, get userinfo from token
  try {
    user = decodeTokenCookie(context.req.cookies)
    if (user) return user
  } catch (e) {
    console.error(e)
  }

  // if retrieval from token fails then get from session
  try {
    user = await decodeSession(context)
    return user
  } catch (e) {
    console.error(e)
    return undefined
  } finally {
    const cookies = user
      ? [
          // if user is found from session recreate token cookie
          createUserTokenCookie(user),
        ]
      : [
          // if user was not found from session invalidate both cookies
          eraseCookieString(cookieNames.tokenCookie),
          eraseCookieString(cookieNames.sessionCookie),
        ]
    context.res.setHeader('Set-Cookie', cookies)
  }
}

async function decodeSession(context: GetServerSidePropsContext) {
  const claims = await decodeSessionCookie(context.req.cookies)
  if (!claims) return claims

  const user = await auth.getUser(claims.uid)
  return {
    uid: user.uid,
    username: user.displayName || '',
  } satisfies UserInfo
}

async function includeUserInfoToProps<T>(
  propsResult: GetServerSidePropsResult<T>,
  userInfo?: UserInfo,
) {
  // do nothing when session info was not found
  if (!userInfo) return propsResult
  // do nothing when redirect or notfound
  if ('redirect' in propsResult || 'notFound' in propsResult) return propsResult

  const propsResultWithUserInfo = {
    props: {
      ...(await propsResult.props),
      user: { uid: userInfo.uid, username: userInfo.username ?? '' } as UserInfo,
    },
  } satisfies GetServerSidePropsResultWithUserInfo<T>

  return propsResultWithUserInfo
}

type GetServerSidePropsResultWithUserInfo<T> = GetServerSidePropsResult<T & { user: UserInfo }>

type GetServerSidePropsContextWithAuthenticatedUser<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = GetServerSidePropsContext<Params, Preview> & {
  user?: UserInfo
}

type GetServerSidePropsWithAuthenticatedUser<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContextWithAuthenticatedUser<Params, Preview>,
) => Promise<GetServerSidePropsResult<Props>>
