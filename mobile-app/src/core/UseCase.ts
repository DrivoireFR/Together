/**
 * Base class for all UseCases.
 * Standardizes the input/output contract so stores always know how to
 * interpret the result (success data, error message, loading state, etc.).
 */

export type UseCaseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; statusCode?: number };

export abstract class UseCase<Input, Output> {
  abstract execute(input: Input): Promise<UseCaseResult<Output>>;
}

export type NoInput = void;
