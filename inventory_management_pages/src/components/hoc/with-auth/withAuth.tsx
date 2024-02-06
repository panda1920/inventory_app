import { useAppSelector } from '@/store/hooks'
import { checkLogin } from '@/store/slice/user'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return (props: T) => {
    const router = useRouter()
    const isLoggedIn = useAppSelector(checkLogin)

    useEffect(() => {
      console.log('🚀 ~ return ~ isLoggedIn:', isLoggedIn)
      if (!isLoggedIn) router.replace('/')
    }, [isLoggedIn])

    if (!isLoggedIn) return null

    return <Component {...props} />
  }
}
