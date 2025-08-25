import { getGoodsList } from "~/model/goods"
import type { MockGoodLit } from "~/types/common"

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20): MockGoodLit[] {
  return getGoodsList(pageIndex, pageSize).map((item) => {
    return {
      spuId: item.spuId,
      thumb: item.primaryImage,
      title: item.title,
      price: item.minSalePrice,
      originPrice: item.maxLinePrice,
      tags: item.spuTagList?.map((tag) => tag.title),
    }
  })
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20): MockGoodLit[] {
  return mockFetchGoodsList(pageIndex, pageSize)
}
