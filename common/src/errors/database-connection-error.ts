import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Databse connection error'

  constructor() {
    super('Databse connection error')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializedErrors() {
    return [{
      message: this.reason
    }]
  }
}
