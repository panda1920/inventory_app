import { z } from 'zod'

const nameFieldSchema = z.string().min(1, { message: 'Item name must be atleast 1 character long' })
const quantityFieldSchema = z.number().min(0, { message: 'Quantity must be atleast 0' })
const sortOrderSchema = z.number().min(0, { message: 'SortOrder must be atleast 0' })

export const registerItemSchema = z
  .object({
    name: nameFieldSchema,
    quantity: quantityFieldSchema,
  })
  .describe('Schema for item registration')

export type RegisterItemSchema = z.infer<typeof registerItemSchema>

export const updateItemSchema = z
  .object({
    name: nameFieldSchema.optional(),
    quantity: quantityFieldSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .describe('Schema for item update')

export type UpdateItemSchema = z.infer<typeof updateItemSchema>
