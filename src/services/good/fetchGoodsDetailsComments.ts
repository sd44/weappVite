// import { config } from "../../config/index"
import {
  getGoodsDetailsCommentsCount as getGoodsDetailsCommentsCountModel,
  getGoodsDetailsComments as getGoodsDetailsCommentsModel,
} from "../../model/detailsComments"

/** 获取商品详情页评论数 */
function mockFetchGoodDetailsCommentsCount(_spuId = 0) {
  return getGoodsDetailsCommentsCountModel()
}

/** 获取商品详情页评论数 */
export function getGoodsDetailsCommentsCount(spuId = 0) {
  return mockFetchGoodDetailsCommentsCount(spuId)
}

/** 获取商品详情页评论 */
function mockFetchGoodDetailsCommentList(_spuId = 0) {
  return getGoodsDetailsCommentsModel()
}

/** 获取商品详情页评论 */
export function getGoodsDetailsCommentList(spuId = 0) {
  return mockFetchGoodDetailsCommentList(spuId)
}
