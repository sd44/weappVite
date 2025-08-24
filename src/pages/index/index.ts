import ActionSheet, { ActionSheetTheme } from "tdesign-miniprogram/action-sheet/index"
import { genQueryString } from "~/utils/url-params"

const firstGrid = [
  {
    label: "微信",
    image: "https://tdesign.gtimg.com/mobile/demos/wechat.png",
  },
  {
    label: "朋友圈",
    image: "https://tdesign.gtimg.com/mobile/demos/times.png",
  },
  {
    label: "QQ",
    image: "https://tdesign.gtimg.com/mobile/demos/qq.png",
  },
  {
    label: "企业微信",
    image: "https://tdesign.gtimg.com/mobile/demos/wecom.png",
  },
  {
    label: "收藏",
    icon: "star",
  },
  {
    label: "刷新",
    icon: "refresh",
  },
  {
    label: "下载",
    icon: "download",
  },
  {
    label: "复制",
    icon: "queue",
  },
]
Page({
  data: {
    mode: "light",
  },
  switchMode() {
    if (this.data.mode === "light") {
      this.setData({
        mode: "dark",
      })
    } else {
      this.setData({
        mode: "light",
      })
    }
  },
  async copy(e: WechatMiniprogram.BaseEvent) {
    if (e.mark?.url) {
      await wx.setClipboardData({
        data: e.mark.url,
      })
    }
  },
  handleSelected(_e: WechatMiniprogram.CustomEvent) {},
  onShow() {
    // 以下是自动切换tabbar的官方实现，但我们定义了 tabbar init方法，可直接调用
    // if (typeof this.getTabBar === "function" && this.getTabBar()) {
    //   this.getTabBar().setData({
    //     active: 0,
    //   })
    // }

    this.getTabBar().init()
  },

  onLoad() {},

  handleAction() {
    ActionSheet.show({
      theme: ActionSheetTheme.Grid,
      selector: "#t-action-sheet",
      context: this,
      items: firstGrid,
      align: "center",
      description: "",
    })
  },

  navToSearchPage() {
    console.log("navToSearchPage 方法被调用")
    wx.navigateTo({ url: `/pages/goods/search/search${genQueryString({ search: "测试" })}` })
  },
})
