import type { MockGoodLit } from "~/types/common"

Component({
  externalClasses: ["wr-class"],

  properties: {
    goodsList: {
      type: Array,
      value: [] as MockGoodLit[],
    },
    id: {
      type: String,
      value: "",
      observer(id) {
        this.genIndependentID(id)
      },
    },
    thresholds: {
      type: Array,
      value: [],
    },
  },

  data: {
    independentID: "",
  },

  lifetimes: {
    ready() {
      this.init()
    },
  },

  methods: {
    init() {
      this.genIndependentID(this.id || "")
    },

    genIndependentID(id: string) {
      if (id.length > 0) {
        this.setData({ independentID: id })
      } else {
        this.setData({
          independentID: `goods-list-${~~(Math.random() * 10 ** 8)}`,
        })
      }
    },
    onClickGoods(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("click", { ...e.detail, index })
    },

    onAddCart(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("addcart", { ...e.detail, index })
    },

    onClickGoodsThumb(e: WechatMiniprogram.CustomEvent) {
      const { index } = e.currentTarget.dataset
      this.triggerEvent("thumb", { ...e.detail, index })
    },
  },
})
