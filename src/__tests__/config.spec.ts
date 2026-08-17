// SPDX-License-Identifier: LGPL-3.0-or-later
import { describe, expect, it } from 'vitest'

import { ORIGIN_REPOSITORY_URL, createSiteConfig } from '../config'

const createEnv = (overrides: Record<string, string | undefined> = {}) =>
  ({
    BASE_URL: '/',
    MODE: 'test',
    DEV: false,
    PROD: true,
    SSR: false,
    ...overrides,
  }) as ImportMetaEnv

describe('createSiteConfig', () => {
  it('uses the documented defaults when no site variables are set', () => {
    expect(createSiteConfig(createEnv())).toEqual({
      siteName: 'JGY.AI',
      siteSubtitle: 'AI API Gateway Platform',
      siteLogo: '/logo.png',
      primaryCtaUrl: 'https://jgy.ai/login',
      docsUrl: '',
    })
  })

  it('uses valid environment overrides without replacing the fixed repository URL', () => {
    expect(createSiteConfig(createEnv({
      VITE_SITE_NAME: 'Example Gateway',
      VITE_SITE_SUBTITLE: 'A custom subtitle',
      VITE_SITE_LOGO: 'https://cdn.example.com/logo.png',
      VITE_PRIMARY_CTA_URL: 'https://example.com/start',
      VITE_DOCS_URL: 'https://docs.example.com',
    }))).toEqual({
      siteName: 'Example Gateway',
      siteSubtitle: 'A custom subtitle',
      siteLogo: 'https://cdn.example.com/logo.png',
      primaryCtaUrl: 'https://example.com/start',
      docsUrl: 'https://docs.example.com',
    })
    expect(ORIGIN_REPOSITORY_URL).toBe('https://github.com/yigehaozi/sub2-dsh')
  })

  it('falls back from invalid external links and normalizes invalid documentation to empty', () => {
    expect(createSiteConfig(createEnv({
      VITE_PRIMARY_CTA_URL: 'javascript:alert(1)',
      VITE_DOCS_URL: '/docs',
    }))).toMatchObject({
      primaryCtaUrl: 'https://jgy.ai/login',
      docsUrl: '',
    })
  })

  it('uses the Pages base path for its default logo', () => {
    expect(createSiteConfig(createEnv(), '/sub2-dsh/').siteLogo).toBe('/sub2-dsh/logo.png')
  })
})
