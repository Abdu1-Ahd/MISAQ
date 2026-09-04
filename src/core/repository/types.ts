import type { Kameti, Period } from '../../types/kameti'
import type { KametiId, UserId } from '../../types/common'
import type { UserProfile } from '../../types/user'

export interface KametiRepository {
  getById(id: KametiId): Promise<Kameti | undefined>
  listForUser(userId: UserId): Promise<Kameti[]>
  save(kameti: Kameti): Promise<void>
  getCurrentPeriod(kametiId: KametiId): Promise<Period | undefined>
}

export interface UserRepository {
  getById(id: UserId): Promise<UserProfile | undefined>
  save(profile: UserProfile): Promise<void>
}
