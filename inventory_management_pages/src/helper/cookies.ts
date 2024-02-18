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
export function setCookieString(name: CookieName, value: string) {
  const secureOption = isProduction ? 'Secure' : ''
  return `${name}=${value}; Path=/; SameSite=Lax; HttpOnly; ${secureOption}`
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#cookie_prefixes
const cookiePrefix = isProduction ? '__Host-' : ''

export const cookieNames = {
  tokenCookie: cookiePrefix + 'token',
  sessionCookie: cookiePrefix + 'INVENTORY_APP_SESSION',
} as const

export type CookieName = (typeof cookieNames)[keyof typeof cookieNames]
