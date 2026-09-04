import { create } from 'zustand'
import { env } from '../../core/config/env'
import type { AuthStatus } from './auth.types'

interface AuthState { status: AuthStatus; setStatus: (status: AuthStatus) => void }
export const useAuthStore = create<AuthState>((set) => ({ status: env.VITE_MOCK_MODE === 'true' ? 'signed-in' : 'loading', setStatus: (status) => set({ status }) }))
