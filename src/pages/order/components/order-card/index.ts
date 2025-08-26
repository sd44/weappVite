Component({
  externalClasses: ["wr-class", "header-class", "title-class"],

  options: {
    multipleSlots: true,
  },

  relations: {
    "../order-goods-card/index": {
      type: "descendant",
      linked(target) {
        this.data.children.push(target)
        this.setHidden()
      },
      unlinked(target) {
        this.data.children = this.data.children.filter((item) => item !== target)
      },
    },
    "../goods-card/index": {
      type: "descendant",
      linked(target) {
        this.data.children.push(target)
        this.setHidden()
      },
      unlinked(target) {
        this.data.children = this.data.children.filter((item) => item !== target)
      },
    },
    "../specs-goods-card/index": {
      type: "descendant",
      linked(target) {
        this.data.children.push(target)
        this.setHidden()
      },
      unlinked(target) {
        this.data.children = this.data.children.filter((item) => item !== target)
      },
    },
  },

  created() {
    this.data.children = []
  },

  properties: {
    order: {
      type: Object,
      observer(order) {
        if (!order?.goodsList) {
          return
        }
        const goodsCount = order.goodsList.length
        this.setData({
          goodsCount,
        })
      },
    },
    useTopRightSlot: Boolean,
    //  初始显示的商品数量，超出部分会隐藏。
    defaultShowNum: {
      type: null,
      value: 10,
    },
    useLogoSlot: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    showAll: true, // 是否展示所有商品，设置为false，可以使用展开更多功能
    goodsCount: 0,
    children: [] as WechatMiniprogram.Component.TrivialInstance[],
  },

  methods: {
    setHidden() {
      const isHidden = !this.data.showAll
      this.data.children.forEach((c, i) => {
        if (i >= this.properties.defaultShowNum) {
          c.setHidden(isHidden)
        }
      })
    },

    onOrderCardTap() {
      this.triggerEvent("cardtap")
    },

    onShowMoreTap() {
      this.setData({ showAll: true }, () => this.setHidden())
      this.triggerEvent("showall")
    },
  },
})
