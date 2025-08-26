Component({
  externalClasses: ["wr-sold-out", "wr-class"],

  options: { multipleSlots: true },

  properties: {
    soldout: {
      // 商品是否下架
      type: Boolean,
      value: false,
    },
    jumpArray: {
      type: Array,
      value: [],
    },
    isStock: {
      type: Boolean,
      value: true,
    }, // 是否有库存
    isSlotButton: {
      type: Boolean,
      value: false,
    }, // 是否开启按钮插槽
    shopCartNum: {
      type: Number, // 购物车气泡数量
    },
    buttonType: {
      type: Number,
      value: 0,
    },
    minDiscountPrice: {
      type: String,
      value: "",
    },
    minSalePrice: {
      type: String,
      value: "",
    },
  },

  data: {
    fillPrice: false,
  },

  methods: {
    toAddCart() {
      const { isStock } = this.data
      if (!isStock) {
        return
      }
      this.triggerEvent("toAddCart")
    },

    toBuyNow(e: WechatMiniprogram.CustomEvent) {
      const { isStock } = this.data
      if (!isStock) {
        return
      }
      this.triggerEvent("toBuyNow", e)
    },

    toNav(e: WechatMiniprogram.CustomEvent) {
      const { url } = e.currentTarget.dataset
      return this.triggerEvent("toNav", {
        e,
        url,
      })
    },
  },
})
