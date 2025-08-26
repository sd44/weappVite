import ActionSheet, { ActionSheetTheme } from "tdesign-miniprogram/action-sheet/index"
import { fetchGoodsList } from "~/services/good/fetch-goods"
import { fetchHome } from "~/services/home"
import type { LoadStatus, MockGoodLit } from "~/types/common"
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
    goodsList: [] as MockGoodLit[],
    goodsListLoadStatus: 0 as LoadStatus,
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
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
  onReachBottom() {
    // TODO: 实际情况下，应该获取下一页数据；以下为演示方便，获取重复数据
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList()
    }
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
    this.loadGoodsList(true)
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

  // TODO: search逻辑还未实现,跳转 url 应当是错误的
  navToSearchPage() {
    console.log("navToSearchPage 方法被调用")
    wx.navigateTo({ url: `/pages/goods/search/search${genQueryString({ search: "测试" })}` })
  },

  navToActivityDetail({ detail }: WechatMiniprogram.CustomEvent) {
    // FIX: swiper传递时，其实应当也传递相应的 url,以便跳转。为开发方便，先如此
    const { index: promotionID = 0 } = detail || {}
    console.log("navToActivityDetail 方法被调用", promotionID)
    wx.navigateTo({
      url: `/pages/promotion/promotion-detail/promotion-detail?promotion_id=${promotionID}`,
    })
  },
  tabChangeHandle(e: WechatMiniprogram.CustomEvent) {
    this.privateData.tabIndex = e.detail.value

    // FIX: data.tablist 其实应当根据 tabIndex 筛选 goods 数据。为开发方便，先如此
    console.log("tabChangeHandle", this.privateData.tabIndex)
    this.loadGoodsList(true)
  },

  // load-more触发retry event
  onReTry() {
    this.loadGoodsList()
  },

  loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }

    this.setData({ goodsListLoadStatus: 1 })

    // 获取每页需要加载的商品数量
    const pageSize = this.goodListPagination.num

    // TODO: 实际情况下，应该根据 tabIndex 筛选数据，而不是下面这种混乱的算法
    // pageSize = 10（每页 10 条），
    // 当前标签页索引 tabIndex = 1（第二个标签），
    // 该标签页已加载到 index = 2（已加载 3 页：0+1=1、1+1=2、2+1=3）。
    // 则计算结果：
    // pageIndex = 1*10 + 2 + 1 = 13，表示下一页请求第 13 页数据。
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1

    if (fresh) {
      pageIndex = 0
    }

    try {
      const nextList = fetchGoodsList(pageIndex, pageSize)
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      })

      this.goodListPagination.index = pageIndex
      this.goodListPagination.num = pageSize
    } catch (_err) {
      this.setData({ goodsListLoadStatus: 3 })
    }
  },

  goodListClickHandle(e: WechatMiniprogram.CustomEvent) {
    const { index } = e.detail
    const { spuId } = this.data.goodsList[index]
    wx.navigateTo({
      url: `/pages/goods/details/details?spuId=${spuId}`,
    })
  },
})
