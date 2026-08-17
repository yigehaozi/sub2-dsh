// SPDX-License-Identifier: LGPL-3.0-or-later
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Sub2DshHome from '../Sub2DshHome.vue'
import { i18n, setLocale } from '../../i18n'
import { ORIGIN_REPOSITORY_URL, type SiteConfig } from '../../config'

const config: SiteConfig = {
  siteName: 'JGY.AI',
  siteSubtitle: 'AI API Gateway Platform',
  siteLogo: '/sub2-dsh/logo.png',
  primaryCtaUrl: 'https://jgy.ai/login',
  docsUrl: '',
}

function createWrapper(overrides: Partial<SiteConfig> = {}) {
  return mount(Sub2DshHome, {
    props: { config: { ...config, ...overrides }, currentYear: 2026 },
    global: {
      plugins: [i18n],
      stubs: {
        GradientWaves: { template: '<div class="gradient-stub" />' },
        TopographyBackground: { template: '<div class="topography-stub" />' },
      },
    },
  })
}

describe('Sub2DshHome', () => {
  beforeEach(() => {
    setLocale('en')
    window.scrollTo = vi.fn()
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 })
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders configurable branding, the primary CTA, and fixed source attribution', () => {
    const wrapper = createWrapper({ siteName: 'Example AI' })

    expect(wrapper.get('[data-testid="home-logo"]').attributes('src')).toBe('/sub2-dsh/logo.png')
    expect(wrapper.text()).toContain('Example AI')
    expect(wrapper.get('[data-testid="primary-cta"]').attributes('href')).toBe('https://jgy.ai/login')
    expect(wrapper.find('[data-testid="docs-cta"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="source-link"]').attributes('href')).toBe(ORIGIN_REPOSITORY_URL)
    expect(wrapper.get('[data-testid="source-link"]').text()).toContain('github.com/yigehaozi/sub2-dsh')
  })

  it('only shows documentation links for a configured URL', () => {
    const wrapper = createWrapper({ docsUrl: 'https://docs.example.com' })

    expect(wrapper.get('[data-testid="docs-cta"]').attributes('href')).toBe('https://docs.example.com')
  })

  it('persists language changes and updates visible copy', async () => {
    const wrapper = createWrapper()

    await wrapper.get('[data-testid="language-switch"] button').trigger('click')

    expect(localStorage.getItem('sub2-dsh.locale')).toBe('zh')
    expect(document.documentElement.lang).toBe('zh')
    expect(wrapper.text()).toContain('一个密钥，畅用多个 AI 模型')
  })

  it('switches command tabs and exposes copy feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = createWrapper()
    const tabs = wrapper.findAll('.sub2-code-tab')

    await tabs[1].trigger('click')
    expect(wrapper.get('.sub2-codebox-body').text()).toContain('account pool')
    await wrapper.get('.sub2-copy-btn').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('account pool'))
    expect(wrapper.get('.sub2-copy-btn').text()).toContain('Copied')
  })

  it('selects workflow items by click and keeps mobile scrolling from changing selection', async () => {
    const wrapper = createWrapper()
    const items = wrapper.findAll('.sub2-workflow-item')

    await items[2].trigger('click')
    expect(items[2].attributes('aria-pressed')).toBe('true')

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.sub2-workflow-item')[2].attributes('aria-pressed')).toBe('true')
  })

  it('reveals content when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const wrapper = createWrapper()

    expect(wrapper.findAll('.sub2-reveal').every((node) => node.classes('is-visible'))).toBe(true)
    vi.unstubAllGlobals()
  })
})
