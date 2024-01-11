import { z } from 'zod'

export type SuccessResponse = {
  success: true
}

export type FailResponse = {
  success: false
  message?: string
}

export const idPathParameterSchema = z
  .string()
  .min(1)
  .refine((value) => value.match(/^[0-9a-zA-Z]$/), { message: 'id must be an alphanumeric value' })
  .describe('Schema for id field of entities in this app')

export const getListQueryParameterSchema = z
  .object({
    limit: z.coerce.number().min(1).max(50).int().optional().default(10),
    offset: z.coerce.number().min(0).int().optional().default(0),
  })
  .describe('Schema for query parameters of list-retrieving apis')

export type GetListQueryParameterSchema = z.infer<typeof getListQueryParameterSchema>
