/** biome-ignore-all lint/correctness/noUnusedVariables: graphql code is used */

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

const GoodsItemFragment = gql`
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
      ...GoodsItem # 注意这里使用片段名GoodsItem，不是GoodsItemFragment
    }
  }
`

export async function fetchNewGoodList(limit: number, offset: number) {
  const res = await urqlClient
    .query<FetchNewGoodsQuery>(fetchNewGoods, { limit, offset })
    .toPromise()
  return res.data
}
