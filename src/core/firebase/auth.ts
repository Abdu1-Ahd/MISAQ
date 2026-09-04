import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { firebaseApp } from './firebaseApp'

export const auth = firebaseApp ? getAuth(firebaseApp) : undefined
export const googleProvider = new GoogleAuthProvider()
export const observeAuth = (listener: (user: User | null) => void): (() => void) => auth ? onAuthStateChanged(auth, listener) : () => undefined
export const signIn = () => auth ? signInWithPopup(auth, googleProvider) : Promise.reject(new Error('Firebase is not configured'))
export const signOutUser = () => auth ? signOut(auth) : Promise.resolve()
