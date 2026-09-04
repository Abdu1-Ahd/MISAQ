import { Timestamp, type DocumentData } from 'firebase/firestore'
import type { Kameti } from '../../types/kameti'
import { firestoreKametiSchema } from '../validation/boundarySchemas'

export const kametiConverter = {
  toFirestore: (kameti: Kameti): DocumentData => ({ ...kameti, createdAt: Timestamp.fromDate(new Date(kameti.createdAt)), updatedAt: Timestamp.fromDate(new Date(kameti.updatedAt)), startedAt: kameti.startedAt ? Timestamp.fromDate(new Date(kameti.startedAt)) : undefined, firstTurnDate: kameti.firstTurnDate ? Timestamp.fromDate(new Date(kameti.firstTurnDate)) : undefined }),
  fromFirestore: (snapshot: { data: () => DocumentData }): Kameti => {
    const data = snapshot.data()
    const toIso = (value: unknown): unknown => value instanceof Timestamp ? value.toDate().toISOString() : value
    return firestoreKametiSchema.parse({ ...data, createdAt: toIso(data.createdAt), updatedAt: toIso(data.updatedAt), startedAt: toIso(data.startedAt), firstTurnDate: toIso(data.firstTurnDate) }) as Kameti
  },
}
