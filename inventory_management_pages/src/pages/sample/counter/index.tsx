import jwt from 'jsonwebtoken'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCount, getCurrentCount, incrementAction } from '@/store/slice/counter'

export default function Counter() {
  const count = useAppSelector(getCurrentCount)
  const status = useAppSelector((state) => state.counter.status)
  const dispatch = useAppDispatch()

  const increment = () => dispatch(incrementAction())
  const asyncGet = () => dispatch(fetchCount())

  return (
    <section>
      {status === 'pending' ? <div>Loading</div> : <div>Counter: {count}</div>}
      <button onClick={increment}>increment</button>
      <button onClick={asyncGet}>async get</button>
      <Link href='/sample'>Sample</Link>
    </section>
  )
}

export const getServerSideProps = (async (context) => {
  const { [cookieNames.tokenCookie]: token } = context.req.cookies
  try {
    verifyToken(token)
  } catch (e) {
    context.res.setHeader('Set-Cookie', eraseCookieString(cookieNames.tokenCookie))
  }
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6MTIzNDU2NzgsImlhdCI6MTY5ODg2NTczOSwiZXhwIjoxNzAxNDU3NzM5fQ.rZ31NAapOR3MrH-Adg-90Thr2S30j9qFsIZrz0Psoc0'
  // context.res.setHeader('Set-Cookie', `token=${token}`)

  return {
    props: {},
  }
}) satisfies GetServerSideProps

const secret = 'secret'

function verifyToken(token?: string) {
  if (!token) return

  // verify token and its content somehow
  const payload = jwt.verify(token, secret)
  console.log('🚀 ~ file: index.tsx:50 ~ verifyToken ~ payload:', payload)
}
