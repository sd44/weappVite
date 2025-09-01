import ActionSheet, { ActionSheetTheme } from "tdesign-miniprogram/action-sheet/index"
import type { LoadStatus } from "~/components/load-more/load-more"
import type { FetchTabsQuery, LitemallGoodsSelectItem } from "~/gql/graphql"
import { fetchNewGoodsList, fetchTabList } from "~/schema/home"
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
    pageLoading: false,
    tablist: {} as FetchTabsQuery,
    goodsList: [] as LitemallGoodsSelectItem[],
    goodsListLoadStatus: 0 as LoadStatus,

    goodsEnd: false,
    goodsPage: 0,
    num: 6,
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

  async onLoad() {
    await this.loadHomePage()
  },
  onReachBottom() {
    // 触底则获取下一页商品数据
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList()
    }
  },

  async onPullDownRefresh() {
    await this.loadHomePage()
  },
  async loadHomePage() {
    wx.stopPullDownRefresh()

    this.setData({
      pageLoading: true,
    })

    const x = await fetchTabList()
    console.log("fetchTabList", x)
    this.setData({
      tablist: await fetchTabList(),
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

  // load-more触发retry event
  onReTry() {
    this.loadGoodsList()
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }

    this.setData({ goodsListLoadStatus: 1 })

    if (this.data.goodsEnd) {
      return
    }

    const nextList = await fetchNewGoodsList(this.data.num, this.data.goodsPage * this.data.num)
    const litemallGoods = nextList?.litemallGoods ?? []
    if (litemallGoods?.length > 0) {
      this.setData({
        goodsList: this.data.goodsList.concat(litemallGoods),
      })

      if (litemallGoods.length < this.data.num) {
        this.setData({
          goodsEnd: true,
          goodsListLoadStatus: 2,
        })
      } else {
        this.setData({
          goodsListLoadStatus: 0,
          goodsPage: this.data.goodsPage + 1,
        })
      }
    } else {
      this.setData({
        goodsListLoadStatus: 2,
        goodsEnd: true,
      })
    }
    console.log("fetchNewGoodsList", this.data.goodsList)
  },

  goodListClickHandle(e: WechatMiniprogram.CustomEvent) {
    const { index } = e.detail
    console.log("goodListClickHandle", this.data.goodsList[index])
    const { id } = this.data.goodsList[index]
    wx.navigateTo({
      url: `/pages/goods/details/details?spuId=${id}`,
    })
  },

  // TODO: 添加购物车逻辑还未实现
  goodListAddCartHandle(_e: WechatMiniprogram.CustomEvent) {},
})
