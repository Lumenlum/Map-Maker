import { describe, expect, it } from 'vitest'
import { themes } from './theme'

describe('theme presets', () => {
  it('contains the fixed rainbow palette', () => {
    expect(themes.map((theme) => theme.id)).toEqual([
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'violet',
    ])
  })
})
