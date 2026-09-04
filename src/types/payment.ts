import type { IsoDate, UserId } from './common'

export type PaymentStatus = 'paid' | 'pending'

export interface PaymentRecord {
  status: PaymentStatus
  updatedAt?: IsoDate
  updatedBy?: UserId
}

export type PaymentMap = Record<string, PaymentRecord>
