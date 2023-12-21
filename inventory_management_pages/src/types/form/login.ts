import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine((password) => {
      if (!password.match(/[a-zA-Z]/)) return false
      // if (!password.match(/[0-9]/)) return false
      return true
    }, 'Password must contain atleast 1 numeric and 1 alphabetical character.'),
})

export type LoginSchema = z.infer<typeof loginSchema>
