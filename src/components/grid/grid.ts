import type { FetchTabsQuery } from "~/gql/graphql"

Component({
  properties: {
    tablist: {
      type: Object,
      value: [] as FetchTabsQuery[],
    },
  },
  observers: {
    tablist(tablist) {
      console.log("tabs in grid", tablist)
    },
  },
  methods: {
    onClickItem(e: WechatMiniprogram.TouchEvent) {
      const { id } = e.currentTarget.dataset
      console.log("onClickItem", id)
      // TODO: 跳转到分类页面
      // wx.navigateTo({
      //   url: `/pages/category/index?categoryId=${id}`,
      // })
    },
  },
})
