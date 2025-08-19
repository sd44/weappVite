type priceData = {
  id?: string;
  originPrice?: number;
  price?: number;
};

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    id: String,
    data: Object,
    currency: {
      type: String,
      value: "¥",
    },
    thresholds: Array,
  },

  observers: {
    id(id) {
      this.genIndependentID(id);
      if (this.properties.thresholds?.length) {
        this.createIntersectionObserverHandle();
      }
    },
    data(data: priceData) {
      if (!data) {
        return;
      }
      let isValidityLinePrice = true;
      if (data.originPrice && data.price && data.originPrice < data.price) {
        isValidityLinePrice = false;
      }
      this.setData({ goods: data, isValidityLinePrice });
    },
    // Note: data is both a property and observer by design
    thresholds(thresholds: number[]) {
      if (thresholds?.length) {
        this.createIntersectionObserverHandle();
      } else {
        this.clearIntersectionObserverHandle();
      }
    },
  },

  data: {
    independentID: "",
    goods: { id: "" },
    isValidityLinePrice: false,
  } as {
    independentID: string;
    goods: priceData;
    isValidityLinePrice: boolean;
  },

  lifetimes: {
    ready() {
      this.init();
    },
    detached() {
      this.clear();
    },
  },

  methods: {
    clickHandle() {
      this.triggerEvent("click", { goods: this.data.goods });
    },

    clickThumbHandle() {
      this.triggerEvent("thumb", { goods: this.data.goods });
    },

    addCartHandle(e: WechatMiniprogram.CustomEvent) {
      const { id } = e.currentTarget;
      const { id: cardID } = e.currentTarget.dataset;
      this.triggerEvent("add-cart", {
        ...e.detail,
        id,
        cardID,
        goods: this.data.goods,
      });
    },

    genIndependentID(id: string) {
      let independentID: string;
      if (id) {
        independentID = id;
      } else {
        independentID = `goods-card-${~~(Math.random() * 10 ** 8)}`;
      }
      this.setData({ independentID });
    },

    init() {
      const { thresholds, id } = this.properties;
      this.genIndependentID(id);
      if (thresholds?.length) {
        this.createIntersectionObserverHandle();
      }
    },

    clear() {
      this.clearIntersectionObserverHandle();
    },

    intersectionObserverContext: null,

    createIntersectionObserverHandle() {
      if (this.intersectionObserverContext || !this.data.independentID) {
        return;
      }
      this.intersectionObserverContext = this.createIntersectionObserver({
        thresholds: this.properties.thresholds,
      }).relativeToViewport();

      this.intersectionObserverContext.observe(`#${this.data.independentID}`, (res) => {
        this.intersectionObserverCB(res);
      });
    },

    intersectionObserverCB() {
      this.triggerEvent("ob", {
        goods: this.data.goods,
        context: this.intersectionObserverContext,
      });
    },

    clearIntersectionObserverHandle() {
      if (this.intersectionObserverContext) {
        try {
          this.intersectionObserverContext.disconnect();
        } catch (e) {}
        this.intersectionObserverContext = null;
      }
    },
  },
});
