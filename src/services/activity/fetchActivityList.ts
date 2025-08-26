import { getActivityList } from "~/model/activities"

/** 获取活动列表 */
function mockFetchActivityList(pageIndex = 1, pageSize = 20) {
  return getActivityList(pageIndex, pageSize)
}

/** 获取活动列表 */
export function fetchActivityList(pageIndex = 1, pageSize = 20) {
  return mockFetchActivityList(pageIndex, pageSize)
}
