import { config } from "../../config/index"
import { genBusinessTime, genOrderDetail } from "../../model/order/orderDetail"
import { delay } from "../_utils/delay"

/** 获取订单详情mock数据 */
function mockFetchOrderDetail(params: { parameter: string }) {
  return delay().then(() => genOrderDetail(params))
}

/** 获取订单详情数据 */
export function fetchOrderDetail(params: { parameter: string }) {
  if (config.useMock) {
    return mockFetchOrderDetail(params)
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}

/** 获取客服mock数据 */
function mockFetchBusinessTime() {
  return delay().then(() => genBusinessTime())
}

/** 获取客服数据 */
export function fetchBusinessTime() {
  if (config.useMock) {
    return mockFetchBusinessTime()
  }

  return new Promise((resolve) => {
    resolve("real api")
  })
}
