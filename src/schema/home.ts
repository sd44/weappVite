import { gql } from "@urql/core"

export const fetchTabs = gql`
query FetchTabs {
  litemallCategory(where: {level: {eq: "L1"}}, limit: 8) {
    name
    iconUrl
  }
}
`
