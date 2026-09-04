import { create } from 'zustand'
import type { Language } from '../types/user'

interface UiState { language: Language; setLanguage: (language: Language) => void }
export const useUiStore = create<UiState>((set) => ({ language: 'en', setLanguage: (language) => set({ language }) }))
