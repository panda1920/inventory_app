import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { verifyToken } from '@/helper/jwt'

/**
 * Helps define common operation that needs to take place
 * before and after the execution of per-page getServerSideProps() function
 * @param serversidePropsFunc
 * @returns
 */
export function withServerSideHooks<T extends object>(serversidePropsFunc: GetServerSideProps<T>) {
  return (async (context) => {
    // do something before here
    // invalidateSession(context)

    // execute getServerSideProps()
    const returnValue = await serversidePropsFunc(context)

    // do something after here

    return { ...returnValue }
  }) satisfies GetServerSideProps
}

export function invalidateSession(context: GetServerSidePropsContext) {
  const { [cookieNames.tokenCookie]: token } = context.req.cookies
  console.log('🚀 ~ file: serverside-hooks.ts:28 ~ invalidateSession ~ token:', token)
  if (!token) return

  try {
    verifyToken(token)
  } catch (e) {
    console.log('🚀 ~ file: serverside-hooks.ts:34 ~ invalidateSession ~ e:', e)
    console.log('####### faild to verify token')
    context.res.setHeader('Set-Cookie', eraseCookieString(cookieNames.tokenCookie))
  }
}
