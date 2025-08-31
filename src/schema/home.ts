import { gql } from "@urql/core"

export const fetchTabs = gql`
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

export const fetchNewGoods = gql`
  query FetchNewGoods($limit: Int!, $offset: Int!) {
    litemallGoods(
      orderBy: { sortOrder: { direction: asc, priority: 10 } }
      where: { is_on_sale: { eq: true }, is_new: { eq: true } }
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
