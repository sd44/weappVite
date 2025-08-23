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
