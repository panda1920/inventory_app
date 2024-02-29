import { encryptData } from '@/helper/encrypt'
import { auth } from '@/helper/firebase-admin'

const isProduction = process.env.NODE_ENV === 'production'

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#cookie_prefixes
const cookiePrefix = isProduction ? '__Host-' : ''

export const cookieNames = {
  tokenCookie: cookiePrefix + 'INVENTORY_APP_TOKEN',
  sessionCookie: cookiePrefix + 'INVENTORY_APP_SESSION',
} as const

export type CookieName = (typeof cookieNames)[keyof typeof cookieNames]

const SESSION_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 14 // 2 weeks
const TOKEN_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 // 1 day

/**
 * Get value of cookie by name on clientside
 * @param name
 * @returns
 */
export function getCookie(name: CookieName) {
  const cookies = document.cookie.split(';')
  const found = cookies.find((cookie) => cookie.trim().startsWith(name))
  if (!found) return null

  return found.split('=')[1]
}

/**
 * Delete cookie on clientside
 * @param name
 */
export function eraseCookie(name: CookieName) {
  document.cookie = eraseCookieString(name)
}

/**
 * Create a string used to delete cookie
 * @param name
 * @returns
 */
export function eraseCookieString(name: CookieName) {
  return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

/**
 * Create a string used to set a cookie with given value
 * @param name
 * @param value
 * @returns
 */
export function setCookieString(name: CookieName, value: string, expireAt?: Date) {
  const secureOption = isProduction ? 'Secure' : ''
  const expireString = expireAt ? expireAt.toUTCString() : ''
  return `${name}=${value}; expires=${expireString}; Path=/; SameSite=Lax; HttpOnly; ${secureOption}`
}

/**
 * Create session cookie from id provider tokens
 * @param idToken
 * @returns
 */
export async function createSessionCookie(idToken: string) {
  return setCookieString(
    cookieNames.sessionCookie,
    await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_IN_MS,
    }),
    new Date(Date.now() + SESSION_EXPIRES_IN_MS),
  )
}

/**
 * Encrypts user information to make it a token cookie
 * @param userInfo
 * @returns
 */
export function createUserTokenCookie(userInfo: UserInfo) {
  const encrypted = encryptData(JSON.stringify(userInfo))

  return setCookieString(
    cookieNames.tokenCookie,
    encrypted,
    new Date(Date.now() + TOKEN_EXPIRES_IN_MS),
  )
}
