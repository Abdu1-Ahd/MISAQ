import { database } from '../db/database'
import type { UserRepository } from './types'

export const userRepository: UserRepository = {
  getById: (id) => database.users.get(id),
  save: async (profile) => { await database.users.put(profile) },
}
