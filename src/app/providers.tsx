import { useEffect, type PropsWithChildren } from 'react'
import '../i18n'
import { env } from '../core/config/env'
import { useAuthStore } from '../features/auth/authStore'
import { runMigrations } from '../core/db/migrations'

export function Providers({ children }: PropsWithChildren) {
	const setStatus = useAuthStore((state) => state.setStatus)
	useEffect(() => {
		void runMigrations()
	}, [])
	useEffect(() => {
		if (env.VITE_MOCK_MODE === 'true') return undefined
		let unsubscribe: (() => void) | undefined
		let cancelled = false
		void import('../core/firebase/auth').then(({ observeAuth }) => {
			if (!cancelled) unsubscribe = observeAuth((user) => setStatus(user ? 'signed-in' : 'signed-out'))
		})
		return () => { cancelled = true; unsubscribe?.() }
	}, [setStatus])
	return <>{children}</>
}
