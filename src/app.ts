import updateManager from "~/common/updateManager"

App({
  globalData: {},

  // 小程序启动之后 触发
  onLaunch() {},
  onShow() {
    updateManager()
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
})
// 开发者可以通过 getApp 方法获取到全局唯一的 App 实例，获取App上的数据或调用开发者注册在 App 上的函数。
// xxx.js
// const appInstance = getApp()
// console.log(appInstance.globalData) // I am global data
