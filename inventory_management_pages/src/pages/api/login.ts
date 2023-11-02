import { signInWithEmailAndPassword } from 'firebase/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '@/helper/firebase'
import { signToken } from '@/helper/jwt'

type Data = {
  token: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const email = process.env.SAMPLE_EMAIL || ''
  const password = 'password'

  const response = await signInWithEmailAndPassword(auth, email, password)
  res.status(200).json({ token: signToken({ id: response.user.uid }) })
}
