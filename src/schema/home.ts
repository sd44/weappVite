import { gql } from "@urql/core"
import type { FetchNewGoodsQuery, FetchTabsQuery } from "~/gql/graphql"
import { urqlClient } from "~/utils/fetcher"

const fetchTabs = gql`
  query FetchTabs {
    litemallCategory(
      orderBy: { sortOrder: { direction: asc, priority: 10 } }
      where: { level: { eq: "L1" } }
      limit: 8
    ) {
      id
      name
      iconUrl
    }
  }
`

export async function fetchTabList() {
  const tabsData = await urqlClient.query<FetchTabsQuery>(fetchTabs, {}).toPromise()
  return tabsData.data
}

// WARNING: 如果使用片段，注意何时使用片段名 GoodsItem，何时使用 GoodsItemFragment
// 因为小程序支持不全，使用Fragment时类型麻烦，所以不使用！
const _GoodsItemFragment = gql`
  fragment GoodsItem on LitemallGoodsSelectItem{
      id
      goodsSn
      name
      categoryId
      gallery
      keywords
      brief
      picUrl
      shareUrl
      isNew
      isHot
      unit
      counterPrice
      retailPrice
      detail
      }
      `

const fetchNewGoods = gql`
  query FetchNewGoods($limit: Int!, $offset: Int!) {
    litemallGoods(
      orderBy: { sortOrder: { direction: asc, priority: 10 } }
      where: { deleted: { eq: false }, isOnSale: { eq: true }, isNew: { eq: true } }
      limit: $limit
      offset: $offset
    ) {
      id
      goodsSn
      name
      categoryId
      gallery
      keywords
      brief
      picUrl
      shareUrl
      isNew
      isHot
      unit
      counterPrice
      retailPrice
      detail
    }
  }
`

export async function fetchNewGoodsList(limit: number, offset: number) {
  const res = await urqlClient
    .query<FetchNewGoodsQuery>(fetchNewGoods, { limit, offset })
    .toPromise()
  return res.data
}
