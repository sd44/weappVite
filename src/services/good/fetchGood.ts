// import { config } from "../../config/index"
import type { Good } from "~/types/common"
import { genGood } from "../../model/good"

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  return genGood(ID)
}

/** 获取商品列表 */
export function fetchGood(ID = 0): Good {
  return mockFetchGood(ID)
}
