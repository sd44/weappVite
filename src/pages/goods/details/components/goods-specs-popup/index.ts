import Toast from "tdesign-miniprogram/toast/index"
import type { SkuInfo, Spec, SpecValue } from "../../../../../model/someTypes"

type SpecValueWithSelection = {
  specValueId: string
  specId: string | null
  saasId: string | null
  specValue: string
  image: string | null
  hasStockObj?: {
    hasStock: boolean
    specsArray: string[][]
  }
  isSelected?: boolean
}

type SpecWithSelection = {
  specId: string
  title: string
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
        if (skuList.length > 0 && this.data.initStatus) {
          this.initData()
        }
      },
    },
    specList: {
      type: Array,
      value: [] as Spec[],
      observer(specList: Spec[]) {
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
    selectSpecObj: {} as Record<string, string[]>,
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
        selectSpecObj: {} as Record<string, string[]>,
        selectedSku: {} as Record<string, string>,
        initStatus: true,
      })
    },

    checkSkuStockQuantity(specValueId: string, skuList: SkuInfo[]) {
      let hasStock = false
      const specsArray: string[][] = []

      for (const item of skuList) {
        for (const subItem of item.specInfo || []) {
          if (subItem.specValueId === specValueId && item.stockInfo.stockQuantity > 0) {
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
      selectSpecObj: Record<string, string[]>,
      specList: SpecWithSelection[]
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
      item: SpecWithSelection,
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
          itemAllSpecArray.push(n.hasStockObj.specsArray)
        }
        if (n.hasStockObj?.hasStock) {
          itemSelectArray.push(n.specValueId)
        } else {
          itemUnSelectArray.push(n.specValueId)
        }
      }

      if (subSpecValueItem?.hasStockObj?.specsArray) {
        const flattenedArray = this.flatten(
          subSpecValueItem.hasStockObj.specsArray.concat([itemSelectArray])
        )
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

    processUnselectedSpec(item: SpecWithSelection, selectSpecObj: Record<string, string[]>) {
      const currentItemSelectArray: string[][][] = []
      for (const n of item.specValueList) {
        if (n.hasStockObj?.specsArray) {
          currentItemSelectArray.push(n.hasStockObj.specsArray)
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
      specList: SpecWithSelection[],
      skuList: SkuInfo[]
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

    updateStockStatusBasedOnResult(specList: SpecWithSelection[], lastResult: string[]) {
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

    resetAllSkuStockStatus(specList: SpecWithSelection[], skuList: SkuInfo[]) {
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
    isAllSelected(skuTree: Spec[], selectedSku: Record<string, string>): boolean {
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
