import type { ConsoleLike, DebugPredicate } from './types'

export interface BannerMethods {
  hello: (title: string, version: string) => void
  image: (url: string) => void
}

export function createBannerMethods(consoleLike: ConsoleLike, isDebug: DebugPredicate): BannerMethods {
  return {
    hello(title: string, version: string): void {
      if (!isDebug())
        return
      consoleLike.log(
        `%c ${title} %c V${version} `,
        'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #cdd6f4; background: #45475a; font-weight: bold;',
        'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #1e1e2e; background: #a6e3a1; font-weight: bold;',
      )
    },
    image(url: string): void {
      if (!url)
        return
      if (!isDebug())
        return
      consoleLike.log(
        '%c ',
        `font-size: 1px; padding: 100px 100px; background: url(${url}) no-repeat center / contain; color: transparent;`,
      )
    },
  }
}
