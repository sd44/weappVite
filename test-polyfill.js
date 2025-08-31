// 测试URLSearchParams polyfill
import { URLSearchParamsPolyfill } from "./src/utils/url-search-params-polyfill.js"

console.log("测试URLSearchParams polyfill...")

// 测试基本功能
try {
  const params = new URLSearchParamsPolyfill("key1=value1&key2=value2")
  console.log("基本字符串解析:", params.toString())

  // 测试get方法
  console.log("get key1:", params.get("key1"))
  console.log("get key2:", params.get("key2"))
  console.log("get 不存在的key:", params.get("nonexistent"))

  // 测试append
  params.append("key1", "value3")
  console.log("append后:", params.toString())

  // 测试getAll
  console.log("getAll key1:", params.getAll("key1"))

  console.log("✅ polyfill基本功能测试通过")
} catch (error) {
  console.error("❌ polyfill测试失败:", error)
}

// 测试全局注册
console.log("\n测试全局注册...")
console.log("typeof URLSearchParams:", typeof URLSearchParams)

if (typeof URLSearchParams === "undefined") {
  console.log("URLSearchParams未定义，需要polyfill")
  globalThis.URLSearchParams = URLSearchParamsPolyfill
  console.log("全局注册后 typeof URLSearchParams:", typeof URLSearchParams)

  try {
    const globalParams = new URLSearchParams("test=global")
    console.log("全局URLSearchParams测试:", globalParams.toString())
  } catch (error) {
    console.error("全局URLSearchParams测试失败:", error)
  }
} else {
  console.log("URLSearchParams已存在，无需polyfill")
}
