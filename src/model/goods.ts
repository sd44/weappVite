import { genGood } from "./good"
import type { Good } from "./someTypes"

export function getGoodsList(baseID = 0, length = 10): Good[] {
  return new Array(length).fill(0).map((_, idx) => {
    return genGood(idx + baseID)
  })
}

export const goodsList = getGoodsList()
