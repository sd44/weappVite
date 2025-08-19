import updateManager from "./common/updateManager";

App({
  onLaunch() {},
  onShow() {
    updateManager();
  },
});
