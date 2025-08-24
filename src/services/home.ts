import { cdnBase } from "~/config/index"
import { genSwiperImageList } from "~/model/swiper"

/** 获取首页数据 */
function mockFetchHome() {
  return {
    swiperImgs: genSwiperImageList(),
    tabList: [
      {
        text: "精选推荐",
        key: 0,
      },
      {
        text: "夏日防晒",
        key: 1,
      },
      {
        text: "二胎大作战",
        key: 2,
      },
      {
        text: "人气榜",
        key: 3,
      },
      {
        text: "好评榜",
        key: 4,
      },
      {
        text: "RTX 30",
        key: 5,
      },
      {
        text: "手机也疯狂",
        key: 6,
      },
    ],
    activityImg: `${cdnBase}/activity/banner.png`,
  }
}

/** 获取首页数据 */
export function fetchHome() {
  return mockFetchHome()
}
