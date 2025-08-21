import Toast from "tdesign-miniprogram/toast/index"
import type { SkuInfo, Spec, SpecValue } from "~/model/someTypes"

interface SpecValueWithSelection extends SpecValue {
  hasStockObj?: {
    hasStock: boolean
    specsArray: string[][]
  }
  isSelected?: boolean
}

interface SpecWithSelection extends Spec {
  specValueList: SpecValueWithSelection[]
}

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  properties: {
    src: {
      type: String,
    },
    title: String,
    show: {
      type: Boolean,
      value: false,
    },
    limitBuyInfo: {
      type: String,
      value: "",
    },
    isStock: {
      type: Boolean,
      value: true,
    },
    limitMaxCount: {
      type: Number,
      value: 999,
    },
    limitMinCount: {
      type: Number,
      value: 1,
    },
    skuList: {
      type: Array,
      value: [],
      observer(skuList: SkuInfo[]) {
        if (skuList && skuList.length > 0 && this.data.initStatus) {
          this.initData()
        }
      },
    },
    specList: {
      type: Array,
      value: [] as Spec[],
      observer(specList: Spec[]) {
        if (specList && specList.length > 0) {
          this.initData()
        }
      },
    },
    outOperateStatus: {
      type: Boolean,
      value: false,
    },
    hasAuth: {
      type: Boolean,
      value: false,
    },
    count: {
      type: Number,
      value: 1,
      observer(count: number) {
        this.setData({
          buyNum: count,
        })
      },
    },
  },

  data: {
    buyNum: 1,
    isAllSelectedSku: false,
    initStatus: false,
    selectedSku: {} as Record<string, string>,
    selectSpecObj: {} as Record<string, string[]>,
  },

  methods: {
    initData() {
      const { skuList, specList } = this.data
      for (const item of specList) {
        if (item.specValueList.length > 0) {
          for (const subItem of item.specValueList) {
            const obj = this.checkSkuStockQuantity(subItem.specValueId, skuList)
            subItem.hasStockObj = obj
          }
        }
      }
      const selectedSku: Record<string, string> = {}
      for (const item of specList) {
        selectedSku[item.specId] = ""
      }
      this.setData({
        specList,
        selectSpecObj: {} as Record<string, string[]>,
        selectedSku: {} as Record<string, string>,
        initStatus: true,
      })
    },

    checkSkuStockQuantity(specValueId: string, skuList: any[]) {
      let hasStock = false
      const specsArray: string[][] = []

      for (const item of skuList) {
        for (const subItem of item.specInfo || []) {
          if (subItem.specValueId === specValueId && item.quantity > 0) {
            const subArray: string[] = []
            for (const specItem of item.specInfo || []) {
              subArray.push(specItem.specValueId)
            }
            specsArray.push(subArray)
            hasStock = true
          }
        }
      }

      return {
        hasStock,
        specsArray,
      }
    },

    chooseSpecValueId(specValueId: string, specId: string) {
      const { selectSpecObj, skuList, specList } = this.data as {
        selectSpecObj: Record<string, string[]>
        skuList: SkuInfo[]
        specList: SpecWithSelection[]
      }

      if (selectSpecObj[specId]) {
        selectSpecObj[specId] = []
      } else {
        selectSpecObj[specId] = []
      }

      const itemAllSpecArray: any[] = []
      const itemUnSelectArray: string[] = []
      const itemSelectArray: string[] = []

      for (const item of specList) {
        if (item.specId === specId) {
          const subSpecValueItem = item.specValueList.find(
            (subItem) => subItem.specValueId === specValueId
          )
          let specSelectStatus = false
          for (const n of item.specValueList) {
            if (n.hasStockObj?.specsArray) {
              itemAllSpecArray.push(n.hasStockObj.specsArray)
            }
            if (n.isSelected) {
              specSelectStatus = true
            }
            if (n.hasStockObj?.hasStock) {
              itemSelectArray.push(n.specValueId)
            } else {
              itemUnSelectArray.push(n.specValueId)
            }
          }
          if (specSelectStatus && subSpecValueItem?.hasStockObj?.specsArray) {
            selectSpecObj[specId] = this.flatten(
              subSpecValueItem.hasStockObj.specsArray.concat(itemSelectArray)
            )
          } else {
            const subSet = (arr1: string[], arr2: string[]) => {
              const set2 = new Set(arr2)
              const subset: string[] = []
              for (const val of arr1) {
                if (!set2.has(val)) {
                  subset.push(val)
                }
              }
              return subset
            }
            selectSpecObj[specId] = subSet(
              this.flatten(itemAllSpecArray),
              this.flatten(itemUnSelectArray)
            )
          }
        } else {
          // 未点击规格的逻辑
          const currentItemSelectArray: string[][] = []
          let specSelectStatus = false
          for (const n of item.specValueList) {
            if (n.hasStockObj?.specsArray) {
              currentItemSelectArray.push(n.hasStockObj.specsArray)
            }
            if (n.isSelected) {
              specSelectStatus = true
            }
          }
          if (specSelectStatus) {
            selectSpecObj[item.specId] = this.flatten(currentItemSelectArray)
          } else {
            delete selectSpecObj[item.specId]
          }
        }
      }

      this.setData({
        selectSpecObj,
      })

      const combatArray = Object.values(selectSpecObj)
      if (combatArray.length > 0) {
        const showArray = combatArray.reduce((x: any[], y: any[]) => this.getIntersection(x, y))
        const lastResult = Array.from(new Set(showArray)) as string[]
        for (const item of specList) {
          for (const subItem of item.specValueList) {
            if (lastResult.includes(subItem.specValueId)) {
              if (subItem.hasStockObj) {
                subItem.hasStockObj.hasStock = true
              }
            } else if (subItem.hasStockObj) {
              subItem.hasStockObj.hasStock = false
            }
          }
        }
      } else {
        for (const item of specList) {
          if (item.specValueList.length > 0) {
            for (const subItem of item.specValueList) {
              const obj = this.checkSkuStockQuantity(subItem.specValueId, skuList)
              subItem.hasStockObj = obj
            }
          }
        }
      }
      this.setData({
        specList,
      })
    },

    flatten(input: any[]): any[] {
      const stack = [...input]
      const res: any[] = []
      while (stack.length) {
        const next = stack.pop()
        if (Array.isArray(next)) {
          stack.push(...next)
        } else {
          res.push(next)
        }
      }
      return res.reverse()
    },

    getIntersection(array: any[], nextArray: any[]): any[] {
      return array.filter((item) => nextArray.includes(item))
    },

    toChooseItem(e: WechatMiniprogram.TouchEvent) {
      const { isStock } = this.properties
      if (!isStock) {
        return
      }
      const { id } = e.currentTarget.dataset
      const specId = e.currentTarget.dataset.specid
      const hasStock = e.currentTarget.dataset.hasstock
      if (!hasStock) {
        Toast({
          context: this,
          selector: "#t-toast",
          message: "该规格已售罄",
          icon: "",
          duration: 1000,
        })
        return
      }

      let { selectedSku } = this.data as { selectedSku: Record<string, string> }
      const { specList } = this.properties as {
        specList: Array<Spec & { specValueList: Array<SpecValue & { isSelected?: boolean }> }>
      }
      selectedSku =
        selectedSku[specId] === id
          ? { ...this.data.selectedSku, [specId]: "" }
          : { ...this.data.selectedSku, [specId]: id }
      for (const item of specList) {
        for (const valuesItem of item.specValueList) {
          if (item.specId === specId) {
            valuesItem.isSelected = valuesItem.specValueId === selectedSku[specId]
          }
        }
      }
      this.chooseSpecValueId(id, specId)
      const isAllSelectedSku = this.isAllSelected(specList, selectedSku)
      if (!isAllSelectedSku) {
        this.setData({
          selectSkuSellsPrice: 0,
          selectSkuImg: "",
        })
      }
      this.setData({
        specList,
        isAllSelectedSku,
        selectedSku,
      })
      this.triggerEvent("change", {
        specList,
        selectedSku,
        isAllSelectedSku,
      })
    },

    // 判断是否所有的sku都已经选中
    isAllSelected(skuTree: any[], selectedSku: Record<string, string>): boolean {
      const selected = Object.keys(selectedSku).filter((skuKeyStr) => selectedSku[skuKeyStr] !== "")
      return skuTree.length === selected.length
    },

    handlePopupHide() {
      this.triggerEvent("closeSpecsPopup", {
        show: false,
      })
    },

    specsConfirm() {
      const { isStock } = this.properties
      if (!isStock) {
        return
      }
      this.triggerEvent("specsConfirm")
    },

    addCart() {
      const { isStock } = this.properties
      if (!isStock) {
        return
      }
      this.triggerEvent("addCart")
    },

    buyNow() {
      const { isAllSelectedSku } = this.data
      const { isStock } = this.properties
      if (!isStock) {
        return
      }
      this.triggerEvent("buyNow", {
        isAllSelectedSku,
      })
    },

    // 总处理
    setBuyNum(buyNum: number) {
      this.setData({
        buyNum,
      })
      this.triggerEvent("changeNum", {
        buyNum,
      })
    },

    handleBuyNumChange(e: WechatMiniprogram.Input) {
      const { value } = e.detail
      this.setData({
        buyNum: Number(value),
      })
    },
  },
})
