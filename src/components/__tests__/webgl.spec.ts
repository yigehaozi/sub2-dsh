// SPDX-License-Identifier: LGPL-3.0-or-later
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import GradientWaves from '../GradientWaves.vue'
import Topography from '../Topography.vue'

describe('WebGL visual fallbacks', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    })
    vi.stubGlobal('IntersectionObserver', class {
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as never)
      }
      unobserve() {}
      disconnect() {}
    })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps GradientWaves usable when WebGL2 is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const wrapper = mount(GradientWaves, { slots: { default: '<p>Readable content</p>' } })
    await nextTick()

    expect(wrapper.classes()).toContain('gradient-waves--fallback')
    expect(wrapper.text()).toContain('Readable content')
  })

  it('does not schedule animation under reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame')

    mount(GradientWaves)

    expect(requestFrame).not.toHaveBeenCalled()
  })

  it('leaves a static Topography container when OGL setup fails', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const wrapper = mount(Topography)

    expect(wrapper.classes()).toContain('topography-container')
    expect(wrapper.find('canvas').exists()).toBe(false)
  })
})
