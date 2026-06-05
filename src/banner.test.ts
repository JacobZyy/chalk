import type { ConsoleLike } from './types'
import { describe, expect, it, vi } from 'vitest'
import { createBannerMethods } from './banner'

function createConsoleSpy(): Required<ConsoleLike> {
  return {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
}

describe('banner', () => {
  it('prints a styled hello banner when debug is enabled', () => {
    const consoleSpy = createConsoleSpy()
    const banner = createBannerMethods(consoleSpy, () => true)

    banner.hello('Alita', '1.2.3')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c Alita %c V1.2.3 ',
      'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #cad3f5; background: #494d64; font-weight: bold;',
      'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #24273a; background: #a6da95; font-weight: bold;',
    )
  })

  it('does not print hello banner when debug is disabled', () => {
    const consoleSpy = createConsoleSpy()
    const banner = createBannerMethods(consoleSpy, () => false)

    banner.hello('Alita', '1.2.3')

    expect(consoleSpy.log).not.toHaveBeenCalled()
  })

  it('prints an image using console CSS background when debug is enabled', () => {
    const consoleSpy = createConsoleSpy()
    const banner = createBannerMethods(consoleSpy, () => true)

    banner.image('https://example.com/logo.png')

    expect(consoleSpy.log).toHaveBeenCalledWith(
      '%c ',
      'font-size: 1px; padding: 100px 100px; background: url(https://example.com/logo.png) no-repeat center / contain; color: transparent;',
    )
  })

  it('does not print image when debug is disabled', () => {
    const consoleSpy = createConsoleSpy()
    const banner = createBannerMethods(consoleSpy, () => false)

    banner.image('https://example.com/logo.png')

    expect(consoleSpy.log).not.toHaveBeenCalled()
  })

  it('does not print image when url is empty', () => {
    const consoleSpy = createConsoleSpy()
    const banner = createBannerMethods(consoleSpy, () => true)

    banner.image('')

    expect(consoleSpy.log).not.toHaveBeenCalled()
  })
})
