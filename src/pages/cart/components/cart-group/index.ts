import Toast from "tdesign-miniprogram/toast/index"
import type { CartStoreGoods, GoodsPromotion, InvalidGood, SpecInfo } from "~/model/cart"

const shortageImg = "https://tdesign.gtimg.com/miniprogram/template/retail/cart/shortage.png"

Component({
  externalClasses: ["wr-class"],
  properties: {
    storeGoods: {
      type: Array,
      observer(storeGoods: CartStoreGoods[]) {
        for (const store of storeGoods) {
          for (const activity of store.promotionGoodsList) {
            for (const goods of activity.goodsPromotionList) {
              goods.specs = goods.specInfo.map((item: SpecInfo) => item.specValue) // 目前仅展示商品已选规格的值
            }
          }
          for (const goods of store.shortageGoodsList) {
            goods.specs = goods.specInfo.map((item: SpecInfo) => item.specValue) // 目前仅展示商品已选规格的值
          }
        }

        this.setData({ _storeGoods: storeGoods })
      },
    },
    invalidGoodItems: {
      type: Array,
      observer(invalidGoodItems: InvalidGood[]) {
        for (const goods of invalidGoodItems) {
          goods.specs = goods.specInfo.map((item: SpecInfo) => item.specValue) // 目前仅展示商品已选规格的值
        }
        this.setData({ _invalidGoodItems: invalidGoodItems })
      },
    },
    thumbWidth: { type: null },
    thumbHeight: { type: null },
  },

  data: {
    isSpecsTap: false, // 标记本次点击事件是否因为点击specs触发（由于底层goods-card组件没有catch specs点击事件，只能在此处加状态来避免点击specs时触发跳转商品详情）
    shortageImg,
    isShowSpecs: false,
    currentGoods: {} as GoodsPromotion,
    isShowToggle: false,
    _storeGoods: [] as CartStoreGoods[],
    _invalidGoodItems: [] as InvalidGood[],
  },

  methods: {
    // 删除商品
    deleteGoods(e: WechatMiniprogram.CustomEvent) {
      const { goods } = e.currentTarget.dataset
      this.triggerEvent("delete", { goods })
    },

    // 清空失效商品
    clearInvalidGoods() {
      this.triggerEvent("clearinvalidgoods")
    },

    // 选中商品
    selectGoods(e: WechatMiniprogram.CustomEvent) {
      const { goods } = e.currentTarget.dataset
      this.triggerEvent("selectgoods", {
        goods,
        isSelected: !goods.isSelected,
      })
    },

    changeQuantity(num: number, goods: GoodsPromotion) {
      this.triggerEvent("changequantity", {
        goods,
        quantity: num,
      })
    },
    changeStepper(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail
      const { goods } = e.currentTarget.dataset
      let num = value
      if (value > goods.stack) {
        num = goods.stack
      }
      this.changeQuantity(num, goods)
    },

    input(e: WechatMiniprogram.CustomEvent) {
      const { value } = e.detail
      const { goods } = e.currentTarget.dataset
      const num = value
      this.changeQuantity(num, goods)
    },

    overlimit(e: WechatMiniprogram.CustomEvent) {
      const text = e.detail.type === "minus" ? "该商品数量不能减少了哦" : "同一商品最多购买999件"
      Toast({
        context: this,
        selector: "#t-toast",
        message: text,
      })
    },

    // 去凑单/再逛逛
    gotoBuyMore(e: WechatMiniprogram.CustomEvent) {
      const { promotion, storeId = "" } = e.currentTarget.dataset
      this.triggerEvent("gocollect", { promotion, storeId })
    },

    // 选中门店
    selectStore(e: WechatMiniprogram.CustomEvent) {
      const { storeIndex } = e.currentTarget.dataset
      const store = this.data.storeGoods[storeIndex]
      const isSelected = !store.isSelected
      if (store.storeStockShortage && isSelected) {
        Toast({
          context: this,
          selector: "#t-toast",
          message: "部分商品库存不足",
        })
        return
      }
      this.triggerEvent("selectstore", {
        store,
        isSelected,
      })
    },

    // 展开/收起切换
    showToggle() {
      this.setData({
        isShowToggle: !this.data.isShowToggle,
      })
    },

    // 展示规格popup
    specsTap(e: WechatMiniprogram.CustomEvent) {
      const { goods } = e.currentTarget.dataset
      this.setData({
        isSpecsTap: true,
        isShowSpecs: true,
        currentGoods: goods,
      })
    },

    hideSpecsPopup() {
      this.setData({
        isShowSpecs: false,
      })
    },

    goGoodsDetail(e: WechatMiniprogram.CustomEvent) {
      if (this.data.isSpecsTap) {
        this.setData({
          isSpecsTap: false,
        })
        return
      }
      const { goods } = e.currentTarget.dataset
      this.triggerEvent("goodsclick", { goods })
    },

    gotoCoupons() {
      wx.navigateTo({ url: "/pages/coupon/coupon-list/index" })
    },
  },
})
