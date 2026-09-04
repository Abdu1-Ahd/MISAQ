import { APP_TIMEZONE } from '../config/constants'

export const formatPakistanDate = (isoDate: string, language = 'en'): string => new Intl.DateTimeFormat(language === 'ur' ? 'ur-PK' : 'en-PK', { timeZone: APP_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(isoDate))
export const todayInPakistan = (): string => new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE }).format(new Date())
