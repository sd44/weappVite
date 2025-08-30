// TODO: refactor 从 litemallNotice 获取数据

Component({
  data: {
    visible: true,
    navigatorProps: {
      url: "/pages/xxx/xxx",
    },
  },

  methods: {
    click(e: WechatMiniprogram.CustomEvent) {
      const { trigger } = e.detail
      console.log(`click on the ${trigger} area`)
    },
  },
})
