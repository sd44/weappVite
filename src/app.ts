import updateManager from "./common/updateManager";

App({
  globalData: {},

  // 小程序启动之后 触发
  onLaunch() {},
  onShow() {
    updateManager();
  },
});
