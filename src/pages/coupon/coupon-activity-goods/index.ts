import Toast from "tdesign-miniprogram/toast/index"
import { fetchCouponDetail } from "../../../services/coupon/index"
import { fetchGoodsList } from "../../../services/good/fetchGoods"

Page({
  data: {
    goods: [],
    detail: {},
    couponTypeDesc: "",
    showStoreInfoList: false,
    cartNum: 2,
  },

  id: 0,

  onLoad(query: { id: string }) {
    const id = Number.parseInt(query.id, 10)
    this.id = id

    this.getCouponDetail(id)
    this.getGoodsList(id)
  },

  getCouponDetail(id: number) {
    fetchCouponDetail(id).then(({ detail }) => {
      this.setData({ detail })
      if (detail.type === 2) {
        if (detail.base > 0) {
          this.setData({
            couponTypeDesc: `满${detail.base / 100}元${detail.value}折`,
          })
        } else {
          this.setData({ couponTypeDesc: `${detail.value}折` })
        }
      } else if (detail.type === 1) {
        if (detail.base > 0) {
          this.setData({
            couponTypeDesc: `满${detail.base / 100}元减${detail.value / 100}元`,
          })
        } else {
          this.setData({ couponTypeDesc: `减${detail.value / 100}元` })
        }
      }
    })
  },

  getGoodsList(id: number) {
    fetchGoodsList(id).then((goods) => {
      this.setData({ goods })
    })
  },

  openStoreList() {
    this.setData({
      showStoreInfoList: true,
    })
  },

  closeStoreList() {
    this.setData({
      showStoreInfoList: false,
    })
  },

  goodClickHandle(e) {
    const { index } = e.detail
    const { spuId } = this.data.goods[index]
    wx.navigateTo({ url: `/pages/goods/details/index?spuId=${spuId}` })
  },

  cartClickHandle() {
    Toast({
      context: this,
      selector: "#t-toast",
      message: "点击加入购物车",
    })
  },
})
