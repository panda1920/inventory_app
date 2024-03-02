import { ZodError, z } from 'zod'

import { InventoryAppServerError } from '@/helper/errors'

/**
 * validates/converts object based on the schema
 * @param object
 * @param schema
 * @returns
 */
export function parseAsSchemaType<T extends z.ZodTypeAny>(object: object, schema: T): z.infer<T> {
  try {
    return schema.parse(object)
  } catch (e) {
    const message = `Failed to validate object by [${schema.description}]`
    const reason =
      e instanceof ZodError
        ? e.issues.map((issue) => `[${issue.path}: ${issue.message}]`).join(',')
        : undefined
    console.error(JSON.stringify({ message, reason }))
    throw new InventoryAppServerError('Data validation failed', 400)
  }
}
