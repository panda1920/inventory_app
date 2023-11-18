import { NextApiRequest, NextApiResponse } from 'next'

import { setCookieString } from '@/helper/cookies'
import { auth } from '@/helper/firebase-admin'

type SuccessResponseData = {
  success: true
  username: string
}

type FailResponseData = {
  success: false
  message?: string
}

type Data = SuccessResponseData | FailResponseData

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const token = req.body.token
  if (!token) return res.status(400).json({ success: false })

  try {
    const decoded = await auth.verifyIdToken(token, true)
    console.log('🚀 ~ file: login.ts:23 ~ handler ~ decoded:', decoded)

    const user = await auth.getUser(decoded.uid)
    console.log('🚀 ~ file: login.ts:27 ~ handler ~ user:', user)

    const cookieValue = await auth.createSessionCookie(token, {
      expiresIn: 1000 * 60 * 60 * 24 * 14, // 2 weeks, in milliseconds
    })

    res.setHeader('Set-Cookie', setCookieString('token', cookieValue))

    // const response = await signInWithEmailAndPassword(auth, email, password)
    res.status(200).json({ success: true, username: user.displayName ?? '' })
  } catch (e: any) {
    console.error(e)
    return res.status(e.error ?? 400).json({ success: false, message: e.message ?? '' })
  }
}
