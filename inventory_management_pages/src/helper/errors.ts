export class InventoryAppServerError extends Error {
  // TODO: super and inheritance
  // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
  errorCode: number

  constructor(message: string, errorCode: number = 400) {
    super(message)
    this.errorCode = errorCode
  }
}
