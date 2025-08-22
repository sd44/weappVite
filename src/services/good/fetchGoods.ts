// import { config } from "../../config/index"
import { getGoodsList } from "../../model/goods"
import type { GoodsListItem } from "../../model/someTypes"
import { delay } from "../_utils/delay"

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20): Promise<GoodsListItem[]> {
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item?.spuTagList?.map((tag) => tag.title),
      }
    })
  )
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20): Promise<GoodsListItem[]> {
  // if (config.useMock) {
  return mockFetchGoodsList(pageIndex, pageSize)
  // }
  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}
