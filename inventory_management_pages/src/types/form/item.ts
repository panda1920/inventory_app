import { z } from 'zod'

const nameFieldSchema = z.string().min(1, { message: 'Item name must be atleast 1 character long' })
const quantityFieldSchema = z.number().min(0, { message: 'Quantity must be atleast 0' })
const sortOrderSchema = z.number().min(0, { message: 'SortOrder must be atleast 0' })
const memoFieldSchema = z.string().optional()

export const registerItemSchema = z
  .object({
    name: nameFieldSchema,
    quantity: quantityFieldSchema,
    memo: memoFieldSchema,
  })
  .describe('Schema for item registration')

export type RegisterItemSchema = z.infer<typeof registerItemSchema>

export const updateItemSchema = z
  .object({
    name: nameFieldSchema,
    quantity: quantityFieldSchema,
    memo: memoFieldSchema,
    sortOrder: sortOrderSchema,
  })
  .describe('Schema for item update')

export type UpdateItemSchema = z.infer<typeof updateItemSchema>
