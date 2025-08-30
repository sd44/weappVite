// URLSearchParams polyfill 测试函数
export function testURLSearchParams() {
  console.log("URLSearchParams polyfill 测试")

  // 测试 URLSearchParams 基本功能
  try {
    const params = new URLSearchParams("key1=value1&key2=value2")
    console.log("URLSearchParams 测试通过:", params.toString())
  } catch (error) {
    console.warn("URLSearchParams 可能未完全支持:", error)
  }
}
