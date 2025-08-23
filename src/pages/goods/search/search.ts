Page({
  data: {
    search: "",
  },
  onLoad(options) {
    // options 中包含所有传递的参数
    console.log("接收的参数：", options)
    // 输出：{ id: '123', name: '测试', type: 'info' }

    // 处理参数（注意：参数值都是字符串类型，需按需转换）
    this.setData({
      search: options.name,
    })
  },
})
