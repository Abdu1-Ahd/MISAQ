import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { useUiStore } from '../store/uiStore'

export function AppShell() {
  const { t } = useTranslation()
  const language = useUiStore((state) => state.language)
  const setLanguage = useUiStore((state) => state.setLanguage)
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => { void i18n.changeLanguage(language); document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr'; document.documentElement.lang = language }, [language])
  useEffect(() => { const update = () => setOnline(navigator.onLine); window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) } }, [])
  const nextLanguage = language === 'en' ? 'ur' : language === 'ur' ? 'ur-Roman' : 'en'
  return <div className="app-frame">
    <header className="topbar"><div className="wordmark"><span className="wordmark-mark">م</span><span>{t('brand')}</span></div><div className="topbar-actions"><span className="offline-pill"><span className="status-dot" />{online ? t('synced') : t('offline')}</span><button className="language-button" onClick={() => setLanguage(nextLanguage)} aria-label="Change language">{t('language')}</button></div></header>
    <main className="page-content"><Outlet /></main>
    <nav className="bottom-nav" aria-label="Primary navigation"><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><span>⌂</span>{t('home')}</NavLink><NavLink to="/archive" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><span>◷</span>{t('settings')}</NavLink></nav>
  </div>
}
