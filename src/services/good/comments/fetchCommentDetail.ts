import { config } from "../../../config/index"
import { queryCommentDetail } from "../../../model/comments/queryDetail"
import { delay } from "../../_utils/delay"

/** 获取商品评价数据 */
function mockQueryCommentDetail() {
  const data = queryCommentDetail()
  return delay().then(() => {
    return data
  })
}

/** 获取评价详情 */
export function getCommentDetail() {
  if (config.useMock) {
    return mockQueryCommentDetail()
  }
  return new Promise((resolve) => {
    resolve("real api")
  })
}
