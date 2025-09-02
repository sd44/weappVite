import Toast from "tdesign-miniprogram/toast/index"
import type {
  Activity,
  Good,
  SelectedSku,
  SkuInfo,
  SkuItem,
  Spec,
  SpecValue,
} from "~/model/someTypes"
import { cdnBase } from "../../../config/index"
import { fetchActivityList } from "../../../services/activity/fetchActivityList"
import { fetchGood } from "../../../services/good/fetchGood"
import {
  getGoodsDetailsCommentList,
  getGoodsDetailsCommentsCount,
} from "../../../services/good/fetchGoodsDetailsComments"

const imgPrefix = `${cdnBase}/`

const recLeftImg = `${imgPrefix}common/rec-left.png`
const recRightImg = `${imgPrefix}common/rec-right.png`
const obj2Params = (obj: Record<string, string>, encode = false) => {
  const result: string[] = []
  for (const key in obj) {
    if (obj[key]) {
      result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`)
    }
  }
  return result.join("&")
}

Page({
  data: {
    commentsList: [] as {
      goodsSpu: string
      userName: string
      commentScore: number
      commentContent: string
      userHeadUrl: string
    }[],
    commentsStatistics: {
      badCount: 0,
      commentCount: 0,
      goodCount: 0,
      goodRate: 0,
      hasImageCount: 0,
      middleCount: 0,
    },
    isShowPromotionPop: false,
    activityList: [] as Activity[],
    recLeftImg,
    recRightImg,
    details: {} as Good,
    goodsTabArray: [
      {
        name: "商品",
        value: "", // 空字符串代表置顶
      },
      {
        name: "详情",
        value: "goods-page",
      },
    ],
    storeLogo: `${imgPrefix}common/store-logo.png`,
    storeName: "云mall标准版旗舰店",
    jumpArray: [
      {
        title: "首页",
        url: "/pages/home/home",
        iconName: "home",
      },
      {
        title: "购物车",
        url: "/pages/cart/index",
        iconName: "cart",
        showCartNum: true,
      },
    ],
    isStock: true,
    cartNum: 0,
    soldout: false,
    buttonType: 1,
    buyNum: 1,
    selectedAttrStr: "",
    skuArray: [] as SkuItem[],
    skuList: [] as SkuInfo[],
    selectItem: null as SkuItem | null,
    primaryImage: "",
    specImg: "",
    isSpuSelectPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    outOperateStatus: false, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    maxLinePrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    list: [] as { tag: string; label: string }[],
    spuId: "",
    navigation: { type: "fraction" },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    soldNum: 0, // 已售数量
  },

  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    })
  },

  showSkuSelectPopup(type: number) {
    this.setData({
      buyType: type || 0,
      outOperateStatus: type >= 1,
      isSpuSelectPopupShow: true,
    })
  },

  buyItNow() {
    this.showSkuSelectPopup(1)
  },

  toAddCart() {
    this.showSkuSelectPopup(2)
  },

  toNav(e: WechatMiniprogram.CustomEvent) {
    const { url } = e.detail
    wx.switchTab({
      url,
    })
  },

  showCurImg(e: WechatMiniprogram.CustomEvent) {
    const { index } = e.detail
    const { images } = this.data.details
    if (images && images?.length > 0) {
      wx.previewImage({
        current: images[index],
        urls: images, // 需要预览的图片http链接列表
      })
    }
  },

  onPageScroll({ scrollTop }) {
    const goodsTab = this.selectComponent("#goodsTab")
    goodsTab?.onScroll(scrollTop)
  },

  chooseSpecItem(e: WechatMiniprogram.CustomEvent) {
    const { specList } = this.data.details
    const { selectedSku, isAllSelectedSku } = e.detail
    if (!isAllSelectedSku) {
      this.setData({
        selectSkuSellsPrice: 0,
      })
    }
    this.setData({
      isAllSelectedSku,
    })
    this.getSkuItem(specList, selectedSku)
  },

  getSkuItem(specList: Spec[], selectedSku: SelectedSku) {
    const { skuArray, primaryImage } = this.data
    const selectedSkuValues = this.getSelectedSkuValues(specList, selectedSku)
    let selectedAttrStr = " 件  "
    for (const item of selectedSkuValues) {
      selectedAttrStr += `，${item.specValue}  `
    }

    const skuItems = skuArray.filter((item) => {
      // 使用every替代forEach，满足所有条件才返回true，且可提前终止
      return (item.specInfo || []).every((subItem) => {
        return selectedSku[subItem.specId] && selectedSku[subItem.specId] === subItem.specValueId
      })
    })
    const skuItem = skuItems.length > 0 ? skuItems[0] : null

    this.selectSpecsName(selectedSkuValues.length > 0 ? selectedAttrStr : "")
    if (skuItem) {
      this.setData({
        selectItem: skuItem,
        selectSkuSellsPrice: skuItem.price || 0,
      })
    } else {
      this.setData({
        selectItem: null,
        selectSkuSellsPrice: 0,
      })
    }
    this.setData({
      specImg: skuItem?.skuImage ? skuItem.skuImage : primaryImage,
    })
  },

  // 获取已选择的sku名称
  getSelectedSkuValues(skuTree: Spec[], selectedSku: SelectedSku) {
    const normalizedTree: Record<string, SpecValue[]> = this.normalizeSkuTree(skuTree)
    return Object.keys(selectedSku).reduce((selectedValues: SpecValue[], skuKeyStr) => {
      const skuValues = normalizedTree[skuKeyStr]
      const skuValueId = selectedSku[skuKeyStr]
      if (skuValueId !== "") {
        const skuValue = skuValues.filter((value) => {
          return value.specValueId === skuValueId
        })[0]
        skuValue && selectedValues.push(skuValue)
      }
      return selectedValues
    }, [])
  },

  normalizeSkuTree(skuTree: Spec[]): Record<string, SpecValue[]> {
    const normalizedTree: Record<string, SpecValue[]> = {}
    for (const treeItem of skuTree) {
      normalizedTree[treeItem.specId] = treeItem.specValueList
    }
    return normalizedTree
  },

  selectSpecsName(selectSpecsName: string) {
    if (selectSpecsName) {
      this.setData({
        selectedAttrStr: selectSpecsName,
      })
    } else {
      this.setData({
        selectedAttrStr: "",
      })
    }
  },

  addCart() {
    const { isAllSelectedSku } = this.data
    Toast({
      context: this,
      selector: "#t-toast",
      message: isAllSelectedSku ? "点击加入购物车" : "请选择规格",
      icon: "",
      duration: 1000,
    })
  },

  gotoBuy(type: number) {
    const { isAllSelectedSku, buyNum } = this.data
    if (!isAllSelectedSku) {
      Toast({
        context: this,
        selector: "#t-toast",
        message: "请选择规格",
        icon: "",
        duration: 1000,
      })
      return
    }
    this.handlePopupHide()
    const query = {
      quantity: buyNum,
      storeId: "1",
      goodsName: this.data.details.title,
      skuId: type === 1 ? this.data.skuList[0].skuId : this.data.selectItem?.skuId || "",
      available: this.data.details.available,
      price: this.data.details.minSalePrice,
      specInfo: this.data.details.specList?.map((item) => ({
        specTitle: item.title,
        specValue: item.specValueList[0].specValue,
      })),
      primaryImage: this.data.details.primaryImage,
      spuId: this.data.details.spuId,
      thumb: this.data.details.primaryImage,
      title: this.data.details.title,
    }
    let urlQueryStr = obj2Params({
      goodsRequestList: JSON.stringify([query]),
    })
    urlQueryStr = urlQueryStr ? `?${urlQueryStr}` : ""
    const path = `/pages/order/order-confirm/index${urlQueryStr}`
    wx.navigateTo({
      url: path,
    })
  },

  specsConfirm() {
    const { buyType } = this.data
    if (buyType === 1) {
      this.gotoBuy()
    } else {
      this.addCart()
    }
    // this.handlePopupHide();
  },

  changeNum(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      buyNum: e.detail.buyNum,
    })
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    })
  },

  promotionChange(e: WechatMiniprogram.CustomEvent) {
    const { index } = e.detail
    wx.navigateTo({
      url: `/pages/promotion/promotion-detail/index?promotion_id=${index}`,
    })
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    })
  },

  async getDetail(spuId: string) {
    try {
      const [details, activityList] = await Promise.all([
        fetchGood(Number(spuId)),
        fetchActivityList(),
      ])

      const skuArray = this.processSkuList(details.skuList)
      const promotionArray = this.processActivityList(activityList)

      this.updateDetailData(details, activityList, skuArray, promotionArray)
    } catch (_error) {
      // 错误处理
    }
  },

  processSkuList(skuList: SkuInfo[]) {
    const skuArray: SkuItem[] = []
    for (const item of skuList) {
      skuArray.push({
        skuId: item.skuId,
        quantity: item.stockInfo ? item.stockInfo.stockQuantity : 0,
        specInfo: item.specInfo.map((spec) => ({
          specId: spec.specId,
          specTitle: spec.specTitle || "",
          specValue: spec.specValue || "",
          specValueId: spec.specValueId,
        })),
      })
    }
    return skuArray
  },

  processActivityList(activityList: Activity[]) {
    const promotionArray: { tag: string; label: string }[] = []
    for (const item of activityList) {
      promotionArray.push({
        tag: item.promotionSubCode === "MYJ" ? "满减" : "满折",
        label: "满100元减99.9元",
      })
    }
    return promotionArray
  },

  updateDetailData(
    details: Good,
    activityList: Activity[],
    skuArray: SkuItem[],
    promotionArray: { tag: string; label: string }[]
  ) {
    const { primaryImage, isPutOnSale, minSalePrice, maxSalePrice, maxLinePrice, soldNum } = details

    this.setData({
      details,
      activityList,
      isStock: (details.spuStockQuantity ?? 0) > 0,
      maxSalePrice: maxSalePrice ? Number.parseInt(maxSalePrice.toString(), 10) : 0,
      maxLinePrice: maxLinePrice ? Number.parseInt(maxLinePrice.toString(), 10) : 0,
      minSalePrice: minSalePrice ? Number.parseInt(minSalePrice.toString(), 10) : 0,
      list: promotionArray,
      skuArray,
      primaryImage,
      soldout: isPutOnSale === 0,
      soldNum,
    })
  },

  async getCommentsList() {
    try {
      const data = await getGoodsDetailsCommentList()
      // 假设data结构包含homePageComments数组
      const homePageComments = data.homePageComments || []
      const nextState = {
        commentsList: homePageComments.map((item) => {
          return {
            goodsSpu: item.spuId,
            userName: item.userName || "",
            commentScore: item.commentScore,
            commentContent: item.commentContent || "用户未填写评价",
            userHeadUrl: item.userHeadUrl || "",
          }
        }),
      }
      this.setData(nextState)
    } catch (_error) {
      // 错误处理
    }
  },

  onShareAppMessage() {
    // 自定义的返回信息
    const { selectedAttrStr } = this.data
    let shareSubTitle = ""
    if (selectedAttrStr.indexOf("件") > -1) {
      const count = selectedAttrStr.indexOf("件")
      shareSubTitle = selectedAttrStr.slice(count + 1, selectedAttrStr.length)
    }
    const customInfo = {
      imageUrl: this.data.details.primaryImage,
      title: this.data.details.title + shareSubTitle,
      path: `/pages/goods/details/index?spuId=${this.data.spuId}`,
    }
    return customInfo
  },

  /** 获取评价统计 */
  async getCommentsStatistics() {
    try {
      const data = await getGoodsDetailsCommentsCount()
      const nextState = {
        commentsStatistics: {
          badCount: Number.parseInt(`${data.badCount || 0}`, 10),
          commentCount: Number.parseInt(`${data.commentCount || 0}`, 10),
          goodCount: Number.parseInt(`${data.goodCount || 0}`, 10),
          /** 后端返回百分比后数据但没有限制位数 */
          goodRate: Math.floor((data.goodRate || 0) * 10) / 10,
          hasImageCount: Number.parseInt(`${data.hasImageCount || 0}`, 10),
          middleCount: Number.parseInt(`${data.middleCount || 0}`, 10),
        },
      }
      this.setData(nextState)
    } catch (_error) {
      // 错误处理
    }
  },

  /** 跳转到评价列表 */
  navToCommentsListPage() {
    wx.navigateTo({
      url: `/pages/goods/comments/index?spuId=${this.data.spuId}`,
    })
  },

  onLoad(query) {
    const { spuId } = query
    this.setData({
      spuId,
    })
    this.getDetail(spuId)
    this.getCommentsList(spuId)
    this.getCommentsStatistics(spuId)
  },
})
