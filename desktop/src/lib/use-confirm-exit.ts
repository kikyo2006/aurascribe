import { useEffect } from 'react'

// Module-level flag so the single global close listener in app.tsx can read it.
export let confirmExitMessage: string | null = null

export function setConfirmExitMessage(msg: string | null) {
	confirmExitMessage = msg
}

export function useConfirmExit(shouldConfirm: boolean, message?: string) {
	useEffect(() => {
		confirmExitMessage = shouldConfirm ? (message ?? 'Are you sure you want to exit?') : null
		return () => {
			confirmExitMessage = null
		}
	}, [shouldConfirm, message])
}
