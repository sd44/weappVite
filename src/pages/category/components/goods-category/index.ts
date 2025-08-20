Component({
  externalClasses: ["custom-class"],

  properties: {
    category: {
      type: Array,
    },
    initActive: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        if (newVal[0] !== oldVal[0]) {
          this.setActiveKey(newVal[0], 0)
        }
      },
    },
    isSlotRight: {
      type: Boolean,
      value: false,
    },
    level: {
      type: Number,
      value: 3,
    },
  },
  data: {
    activeKey: 0,
    subActiveKey: 0,
  },
  attached() {
    if (this.properties.initActive && this.properties.initActive.length > 0) {
      this.setData({
        activeKey: this.properties.initActive[0],
        subActiveKey: this.properties.initActive[1] || 0,
      })
    }
  },
  methods: {
    onParentChange(e: WechatMiniprogram.CustomEvent) {
      this.setActiveKey(e.detail.index, 0).then(() => {
        this.triggerEvent("change", [this.data.activeKey, this.data.subActiveKey])
      })
    },
    onChildChange(e: WechatMiniprogram.CustomEvent) {
      this.setActiveKey(this.data.activeKey, e.detail.index).then(() => {
        this.triggerEvent("change", [this.data.activeKey, this.data.subActiveKey])
      })
    },
    changCategory(e: WechatMiniprogram.CustomEvent) {
      const { item } = e.currentTarget.dataset
      this.triggerEvent("changeCategory", {
        item,
      })
    },
    setActiveKey(key: number, subKey: number) {
      return new Promise((resolve) => {
        this.setData(
          {
            activeKey: key,
            subActiveKey: subKey,
          },
          () => {
            resolve(null)
          }
        )
      })
    },
  },
})
