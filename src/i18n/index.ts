// SPDX-License-Identifier: LGPL-3.0-or-later
import { createI18n } from 'vue-i18n'

import en from './messages/en'
import zh from './messages/zh'

export type LocaleCode = 'en' | 'zh'

const STORAGE_KEY = 'sub2-dsh.locale'
const DEFAULT_LOCALE: LocaleCode = 'en'

function isLocaleCode(value: string | null): value is LocaleCode {
  return value === 'en' || value === 'zh'
}

function getInitialLocale(): LocaleCode {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const storedLocale = window.localStorage.getItem(STORAGE_KEY)
  return isLocaleCode(storedLocale) ? storedLocale : DEFAULT_LOCALE
}

const initialLocale = getInitialLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, zh },
})

function syncDocumentLanguage(code: LocaleCode): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code
  }
}

export function setLocale(code: LocaleCode): void {
  i18n.global.locale.value = code
  syncDocumentLanguage(code)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, code)
  }
}

syncDocumentLanguage(initialLocale)
