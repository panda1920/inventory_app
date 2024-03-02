export class InventoryAppBaseError extends Error {
  constructor(message: string) {
    super(message)

    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class InventoryAppServerError extends InventoryAppBaseError {
  errorCode: number

  constructor(message: string, errorCode: number = 400) {
    super(message)
    this.errorCode = errorCode
  }
}

export class InventoryAppClientError extends InventoryAppBaseError {}
