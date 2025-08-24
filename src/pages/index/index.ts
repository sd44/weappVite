import ActionSheet, { ActionSheetTheme } from "tdesign-miniprogram/action-sheet/index"
import { fetchHome } from "~/services/home"
import { genQueryString } from "~/utils/url-params"

export type TabItem = {
  text: string
  key: number
}

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
    pageLoading: false,
    tablist: [] as TabItem[],
    swiper: {
      imgSrcs: [] as string[],
      pageLoading: false,
      current: 1,
      autoplay: true,
      duration: "500",
      interval: 5000,
      navigation: { type: "dots" },
      swiperImageProps: { mode: "scaleToFill" },
    },
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

  onLoad() {
    this.loadHomePage()
  },

  onPullDownRefresh() {
    this.loadHomePage()
  },
  loadHomePage() {
    wx.stopPullDownRefresh()

    this.setData({
      pageLoading: true,
    })
    const { swiperImgs, tabList } = fetchHome()
    this.setData({
      tabList,
      swiper: { ...this.data.swiper, imgSrcs: swiperImgs },
      pageLoading: false,
    })
    //TODO: this.loadGoodsList(true)
  },

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

  navToActivityDetail({ detail }: WechatMiniprogram.CustomEvent) {
    // FIX: swiper传递时，其实应当也传递相应的 url,以便跳转。为开发方便，先如此
    const { index: promotionID = 0 } = detail || {}
    console.log("navToActivityDetail 方法被调用", promotionID)
    wx.navigateTo({
      url: `/pages/promotion/promotion-detail/index?promotion_id=${promotionID}`,
    })
  },
})
