import { config } from "../../config/index"
import { applyService, genApplyReasonList, genRightsPreview } from "../../model/order/applyService"
import { delay } from "../_utils/delay"

/** 获取售后单mock数据 */
function mockFetchRightsPreview(params: { orderNo: string; skuId: string }) {
  return delay().then(() => genRightsPreview(params))
}

/** 获取售后单数据 */
export function fetchRightsPreview(params: { orderNo: string; skuId: string }) {
  if (config.useMock) {
    return mockFetchRightsPreview(params)
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}

/** 确认收货 */
export function dispatchConfirmReceived() {
  if (config.useMock) {
    return delay()
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}

/** 获取可选的mock售后原因列表 */
function mockFetchApplyReasonList(params: { rightsReasonType?: string }) {
  return delay().then(() => genApplyReasonList(params))
}

/** 获取可选的售后原因列表 */
export function fetchApplyReasonList(params: { rightsReasonType?: string }) {
  if (config.useMock) {
    return mockFetchApplyReasonList(params)
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}

/** 发起mock售后申请 */
function mockDispatchApplyService() {
  return delay().then(() => applyService())
}

/** 发起售后申请 */
export function dispatchApplyService() {
  if (config.useMock) {
    return mockDispatchApplyService()
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}
