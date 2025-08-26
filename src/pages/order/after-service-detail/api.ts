import dayjs from "dayjs"
import type { RightsDetail } from "~/types/order"
import { mockIp, mockReqId } from "~/utils/mock"
import { resp } from "../after-service-list/api"

export const formatTime = (date: number | string | Date, template: string) =>
  dayjs(date).format(template)

export function getRightsDetail({ rightsNo }: { rightsNo: string }): Promise<RightsDetail> {
  const _resq = {
    data: {},
    code: "Success",
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  }
  _resq.data = resp.data.dataList.filter((item) => item.rights.rightsNo === rightsNo) || {}
  return Promise.resolve(_resq)
}

export function cancelRights(): Promise<RightsDetail> {
  const _resq = {
    data: {},
    code: "Success",
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  }
  return Promise.resolve(_resq)
}
