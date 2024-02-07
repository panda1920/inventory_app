import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { useAppSelector } from '@/store/hooks'
import { checkLogin } from '@/store/slice/user'

export default function withAuth<T extends object>(Component: React.ComponentType<T>) {
  const Wrapper = (props: T) => {
    const router = useRouter()
    const isLoggedIn = useAppSelector(checkLogin)

    useEffect(() => {
      if (!isLoggedIn) router.replace('/')
    }, [isLoggedIn, router])

    if (!isLoggedIn) return null

    return <Component {...props} />
  }

  Wrapper.displayName = 'WithAuthWrapper'

  return Wrapper
}
