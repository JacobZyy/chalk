import type { LogHookContext } from './types'
import { describe, expect, it, vi } from 'vitest'
import { createChalk } from './create'

describe('use(hook)', () => {
  it('calls hook with context after logger method executes', () => {
    const hook = vi.fn()
    const chalk = createChalk({ isDebug: true }).use(hook)

    chalk.log('hello', { extra: true })

    expect(hook).toHaveBeenCalledOnce()
    const ctx = hook.mock.calls[0][0] as LogHookContext
    expect(ctx.level).toBe('log')
    expect(ctx.label).toBe('Log')
    expect(ctx.message).toBe('hello')
    expect(ctx.args).toEqual([{ extra: true }])
    expect(ctx.isDebug).toBe(true)
  })

  it('returns the instance for chaining', () => {
    const hook1 = vi.fn()
    const hook2 = vi.fn()
    const chalk = createChalk({ isDebug: true }).use(hook1).use(hook2)

    chalk.log('test')

    expect(hook1).toHaveBeenCalledOnce()
    expect(hook2).toHaveBeenCalledOnce()
  })

  it('fires hooks even when isDebug is false', () => {
    const hook = vi.fn()
    const chalk = createChalk({ isDebug: false }).use(hook)

    chalk.error('silent')

    expect(hook).toHaveBeenCalledOnce()
    const ctx = hook.mock.calls[0][0] as LogHookContext
    expect(ctx.isDebug).toBe(false)
    expect(ctx.message).toBe('silent')
  })

  it('calls multiple hooks in registration order', () => {
    const order: number[] = []
    const chalk = createChalk({ isDebug: true })
      .use(() => order.push(1))
      .use(() => order.push(2))
      .use(() => order.push(3))

    chalk.info('ordered')

    expect(order).toEqual([1, 2, 3])
  })

  it('provides correct level and label for different log methods', () => {
    const hook = vi.fn()
    const chalk = createChalk({ isDebug: true }).use(hook)

    chalk.warn('careful')

    expect(hook).toHaveBeenCalledOnce()
    const ctx = hook.mock.calls[0][0] as LogHookContext
    expect(ctx.level).toBe('warn')
    expect(ctx.label).toBe('Warn')
  })
})
