/**
 * Represents the outcome of an operation, encapsulating either a success value or an error.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error, defaults to Error.
 *
 * @remarks
 * - Use {@link Result.ok} to create a successful result.
 * - Use {@link Result.fail} to create a failed result.
 * - Access the value via {@link value} if {@link isSuccess} is true.
 * - Access the error via {@link error} if {@link isFailure} is true.
 * - Use {@link Result.combine} to aggregate multiple results.
 */
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {
    if (_isSuccess && _error) {
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    if (!_isSuccess && !_error) {
      throw new Error("InvalidOperation: A failing result must contain an error message");
    }
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'error' instead.");
    }
    return this._value as T;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error("Can't get the error of a successful result. Use 'value' instead.");
    }
    return this._error as E;
  }

  static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<T = never, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  static combine(results: Result<any, any>[]): Result<void, any> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail(result.error);
      }
    }
    return Result.ok(undefined);
  }

}