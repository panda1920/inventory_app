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
 * Set cookie on clientside
 * Currently setting no expiration time
 * @param name
 * @param value
 */
export function setCookie(name: CookieName, value: string) {
  document.cookie = `${name}=${value}; Path=/`
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
  return `${name}=${value}; Path=/; SameSite=Lax; HttpOnly`
}

export const cookieNames = {
  tokenCookie: 'token',
  sessionCookie: 'INVENTORY_APP_SESSSION',
} as const

export type CookieName = (typeof cookieNames)[keyof typeof cookieNames]
