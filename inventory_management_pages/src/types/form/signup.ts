import { z } from 'zod'

export const signupSchema = z
  .object({
    username: z.string().min(6, { message: 'Username must be at least 6 characters long.' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .refine((password) => {
        if (!password.match(/[a-zA-Z]/)) return false
        // if (!password.match(/[0-9]/)) return false
        return true
      }, 'Password must contain a number and an alphabet.'),
    confirm: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .refine((confirm) => {
        if (!confirm.match(/[a-zA-Z]/)) return false
        // if (!confirm.match(/[0-9]/)) return false
        return true
      }, 'Password must contain a number and an alphabet.'),
  })
  .refine(
    (schema) => {
      return schema.password === schema.confirm
    },
    { message: "Passwords don't match", path: ['confirm'] },
  )

export type SignupSchema = z.infer<typeof signupSchema>
