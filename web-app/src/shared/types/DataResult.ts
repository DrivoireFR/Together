export abstract class DataResult<T> {
  abstract readonly isSuccess: boolean
  abstract readonly isError: boolean
}

export class DataSuccess<T> extends DataResult<T> {
  readonly isSuccess = true
  readonly isError = false

  constructor(public readonly data: T) {
    super()
  }
}

export class DataError<T> extends DataResult<T> {
  readonly isSuccess = false
  readonly isError = true

  constructor(
    public readonly message: string,
    public readonly statusCode?: number,
    public readonly originalError?: any
  ) {
    super()
  }
}

export type ApiResult<T> = DataSuccess<T> | DataError<T>