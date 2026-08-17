// SPDX-License-Identifier: LGPL-3.0-or-later
import { afterEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'sub2-dsh.locale'

async function loadI18n() {
  vi.resetModules()
  return import('../index')
}

afterEach(() => {
  localStorage.clear()
  document.documentElement.lang = 'en'
})

describe('locale persistence', () => {
  it('defaults to English and synchronizes the document language', async () => {
    const { i18n } = await loadI18n()

    expect(i18n.global.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('restores a persisted language and keeps html lang synchronized after changes', async () => {
    localStorage.setItem(STORAGE_KEY, 'zh')
    const { i18n, setLocale } = await loadI18n()

    expect(i18n.global.locale.value).toBe('zh')
    expect(document.documentElement.lang).toBe('zh')

    setLocale('en')

    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })
})
