import { config } from "../../config/index"
import { getSearchResult as getSearchResultModel } from "../../model/search"
import { delay } from "../_utils/delay"

/** 获取搜索历史 */
function mockSearchResult(params: any) {
  const data = getSearchResultModel(params)

  if (data.spuList.length) {
    data.spuList.forEach((item: any) => {
      item.spuId = item.spuId
      item.thumb = item.primaryImage
      item.title = item.title
      item.price = item.minSalePrice
      item.originPrice = item.maxLinePrice
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag: any) => ({ title: tag.title }))
      } else {
        item.tags = []
      }
    })
  }
  return delay().then(() => {
    return data
  })
}

/** 获取搜索历史 */
export function getSearchResult(params: any) {
  if (config.useMock) {
    return mockSearchResult(params)
  }
  return new Promise((resolve) => {
    resolve("real api")
  })
}
