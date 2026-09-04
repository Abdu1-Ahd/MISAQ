import type { IsoDate, KametiId, PeriodId, UserId } from './common'
import type { PaymentMap } from './payment'

export type KametiStatus = 'processing' | 'active' | 'completed'
export type FrequencyUnit = 'days' | 'weeks' | 'months'

export interface Kameti {
  id: KametiId
  name: string
  managerId: UserId
  amount: number
  frequencyValue: number
  frequencyUnit: FrequencyUnit
  memberCap: number
  memberIds: UserId[]
  memberOrder: UserId[]
  status: KametiStatus
  startedAt?: IsoDate
  firstTurnDate?: IsoDate
  updatedAt: IsoDate
  version: number
  schemaVersion: number
  createdAt: IsoDate
}

export interface Period {
  id: PeriodId
  kametiId: KametiId
  periodIndex: number
  turnHolderUid: UserId
  startDate: IsoDate
  endDate: IsoDate
  payments: PaymentMap
}
