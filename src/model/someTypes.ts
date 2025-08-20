import { delay } from "~/services/_utils/delay"
import type { AddressModel } from "./address"
import { getCouponList } from "./coupon"

export type SpecInfo = {
  specId: string
  specTitle: string
  specValue: string
}
export type GoodsInfo = {
  goodsName: string
  skuImage: string
  specInfo: SpecInfo[]
}
export type RightsPreviewData = {
  saasId: string
  uid: string
  storeId: string
  skuId: string
  numOfSku: number
  numOfSkuAvailable: number
  refundableAmount: string
  refundableDiscountAmount: string
  shippingFeeIncluded: string
  paidAmountEach: string
  boughtQuantity: number
  orderNo: string
  goodsInfo: GoodsInfo
}
export type RightsPreviewResponse = {
  data: RightsPreviewData
  code: string
  msg: string | null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type RightsReason = {
  id: string
  desc: string
}
export type ApplyReasonListData = {
  saasId: string
  rightsReasonList: RightsReason[]
}
export type ApplyReasonListResponse = {
  data: ApplyReasonListData
  code: string
  msg: string | null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type ApplyServiceData = {
  rightsNo: string
  saasId: string
  uid: string
  storeId: string
  result: null
}
export type ApplyServiceResponse = {
  data: ApplyServiceData
  code: string
  msg: string | null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}

export type GoodsData = {
  storeId: string
  spuId: string
  skuId: string
  title: string
  primaryImage: string
  quantity: number
  price: number
  originPrice: number
  specInfo: SpecInfo[]
  roomId?: string
}
export type ConfirmGoods = {
  storeId: string
  spuId: string
  skuId: string
  goodsName: string
  image: string
  reminderStock: number
  quantity: number
  payPrice: number
  totalSkuPrice: number
  discountSettlePrice: number
  realSettlePrice: number
  settlePrice: number
  oriPrice: number
  tagPrice: null
  tagText: null
  skuSpecLst: SpecInfo[]
  promotionIds: null
  weight: number
  unit: string
  volume: null
  masterGoodsType: number
  viceGoodsType: number
  roomId?: string
  egoodsName: null
}
export type StoreGoods = {
  storeId: string
  storeName: string
  remark: null
  goodsCount: number
  deliveryFee: string
  deliveryWords: null
  storeTotalAmount: string
  storeTotalPayAmount: string
  storeTotalDiscountAmount: string
  storeTotalCouponAmount: string
  skuDetailVos: ConfirmGoods[]
  couponList: {
    couponId: number
    storeId: string
  }[]
}
export type SettleDetailData = {
  settleType: number
  userAddress: string | null
  totalGoodsCount: number
  packageCount: number
  totalAmount: string
  totalPayAmount: string | number
  totalDiscountAmount: string
  totalPromotionAmount: string
  totalCouponAmount: string | number
  totalSalePrice: string | number
  totalGoodsAmount: string
  totalDeliveryFee: string
  invoiceRequest: null
  skuImages: null
  deliveryFeeList: null
  storeGoodsList: StoreGoods[]
  inValidGoodsList: null
  outOfStockGoodsList: null
  limitGoodsList: null
  abnormalDeliveryGoodsList: null
  invoiceSupport: number
}
export type SettleDetailResponse = {
  data: SettleDetailData
  code: string
  msg: null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type Coupon = {
  status: string
  type: number
  value: number
}
export type OrderItemButton = {
  primary: boolean
  type?: number
  name?: string
}
export type OrderItem = {
  id: string
  orderNo: null
  spuId: string
  skuId: string
  roomId: null
  goodsMainType: number
  goodsViceType: number
  goodsName: string
  specifications: Specification[]
  goodsPictureUrl: string
  originPrice: string
  actualPrice: string
  buyQuantity: number
  itemTotalAmount: string
  itemDiscountAmount: string
  itemPaymentAmount: string
  goodsPaymentPrice: string
  tagPrice: null
  tagText: null
  outCode: null
  labelVOs: null
  buttonVOs: OrderItemButton[] | null
}
export type Logistics = {
  logisticsType: number
  logisticsNo: string
  logisticsStatus: null
  logisticsCompanyCode: string
  logisticsCompanyName: string
  receiverAddressId: string
  provinceCode: string
  cityCode: string
  countryCode: string
  receiverProvince: string
  receiverCity: string
  receiverCountry: string
  receiverArea: string
  receiverAddress: string
  receiverPostCode: string
  receiverLongitude: string
  receiverLatitude: string
  receiverIdentity: string
  receiverPhone: string
  receiverName: string
  expectArrivalTime: null
  senderName: string
  senderPhone: string
  senderAddress: string
  sendTime: string | null
  arrivalTime: string | null
}
export type Payment = {
  payStatus: number
  amount: string
  currency: string | null
  payType: number | null
  payWay: number | null
  payWayName: string | null
  interactId: string | null
  traceNo: null | string
  channelTrxNo: string | null
  period: null
  payTime: string | null
  paySuccessTime: string | null
}
export type OrderButton = {
  primary: boolean
  type: number
  name: string
}
export type Invoice = {
  buyerName: string
  buyerTaxNo: string
  buyerPhone: string
  email: string
  titleType: number
  ontentType: number
  invoiceType: number
  money: string | number
  isInvoice?: string
}
export type TrajectoryNode = {
  status: string
  timestamp: string
  remark: null
}
export type Trajectory = {
  title: string
  icon: string | null
  code: string
  nodes: TrajectoryNode[]
  isShow: boolean
}
export type OrderDetailData = {
  saasId: string
  storeId: string
  storeName: string
  uid: string
  parentOrderNo: string
  orderId: string
  orderNo: string
  orderType: number
  orderSubType: number
  orderStatus: number
  orderSubStatus: null
  totalAmount: string
  goodsAmount: string
  goodsAmountApp: string
  paymentAmount: string
  freightFee: string
  packageFee: string
  discountAmount: string
  channelType: number
  channelSource: string
  channelIdentity: string
  remark: string
  cancelType: number
  cancelReasonType: number
  cancelReason: string
  rightsType: number
  createTime: string
  orderItemVOs: OrderItem[]
  logisticsVO: Logistics
  paymentVO: Payment
  buttonVOs: OrderButton[] | null
  labelVOs: null
  invoiceVO: Invoice | null
  couponAmount: string
  autoCancelTime: string | null
  orderStatusName: string
  orderStatusRemark: string | null
  logisticsLogVO: null
  invoiceStatus: number
  invoiceDesc: string
  invoiceUrl: null
  trajectoryVos?: Trajectory[]
}
export type OrderDetailResponse = {
  data: OrderDetailData
  code: string
  msg: null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type BusinessTimeData = {
  businessTime: string[]
  telphone: string
  saasId: string
}
export type BusinessTimeResponse = {
  data: BusinessTimeData
  code: string
  msg: null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type Specification = {
  specTitle: string
  specValue: string
}
export type Order = {
  saasId: string
  storeId: string
  storeName: string
  uid: string
  parentOrderNo: string
  orderId: string
  orderNo: string
  orderType: number
  orderSubType: number
  orderStatus: number
  orderSubStatus: null
  totalAmount: string
  goodsAmount: string
  goodsAmountApp: string
  paymentAmount: string
  freightFee: string
  packageFee: string
  discountAmount: string
  channelType: number
  channelSource: string
  channelIdentity: string
  remark: string
  cancelType: null
  cancelReasonType: null
  cancelReason: null
  rightsType: null
  createTime: string
  orderItemVOs: OrderItem[]
  logisticsVO: Logistics
  paymentVO: Payment
  buttonVOs: OrderButton[] | null
  labelVOs: null
  invoiceVO: Invoice | null
  couponAmount: null
  autoCancelTime: string | null
  orderStatusName: string
  orderStatusRemark: string | null
  logisticsLogVO: null
  invoiceStatus: null
  invoiceDesc: null
  invoiceUrl: null
}
export type OrdersData = {
  pageNum: number
  pageSize: number
  totalCount: number
  orders: Order[]
}
export type OrdersResponse = {
  data: OrdersData
  code: string
  msg: null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type OrdersCount = {
  tabType: number
  orderNum: number
}
export type OrdersCountResponse = {
  data: OrdersCount[]
  code: string
  msg: null
  requestId: string
  clientIp: string
  rt: number
  success: boolean
}
export type CouponCardStatus = "default" | "useless" | "disabled"
export type CouponCardType = "discount" | "price"

// 商品相关类型定义
export type SpecValue = {
  specValueId: string
  specId: string | null
  saasId: string | null
  specValue: string
  image: string | null
}

export type Spec = {
  specId: string
  title: string
  specValueList: SpecValue[]
}

export type PriceInfo = {
  priceType: number
  price: string
  priceTypeName: string | null
}

export type StockInfo = {
  stockQuantity: number
  safeStockQuantity: number
  soldQuantity: number
}

export type SkuInfo = {
  skuId: string
  skuImage: string | null
  specInfo: Array<{
    specId: string
    specTitle: string | null
    specValueId: string
    specValue: string | null
  }>
  priceInfo: PriceInfo[]
  stockInfo: StockInfo
  weight: { value: number | null; unit: string } | null
  volume: any | null
  profitPrice: number | null
}

export type SpuTag = {
  id: string | null
  title: string
  image: string | null
}

export type LimitInfo = {
  text: string
}

export type GoodsListItem = {
  spuId: string
  thumb: string
  title: string
  price: number | string
  originPrice: number | string
  tags: string[]
}

export type Good = {
  saasId: string
  storeId: string
  spuId: string
  title: string
  primaryImage: string
  images: string[]
  video?: any
  available?: number
  minSalePrice: number | string
  minLinePrice: number | string
  maxSalePrice: number | string
  maxLinePrice: number | string
  spuStockQuantity: number
  soldNum: number
  isPutOnSale: number
  categoryIds?: string[]
  specList: Spec[]
  skuList: SkuInfo[]
  spuTagList: SpuTag[]
  limitInfo?: LimitInfo[]
  desc: string[]
  etitle: string
  isSoldOut?: boolean
  groupIdList?: string[]
  promotionList?: any | null
  minProfitPrice?: number | null
  spuLimitList?: any | null
}
type CouponDetail = {
  key: string
  status: CouponCardStatus
  type: number
  value: number
  tag: string
  desc: string
  base: number
  title: string
  timeLimit: string
  currency: string
  useNotes: string
  storeAdapt: string
}
export type CouponDetailResponse = {
  detail: CouponDetail
  storeInfoList: AddressModel[]
}
/** 获取优惠券列表 */
export function mockFetchCoupon(status: CouponCardStatus) {
  return delay().then(() => getCouponList(status))
}
