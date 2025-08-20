import { config } from "../../config/index"
import { genCartGroupData } from "../../model/cart"
import { delay } from "../_utils/delay"

/** 获取购物车mock数据 */
function mockFetchCartGroupData() {
  return delay().then(() => genCartGroupData())
}

/** 获取购物车数据 */
export function fetchCartGroupData() {
  if (config.useMock) {
    return mockFetchCartGroupData()
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}
