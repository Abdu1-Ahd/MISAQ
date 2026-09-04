export type Brand<T, Name extends string> = T & { readonly __brand: Name }

export type KametiId = Brand<string, 'KametiId'>
export type UserId = Brand<string, 'UserId'>
export type PeriodId = Brand<string, 'PeriodId'>
export type SyncOperationId = Brand<string, 'SyncOperationId'>
export type IsoDate = string

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
