import type { NextApiRequest, NextApiResponse } from 'next'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '@/helper/firebase'


type Data = {
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    const email = process.env.SAMPLE_EMAIL || ''
    const password = "password"
    
    const response = await signInWithEmailAndPassword(auth, email, password)
    console.log(response.user)
    res.status(200).json({ token: await response.user.getIdToken() })
}
