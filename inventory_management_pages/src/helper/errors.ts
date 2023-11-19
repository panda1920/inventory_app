export class InventoryAppServerError extends Error {
  errorCode: number

  constructor(message: string, errorCode: number = 400) {
    super(message)
    this.errorCode = errorCode
  }
}
