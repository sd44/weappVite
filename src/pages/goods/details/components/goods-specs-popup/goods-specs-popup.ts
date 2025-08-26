import Toast from "tdesign-miniprogram/toast/index"
import type { SkuItem, SpecItem, SpecsArray } from "~/types/common"

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
      observer(skuList: SkuItem[]) {
        if (skuList.length > 0 && this.data.initStatus) {
          this.initData()
        }
      },
    },
    specList: {
      type: Array,
      value: [] as SpecItem[],
      observer(specList: SpecItem[]) {
        if (specList.length > 0) {
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
    selectSpecObj: {} as SpecsArray,
  },

  methods: {
    initData() {
      const { skuList, specList } = this.data
      for (const item of specList) {
        for (const subItem of item.specValueList) {
          const obj = this.checkSkuStockQuantity(subItem.specValueId, skuList)
          subItem.hasStockObj = obj
        }
      }
      const selectedSku: Record<string, string> = {}
      for (const item of specList) {
        selectedSku[item.specId] = ""
      }
      this.setData({
        specList,
        selectSpecObj: {} as SpecsArray,
        selectedSku: {} as Record<string, string>,
        initStatus: true,
      })
    },

    checkSkuStockQuantity(specValueId: string, skuList: SkuItem[]) {
      let hasStock = false
      const specsArray: SpecsArray = {}

      for (const item of skuList) {
        for (const subItem of item.specInfo || []) {
          if (subItem.specValueId === specValueId && item.stockInfo.stockQuantity > 0) {
            const subArray: string[] = []
            for (const specItem of item.specInfo || []) {
              subArray.push(specItem.specValueId)
            }
            specsArray[specValueId] = subArray
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
      const { selectSpecObj, skuList, specList } = this.data
      this.resetSelectSpecObjForSpec(selectSpecObj, specId)
      this.processSpecSelection(specId, specValueId, selectSpecObj, specList)
      this.updateSelectSpecObj(selectSpecObj)
      this.updateSkuAvailability(selectSpecObj, specList, skuList)
      this.setData({ specList })
    },

    resetSelectSpecObjForSpec(selectSpecObj: Record<string, string[]>, specId: string) {
      selectSpecObj[specId] = []
    },

    processSpecSelection(
      specId: string,
      specValueId: string,
      selectSpecObj: SpecsArray,
      specList: SpecItem[]
    ) {
      for (const item of specList) {
        if (item.specId === specId) {
          this.processSelectedSpec(item, specValueId, selectSpecObj, specId)
        } else {
          this.processUnselectedSpec(item, selectSpecObj)
        }
      }
    },

    processSelectedSpec(
      item: SpecItem,
      specValueId: string,
      selectSpecObj: Record<string, string[]>,
      specId: string
    ) {
      const itemAllSpecArray: string[][][] = []
      const itemUnSelectArray: string[] = []
      const itemSelectArray: string[] = []

      const subSpecValueItem = item.specValueList.find(
        (subItem) => subItem.specValueId === specValueId
      )

      for (const n of item.specValueList) {
        if (n.hasStockObj?.specsArray) {
          itemAllSpecArray.push(Object.values(n.hasStockObj.specsArray))
        }
        if (n.hasStockObj?.hasStock) {
          itemSelectArray.push(n.specValueId)
        } else {
          itemUnSelectArray.push(n.specValueId)
        }
      }

      if (subSpecValueItem?.hasStockObj?.specsArray) {
        const specArrays = Object.values(subSpecValueItem.hasStockObj.specsArray)
        const flattenedArray = this.flatten(specArrays.concat([itemSelectArray]))
        selectSpecObj[specId] = flattenedArray
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
    },

    processUnselectedSpec(item: SpecItem, selectSpecObj: Record<string, string[]>) {
      const currentItemSelectArray: string[][][] = []
      for (const n of item.specValueList) {
        if (n.hasStockObj?.specsArray) {
          currentItemSelectArray.push(Object.values(n.hasStockObj.specsArray))
        }
      }
      if (currentItemSelectArray.length > 0) {
        selectSpecObj[item.specId] = this.flatten(currentItemSelectArray)
      } else {
        delete selectSpecObj[item.specId]
      }
    },

    updateSelectSpecObj(selectSpecObj: Record<string, string[]>) {
      this.setData({ selectSpecObj })
    },

    updateSkuAvailability(
      selectSpecObj: Record<string, string[]>,
      specList: SpecItem[],
      skuList: SkuItem[]
    ) {
      const combatArray = Object.values(selectSpecObj)
      if (combatArray.length > 0) {
        const showArray = combatArray.reduce((x: string[], y: string[]) =>
          this.getIntersection(x, y)
        )
        const lastResult = Array.from(new Set(showArray)) as string[]
        this.updateStockStatusBasedOnResult(specList, lastResult)
      } else {
        this.resetAllSkuStockStatus(specList, skuList)
      }
    },

    updateStockStatusBasedOnResult(specList: SpecItem[], lastResult: string[]) {
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
    },

    resetAllSkuStockStatus(specList: SpecItem[], skuList: SkuItem[]) {
      for (const item of specList) {
        for (const subItem of item.specValueList) {
          const obj = this.checkSkuStockQuantity(subItem.specValueId, skuList)
          subItem.hasStockObj = obj
        }
      }
    },

    flatten(input: unknown[]): string[] {
      const stack = [...input]
      const res: string[] = []
      while (stack.length) {
        const next = stack.pop()
        if (Array.isArray(next)) {
          stack.push(...next)
        } else if (typeof next === "string") {
          res.push(next)
        }
      }
      return res.reverse()
    },

    getIntersection(array: string[], nextArray: string[]): string[] {
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

      let { selectedSku } = this.data
      const { specList } = this.properties
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
    isAllSelected(skuTree: SpecItem[], selectedSku: Record<string, string>): boolean {
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
