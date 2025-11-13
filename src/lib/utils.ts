import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class Result<T, E> {
  public readonly _value: T | null;
  public readonly _error: E | null;

  private constructor(value: T | null, error: E | null) {
    this._value = value;
    this._error = error;
  }

  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }

  static error<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }

  isSuccess(): this is { _value: T; _error: null } {
    return this._error === null;
  }

  isError(): this is { _value: null; _error: E } {
    return this._value === null;
  }

  get value(): T {
    if (this.isError()) {
      throw new Error("Cannot get value from an error Result.");
    }
    return this._value as T;
  }

  get error(): E {
    if (this.isSuccess()) {
      throw new Error("Cannot get error from a success Result.");
    }
    return this._error as E;
  }
}
