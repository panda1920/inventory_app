import crypto from 'node:crypto'

import { InventoryAppServerError } from '@/helper/errors'

const secret = process.env.SECRET || ''
const encryptionMethod = 'aes-256-cbc'

if (!secret) {
  throw new InventoryAppServerError('Failed to encrypt data', 500)
}

const key = crypto.createHash('sha512').update(secret).digest('hex').substring(0, 32)

export function encryptData(data: string) {
  const iv = crypto.randomBytes(16) // must be 16 bytes
  const cipher = crypto.createCipheriv(encryptionMethod!, key, iv)

  const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')

  // concatenate iv with the encrypted string
  return `${iv.toString('hex')}.${encrypted}`
}

export function decryptEncryptedData(encrypted: string) {
  const [ivString, encryptedString] = encrypted.split('.')
  const iv = Buffer.from(ivString, 'hex')
  const decipher = crypto.createDecipheriv(encryptionMethod, key, iv)

  return decipher.update(encryptedString, 'hex', 'utf8') + decipher.final('utf8')
}
