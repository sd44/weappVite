Component({
  relations: {
    "../../c-sidebar/index": {
      type: "parent",
      linked(parent) {
        this.parent = parent
        this.updateActive(parent.data.value)
      },
    },
  },

  externalClasses: ["custom-class"],
  properties: {
    title: String,
    disabled: Boolean,
  },

  data: {
    topRightRadius: false,
    bottomRightRadius: false,
    selected: false,
  },

  methods: {
    setActive(selected: boolean) {
      return this.setData({ selected })
    },
    onClick() {
      const { parent } = this

      if (!parent || this.properties.disabled) {
        return
      }

      const index = parent.children.indexOf(this)

      parent.setActive(index).then(() => {
        this.triggerEvent("click", index)
        parent.triggerEvent("change", { index })
      })
    },
    setTopRightRadius(val: boolean) {
      return this.setData({
        topRightRadius: val,
      })
    },
    setBottomRightRadius(val: boolean) {
      return this.setData({
        bottomRightRadius: val,
      })
    },
  },
})
