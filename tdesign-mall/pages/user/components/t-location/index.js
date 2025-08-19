import Toast from "tdesign-miniprogram/toast/index";
import { rejectAddress, resolveAddress } from "../../../../services/address/list";
import { addressParse } from "../../../../utils/addressParse";
import { getPermission } from "../../../../utils/getPermission";
import { phoneRegCheck } from "../../../../utils/util";

Component({
  externalClasses: ["t-class"],
  properties: {
    title: {
      type: String,
    },
    navigateUrl: {
      type: String,
    },
    navigateEvent: {
      type: String,
    },
    isCustomStyle: {
      type: Boolean,
      value: false,
    },
    isDisabledBtn: {
      type: Boolean,
      value: false,
    },
    isOrderSure: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    getWxLocation() {
      if (this.properties.isDisabledBtn) {
        return;
      }
      getPermission({ code: "scope.address", name: "通讯地址" }).then(() => {
        wx.chooseAddress({
          success: async (options) => {
            const { provinceName, cityName, countyName, detailInfo, userName, telNumber } = options;

            if (!phoneRegCheck(telNumber)) {
              Toast({
                context: this,
                selector: "#t-toast",
                message: "请填写正确的手机号",
              });
              return;
            }

            const target = {
              name: userName,
              phone: telNumber,
              countryName: "中国",
              countryCode: "chn",
              detailAddress: detailInfo,
              provinceName,
              cityName,
              districtName: countyName,
              isDefault: false,
              isOrderSure: this.properties.isOrderSure,
            };

            try {
              const { provinceCode, cityCode, districtCode } = await addressParse(
                provinceName,
                cityName,
                countyName
              );

              const params = Object.assign(target, {
                provinceCode,
                cityCode,
                districtCode,
              });
              if (this.properties.isOrderSure) {
                this.onHandleSubmit(params);
              } else if (this.properties.navigateUrl !== "") {
                const { navigateEvent } = this.properties;
                this.triggerEvent("navigate");
                wx.navigateTo({
                  url: this.properties.navigateUrl,
                  success(res) {
                    res.eventChannel.emit(navigateEvent, params);
                  },
                });
              } else {
                this.triggerEvent("change", params);
              }
            } catch (_error) {
              wx.showToast({ title: "地址解析出错，请稍后再试", icon: "none" });
            }
          },
          fail(_err) {},
        });
      });
    },

    async queryAddress(addressId) {
      const { data } = await apis.userInfo.queryAddress({ addressId });
      return data.userAddressVO;
    },

    findPage(pageRouteUrl) {
      const currentRoutes = getCurrentPages().map((v) => v.route);
      return currentRoutes.indexOf(pageRouteUrl);
    },

    async onHandleSubmit(params) {
      try {
        const orderPageDeltaNum = this.findPage("pages/order/order-confirm/index");
        if (orderPageDeltaNum > -1) {
          wx.navigateBack({ delta: 1 });
          resolveAddress(params);
          return;
        }
      } catch (_err) {
        rejectAddress(params);
      }
    },
  },
});
