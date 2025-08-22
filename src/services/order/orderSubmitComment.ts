// import { config } from "../../config/index"
import { getGoods as getGoodsModel } from "../../model/submitComment"
import { delay } from "../_utils/delay"

/** 获取评价商品 */
function mockGetGoods() {
  const data = getGoodsModel()

  return delay().then(() => {
    return data
  })
}

/** 获取评价商品 */
export function getGoods() {
  // if (config.useMock) {
  return mockGetGoods()
  // }
  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}
