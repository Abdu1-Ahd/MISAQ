import Dexie, { type Table } from 'dexie'
import type { Kameti, Period } from '../../types/kameti'
import type { UserProfile } from '../../types/user'
import type { SyncOperation } from '../sync/sync.types'

export class MisaqDatabase extends Dexie {
  users!: Table<UserProfile, string>
  kametis!: Table<Kameti, string>
  periods!: Table<Period, string>
  syncOperations!: Table<SyncOperation, string>

  constructor() {
    super('misaq')
    this.version(1).stores({ users: 'id, updatedAt', kametis: 'id, managerId, status, updatedAt, *memberIds', periods: 'id, [kametiId+periodIndex], kametiId, periodIndex', syncOperations: 'id, [type+aggregateId+dedupeKey+status], status, aggregateId, nextRetryAt' })
  }
}

export const database = new MisaqDatabase()
