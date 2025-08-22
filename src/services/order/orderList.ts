// import { config } from "../../config/index"
import { genOrders, genOrdersCount } from "../../model/order/orderList"
import { delay } from "../_utils/delay"

/** 获取订单列表mock数据 */
function mockFetchOrders(params: {
  parameter: { pageNum: number; pageSize: number; orderStatus: number }
}) {
  return delay(200).then(() => genOrders(params))
}

/** 获取订单列表数据 */
export function fetchOrders(params: {
  parameter: { pageNum: number; pageSize: number; orderStatus: number }
}) {
  // if (config.useMock) {
  return mockFetchOrders(params)
  // }

  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}

/** 获取订单列表mock数据 */
function mockFetchOrdersCount() {
  return delay().then(() => genOrdersCount())
}

/** 获取订单列表统计 */
export function fetchOrdersCount() {
  // if (config.useMock) {
  return mockFetchOrdersCount()
  // }

  // return new Promise((resolve) => {
  //   resolve("real api")
  // })
}
