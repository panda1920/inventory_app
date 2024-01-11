import { z } from 'zod'

import { baseSignupSchema } from '@/types/form/signup'

export const loginSchema = z
  .object({
    email: baseSignupSchema.shape.email,
    password: baseSignupSchema.shape.password,
  })
  .describe('Schema email/password login')

export type LoginSchema = z.infer<typeof loginSchema>
