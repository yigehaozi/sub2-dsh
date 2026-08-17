// SPDX-License-Identifier: LGPL-3.0-or-later
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HomeIcon from '../HomeIcon.vue'

describe('HomeIcon', () => {
  it('uses self-contained size classes without Tailwind utilities', () => {
    const wrapper = mount(HomeIcon, { props: { name: 'arrowRight', size: 'sm' } })

    expect(wrapper.get('svg').classes()).toEqual(['home-icon', 'home-icon--sm'])
  })
})
