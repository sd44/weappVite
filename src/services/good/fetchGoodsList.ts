import { config } from "../../config/index"
import { getSearchResult } from "../../model/search"
import { delay } from "../_utils/delay"

/** 获取商品列表 */
function mockFetchGoodsList(params: any) {
  const data = getSearchResult(params)

  if (data.spuList.length) {
    data.spuList.forEach((item: any) => {
      item.spuId = item.spuId
      item.thumb = item.primaryImage
      item.title = item.title
      item.price = item.minSalePrice
      item.originPrice = item.maxLinePrice
      item.desc = ""
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag: any) => tag.title)
      } else {
        item.tags = []
      }
    })
  }
  return delay().then(() => {
    return data
  })
}

/** 获取商品列表 */
export function fetchGoodsList(params: any) {
  if (config.useMock) {
    return mockFetchGoodsList(params)
  }
  return new Promise((resolve) => {
    resolve("real api")
  })
}
