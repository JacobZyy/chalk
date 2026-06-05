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
        'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #cad3f5; background: #494d64; font-weight: bold;',
        'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #24273a; background: #a6da95; font-weight: bold;',
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
