import { config } from "../../config/index"
import { getGoodsCommentsCount } from "../../model/comments"
import { delay } from "../_utils/delay"

/** 获取商品评论数 */
function mockFetchCommentsCount() {
  return delay().then(() => getGoodsCommentsCount())
}

/** 获取商品评论数 */
export function fetchCommentsCount() {
  if (config.useMock) {
    return mockFetchCommentsCount()
  }
  return new Promise((resolve) => {
    resolve("real api")
  })
}
