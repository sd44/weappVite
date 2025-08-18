Component({
  data: {
    value: "/pages/index/index",
    list: [
      { value: "/pages/index/index", label: "首页", icon: "home" },
      { value: "/pages/hello-world/hello-world", label: "Hello", icon: "app" },
      { value: "label_3", label: "聊天", icon: "chat" },
      { value: "label_4", label: "我的", icon: "user" },
    ],
  },

  methods: {
    onChange(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        value: e.detail.value,
      });
      wx.navigateTo({
        url: e.detail.value,
      });
    },
  },
});
