export type AppErrorCode = 'permission-denied' | 'offline' | 'conflict' | 'validation' | 'configuration' | 'unknown'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message: string, options?: ErrorOptions) {
    super(message, options)
    this.code = code
    this.name = 'AppError'
  }
}

export const errorMessage = (error: unknown): string => error instanceof AppError ? error.message : 'Something went wrong. Please try again.'
