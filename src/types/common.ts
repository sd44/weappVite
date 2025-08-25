// 价格单位，分 | 元, fen，yuan
export type PriceUnit = "fen" | "yuan"
//价格类型
//  main 粗体, lighter 细体, mini 黑色, del 中划线, delthrough 中划线，包括货币符号

export type PriceType = "main" | "lighter" | "mini" | "del" | "delthrough"
export type PriceData = {
  originPrice?: number | string
  price?: number | string
}

export type Weight = {
  value: number | null
  unit: string
}

export type LimitInfo = {
  text: string
}

export type Price = { priceType: number; price: string; priceTypeName: string }
export type Stock = {
  stockQuantity: number
  safeStockQuantity: number
  soldQuantity: number
}

export type SpuTag = {
  id: string | null
  title: string
  image?: string | null
}

export type SpecValue = {
  // 在 cart.js 的商品数据中，specInfo 数组包含规格项：
  // javascript
  // 运行

  // specInfo: [
  //   { specTitle: '颜色', specValue: '经典白' }, // 对应一个 specId（如“颜色”的唯一标识）
  //   { specTitle: '类型', specValue: '经典套装' } // 对应另一个 specId（如“类型”的唯一标识）
  // ]

  // 规格类别”
  specId: string | null

  specTitle?: string | null
  // specId 规格类别中的取值ID，用于唯一标识某个规格项（specId）下的具体取值（如 “颜色” 下的 “经典白”“黑色”，“尺码” 下的 “S”“M” 等）。
  specValueId: string
  specValue?: string | null

  // SaaS 平台中的租户 / 商家标识 ID，用于在多租户系统中区分不同的商家或服务实例。
  saasId?: string | null

  image?: string | null
  // hasStockObj?: {
  //   hasStock: boolean
  //   specsArray: string[][]
  // }
}

export type SpecItem = {
  specId: string
  title: string
  specValueList: SpecValue[]
}

export type skuItem = {
  skuId: string
  skuImage?: string | null
  specInfo: SpecValue[]
  priceInfo: Price[]
  stockInfo: Stock
  weight: Weight | null
  volume?: number | null
  profitPrice?: number | null
}

// TODO: goods 类型不明确，除id, PriceData外，起码还有wxml中thumb, title, tags等成员
export type Good = PriceData & {
  // id: string
  thumb?: string
  title: string
  tags?: string[]
  currency?: "¥"
  saasId?: string
  storeId?: string
  spuId: string
  primaryImage?: string
  images?: string[]
  // TODO: video 类型错误
  video?: null
  available?: number

  minSalePrice?: string | number
  minLinePrice?: string | number
  maxSalePrice?: string | number
  maxLinePrice?: string | number

  isSoldOut?: boolean
  groupIdList?: string[]
  isAvailable?: number
  spuStockQuantity?: number
  soldNum?: number
  isPutOnSale?: boolean | number
  categoryIds?: string[]
  specList: SpecItem[]

  spuTagList: SpuTag[]
  skuList: skuItem[]
  limitInfo?: LimitInfo[]
  desc: string[]
  etitle: string
  // TODO: promotionList 在 tdesign mall中为null，作用不详
  promotionList?: null
  minProfitPrice?: number | null
}

export type MockGoodLit = {
  spuId: string
  thumb?: string
  title: string
  price?: number | string
  originPrice?: number | string
  tags: string[]
}
