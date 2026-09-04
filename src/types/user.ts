import type { IsoDate, UserId } from './common'

export type Language = 'en' | 'ur' | 'ur-Roman'
export type UserRole = 'manager' | 'contributor'

export interface UserProfile {
  id: UserId
  displayName: string
  email: string
  photoUrl?: string
  language: Language
  onboardingComplete: boolean
  createdAt: IsoDate
  updatedAt: IsoDate
}
