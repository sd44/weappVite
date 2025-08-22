// import { config } from "../../config/index"

import { getSearchResult as mockGetSearchResult } from "~/model/search"
import { delay } from "../_utils/delay"

/** 获取搜索历史 */
function mockSearchResult() {
  const data = mockGetSearchResult()

  for (const item of data.spuList) {
    item.thumb = item.primaryImage
    item.price = item.minSalePrice
    item.originPrice = item.maxLinePrice
    if (item.spuTagList) {
      item.tags = item.spuTagList.map((tag) => ({ title: tag.title }))
    } else {
      item.tags = []
    }
  }
  return delay().then(() => {
    return data
  })
}

/** 获取搜索历史 */
export function getSearchResult() {
  // if (config.useMock) {
  return mockSearchResult()
  // }
  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}
