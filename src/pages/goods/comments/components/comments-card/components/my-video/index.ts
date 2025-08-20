Component({
  externalClasses: ["my-video", "my-cover-img", "my-play-icon"],
  properties: {
    videoSrc: { type: String },
  },
  data: {
    isShow: true,
    videoContext: null,
    fullScreen: false,
  } as {
    isShow: boolean
    videoContext: WechatMiniprogram.VideoContext | null
    fullScreen: boolean
  },

  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  attached() {
    this.setData({
      videoContext: wx.createVideoContext("myVideo", this),
    })
  },

  methods: {
    // 点击封面自定义播放按钮时触发
    bindplay(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        isShow: false,
      })
      this.data.videoContext?.play()
      this.triggerEvent("play", e)
    },

    bindplayByVideo(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        isShow: false,
      })
      this.triggerEvent("play", e)
    },

    // 监听播放到末尾时触发
    bindended(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.fullScreen) {
        this.setData({
          isShow: true,
        })
      }
      this.triggerEvent("ended", e)
    },
    // 监听暂停播放时触发
    bindpause(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent("pause", e)
    },
    bindfullscreenchange(e: WechatMiniprogram.CustomEvent) {
      const fullScreen = e?.detail?.fullScreen
      this.setData({
        fullScreen,
      })
    },
  },
})
