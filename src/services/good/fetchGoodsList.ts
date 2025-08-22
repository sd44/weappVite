// import { config } from "../../config/index"
import { getSearchResult } from "../../model/search"
import { delay } from "../_utils/delay"

/** 获取商品列表 */
function mockFetchGoodsList() {
  const data = getSearchResult()

  if (data.spuList.length) {
    const goodsList = data.spuList.map((item) => {
      const goodsItem = {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList ? item.spuTagList.map((tag) => tag.title) : [],
      }
      return goodsItem
    })

    // 将转换后的商品列表赋值回 data.spuList
    data.spuList = goodsList
  }
  return delay().then(() => {
    return data
  })
}

/** 获取商品列表 */
export function fetchGoodsList(_params) {
  // if (config.useMock) {
  return mockFetchGoodsList()
  // }
  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}
