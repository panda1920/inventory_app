import { decryptEncryptedData, encryptData } from '@/helper/encrypt'

const isProduction = process.env.NODE_ENV === 'production'

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

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#cookie_prefixes
const cookiePrefix = isProduction ? '__Host-' : ''

export const cookieNames = {
  tokenCookie: cookiePrefix + 'TOKEN',
  sessionCookie: cookiePrefix + 'INVENTORY_APP_SESSION',
} as const

export type CookieName = (typeof cookieNames)[keyof typeof cookieNames]

/**
 * Encrypts user information to make it a token cookie
 * @param userInfo
 * @returns
 */
export function createUserTokenCookie(userInfo: UserInfo) {
  return encryptData(JSON.stringify(userInfo))
}

/**
 * Decrypts token cookie and recovers user information from it
 * @param cookie
 */
export function getUserInfoFromUserTokenCookie(tokenCookie: string) {
  return JSON.parse(decryptEncryptedData(tokenCookie))
}
