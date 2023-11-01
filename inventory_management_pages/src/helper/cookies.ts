export function getCookie(name: CookieName) {
  const cookies = document.cookie.split(';')
  const found = cookies.find((cookie) => cookie.trim().startsWith(name))
  if (!found) return null

  return found.split('=')[1]
}

export function setCookie(name: CookieName, value: string) {
  document.cookie = `${name}=${value}; Path=/`
}

export function eraseCookie(name: CookieName) {
  document.cookie = eraseCookieString(name)
}

export function eraseCookieString(name: CookieName) {
  return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

export const cookieNames = {
  tokenCookie: 'token',
} as const

export type CookieName = (typeof cookieNames)[keyof typeof cookieNames]
