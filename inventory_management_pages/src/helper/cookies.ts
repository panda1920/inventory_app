export function getCookie(name: string) {
  const cookies = document.cookie.split(';')
  const found = cookies.find((cookie) => cookie.trim().startsWith(name))
  if (!found) return null

  return found.split('=')[1]
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/`
}

export function eraseCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
