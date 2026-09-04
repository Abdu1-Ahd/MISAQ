import { CURRENCY_CODE } from '../config/constants'

export function formatCurrency(amount: number, language = 'en'): string {
  return new Intl.NumberFormat(language === 'ur' ? 'ur-PK' : 'en-PK', { style: 'currency', currency: CURRENCY_CODE, maximumFractionDigits: 0 }).format(amount)
}
