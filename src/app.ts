// biome-ignore lint/correctness/noUnusedImports: UrlSearchParamsPolyfill is used to polyfill URLSearchParams in urql/core
import URLSearchParamsPolyfill from "./utils/url-search-params-polyfill"

// 全局注册polyfill - 小程序环境兼容
// 小程序环境下的全局对象可能是 wx、global 或 globalThis
;(globalThis as any).URLSearchParams = URLSearchParamsPolyfill
console.log("URLSearchParams polyfill 已注册到小程序全局环境")

App({
  globalData: {},

  // 小程序启动之后 触发
  onLaunch() {},
})
