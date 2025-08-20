const systemInfo = wx.getWindowInfo()
Component({
  externalClasses: ["t-class", "t-class-load"],
  properties: {
    loadFailed: {
      type: String,
      value: "default",
    },
    loading: {
      type: String,
      value: "default",
    },
    src: {
      type: String,
      value: "",
    },
    mode: {
      type: String,
      value: "aspectFill",
    },
    webp: {
      type: Boolean,
      value: true,
    },
    lazyLoad: {
      type: Boolean,
      value: false,
    },
    showMenuByLongpress: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    thumbHeight: 375,
    thumbWidth: 375,
    systemInfo,
  },
  lifetimes: {
    ready() {
      const { mode } = this.properties
      // 获取容器的真实宽高，设置图片的裁剪宽度

      this.getRect(".J-image").then((res) => {
        if (res) {
          const { width, height } = res
          this.setData(
            mode === "heightFix"
              ? {
                  thumbHeight: this.px2rpx(height) || 375,
                }
              : {
                  thumbWidth: this.px2rpx(width) || 375,
                }
          )
        }
      })
    },
  },
  methods: {
    px2rpx(px: number) {
      return (750 / (systemInfo.screenWidth || 375)) * px
    },
    getRect(selector: string): Promise<{ width: number; height: number }> {
      return new Promise((resolve, reject) => {
        this.createSelectorQuery()
          .select(selector)
          .boundingClientRect((rect) => {
            if (rect) {
              // 只返回宽和高
              resolve({
                width: rect.width,
                height: rect.height,
              })
            } else {
              reject(new Error(`未找到选择器为 ${selector} 的元素`))
            }
          })
          .exec()
      })
    },
    onLoad(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent("load", e.detail)
    },
    onError(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent("error", e.detail)
    },
  },
})
