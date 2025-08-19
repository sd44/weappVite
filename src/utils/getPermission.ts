type GetPermissionOptions = {
  code: keyof WechatMiniprogram.AuthSetting;
  names: string;
};

export const getPermission = ({ code, names }: GetPermissionOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        // 检查权限是否被拒绝
        if (res.authSetting[code] === false) {
          wx.showModal({
            title: `获取${names}失败`,
            content: `获取${names}失败，请在【右上角】-小程序【设置】项中，将【${names}】开启。`,
            confirmText: "去设置",
            confirmColor: "#FA550F",
            cancelText: "取消", // 修正原代码中的cancelColor错误
            cancelColor: "#666666",
            success(modalRes) {
              if (modalRes.confirm) {
                wx.openSetting({
                  success(settingRes) {
                    if (settingRes.authSetting[code] === true) {
                      resolve();
                    } else {
                      reject(new Error(`Permission ${code} not granted`));
                    }
                  },
                  fail() {
                    reject(new Error("Failed to open setting"));
                  },
                });
              } else {
                reject(new Error("User canceled permission request"));
              }
            },
            fail() {
              reject(new Error("Failed to show modal"));
            },
          });
        } else {
          // 权限已授予或未请求过，直接resolve
          resolve();
        }
      },
      fail() {
        reject(new Error("Failed to get setting"));
      },
    });
  });
};
