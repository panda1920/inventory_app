// import { auth } from '@/helper/firebase'

type Data = {
  token: string
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
//   const email = process.env.SAMPLE_EMAIL || ''
//   const password = 'password'

//   const response = await signInWithEmailAndPassword(auth, email, password)
//   res.status(200).json({ token: signToken({ id: response.user.uid }) })
// }
