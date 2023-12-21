import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine((password) => {
      if (!password.match(/[a-zA-Z]/)) return false
      // if (!password.match(/[0-9]/)) return false
      return true
    }, 'Password must contain a number and an alphabet.'),
})

export type SignupSchema = z.infer<typeof signupSchema>
