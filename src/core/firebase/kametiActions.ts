import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { joinPayloadSchema } from '../validation/boundarySchemas'
import { AppError } from '../errors/AppError'
import { firestore } from './firestore'
import type { KametiId, UserId } from '../../types/common'

export async function joinKameti(kametiId: KametiId, userId: UserId): Promise<void> {
  if (!firestore) throw new AppError('configuration', 'Firebase is not configured.')
  const activeFirestore = firestore
  joinPayloadSchema.parse({ kametiId, userId })
  await runTransaction(activeFirestore, async (transaction) => {
    const reference = doc(activeFirestore, 'kametis', kametiId)
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new AppError('validation', 'This Kameti could not be found.')
    const data = snapshot.data()
    if (data.status !== 'processing' || !Array.isArray(data.memberIds) || typeof data.memberCap !== 'number') throw new AppError('validation', 'This Kameti is not accepting members.')
    const members = data.memberIds as string[]
    if (members.includes(userId)) return
    if (members.length >= data.memberCap) throw new AppError('validation', 'This Kameti is full.')
    transaction.update(reference, { memberIds: [...members, userId], updatedAt: serverTimestamp() })
  })
}
