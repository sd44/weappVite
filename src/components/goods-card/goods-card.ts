import type { MockGoodLit, PriceData } from "~/types/common"

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    id: String,
    data: Object,
    currency: {
      type: String,
      value: "¥",
    },
    thresholds: Array,
  },

  observers: {
    id(id) {
      this.genIndependentID(id)
      if (this.data.thresholds?.length) {
        this.createIntersectionObserverHandle()
      }
    },
    data(data: PriceData) {
      if (!data) {
        return
      }
      let isValidityLinePrice = true
      if (data.originPrice && data.price && data.originPrice < data.price) {
        isValidityLinePrice = false
      }
      this.setData({ goods: { ...this.data.goods, ...data }, isValidityLinePrice })
    },
    // Note: data is both a property and observer by design
    thresholds(thresholds: number[]) {
      if (thresholds?.length) {
        this.createIntersectionObserverHandle()
      } else {
        this.clearIntersectionObserverHandle()
      }
    },
  },
  lifetimes: {
    ready() {
      this.init()
    },
    detached() {
      this.clear()
    },
  },

  data: {
    independentID: "",

    goods: {} as MockGoodLit,
    isValidityLinePrice: false,
    _observer: null as null | WechatMiniprogram.IntersectionObserver, // 用于存储 IntersectionObserver 实例
  },

  methods: {
    clickHandle() {
      this.triggerEvent("click", { goods: this.data.goods })
    },

    clickThumbHandle() {
      this.triggerEvent("thumb", { goods: this.data.goods })
    },

    addCartHandle(e: WechatMiniprogram.CustomEvent) {
      const { id } = e.currentTarget
      const { id: cardID } = e.currentTarget.dataset
      this.triggerEvent("add-cart", {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      })
    },

    genIndependentID(id: string) {
      let independentID: string
      if (id) {
        independentID = id
      } else {
        independentID = `goods-card-${~~(Math.random() * 10 ** 8)}`
      }
      this.setData({ independentID })
    },

    init() {
      const { thresholds, id } = this.data
      this.genIndependentID(id)
      if (thresholds?.length) {
        this.createIntersectionObserverHandle()
      }
    },
    clear() {
      this.clearIntersectionObserverHandle()
    },

    createIntersectionObserverHandle() {
      if (this.data._observer || !this.data.independentID) {
        return
      }
      const _observer = this.createIntersectionObserver({
        thresholds: this.data.thresholds,
      }).relativeToViewport()

      _observer.observe(`#${this.data.independentID}`, (res) => {
        this.intersectionObserverCB(res)
      })
      this.setData({ _observer })
    },

    intersectionObserverCB(_res: WechatMiniprogram.IntersectionObserverObserveCallbackResult) {
      // res.id // 目标节点 id
      // res.dataset // 目标节点 dataset
      // res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      // res.intersectionRect // 相交区域
      // res.intersectionRect.left // 相交区域的左边界坐标
      // res.intersectionRect.top // 相交区域的上边界坐标
      // res.intersectionRect.width // 相交区域的宽度
      // res.intersectionRect.height // 相交区域的高度
      this.triggerEvent("ob", {
        goods: this.data.goods,
        context: this.data._observer, // 交叉观察器实例
        // res, // 可见性变化的详细信息（如可见比例、边界等）
      })
    },

    clearIntersectionObserverHandle() {
      if (this.data._observer) {
        try {
          this.data._observer.disconnect()
        } catch (_e) {}
        this.setData({ _observer: null })
      }
    },
  },
})
