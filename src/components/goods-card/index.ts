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
  lifetimes: {
    ready() {
      this.init();
    },
    detached() {
      this.clear();
    },
  },

  data: {
    independentID: "",
    goods: { id: "" },
    isValidityLinePrice: false,
    _observer: null, // 用于存储 IntersectionObserver 实例
  } as {
    independentID: string;
    goods: priceData;
    isValidityLinePrice: boolean;
    _observer: null | WechatMiniprogram.IntersectionObserver;
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

    createIntersectionObserverHandle() {
      if (this.data._observer || !this.data.independentID) {
        return;
      }
      const _observer = this.createIntersectionObserver({
        thresholds: this.properties.thresholds,
      }).relativeToViewport();

      _observer.observe(`#${this.data.independentID}`, () => {
        this.intersectionObserverCB();
      });
      this.setData({ _observer });
    },

    intersectionObserverCB() {
      this.triggerEvent("ob", {
        goods: this.data.goods,
        context: this.data._observer,
      });
    },

    clearIntersectionObserverHandle() {
      if (this.data._observer) {
        try {
          this.data._observer.disconnect();
        } catch (_e) {}
        this.setData({ _observer: null });
      }
    },
  },
});
