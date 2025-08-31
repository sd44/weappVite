import type { FetchTabsQuery } from "~/gql/graphql"

Component({
  properties: {
    tabs: {
      type: Object,
      value: {} as FetchTabsQuery,
    },
  },
  methods: {
    onClickItem(e: WechatMiniprogram.TouchEvent) {
      const { id } = e.currentTarget.dataset
      console.log("onClickItem", id)
      console.log("dataset is: ", e.currentTarget.dataset)
      console.log("details is: ", e.detail)
      // TODO: 跳转到分类页面
      // wx.navigateTo({
      //   url: `/pages/category/index?categoryId=${id}`,
      // })
    },
  },
})
