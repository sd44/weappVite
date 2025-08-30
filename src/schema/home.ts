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
