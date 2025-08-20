import { config } from "../../config/index"
import { getGoodsAllComments } from "../../model/comments"
import { delay } from "../_utils/delay"

type Params = {
  queryParameter: {
    commentLevel: number
    hasImage: boolean
    spuId: number
    pageNum: number
    pageSize: number
  }
}

/** 获取商品评论 */
function mockFetchComments(parmas: Params) {
  return delay().then(() => getGoodsAllComments(parmas))
}

/** 获取商品评论 */
export function fetchComments(parmas: Params) {
  if (config.useMock) {
    return mockFetchComments(parmas)
  }
  return new Promise((resolve) => {
    resolve("real api")
  })
}
