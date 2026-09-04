import Dexie from 'dexie'
import { database } from '../db/database'
import type { KametiRepository } from './types'
import type { KametiId, UserId } from '../../types/common'

export const kametiRepository: KametiRepository = {
  getById: (id: KametiId) => database.kametis.get(id),
  listForUser: async (userId: UserId) => {
    const [managed, member] = await Promise.all([database.kametis.where('managerId').equals(userId).toArray(), database.kametis.where('memberIds').equals(userId).toArray()])
    return [...new Map([...managed, ...member].map((kameti) => [kameti.id, kameti])).values()]
  },
  save: async (kameti) => { await database.kametis.put(kameti) },
  getCurrentPeriod: (kametiId) => database.periods.where('[kametiId+periodIndex]').between([kametiId, Dexie.minKey], [kametiId, Dexie.maxKey]).last(),
}
