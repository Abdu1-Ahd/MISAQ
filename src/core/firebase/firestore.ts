import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from './firebaseApp'

export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined
