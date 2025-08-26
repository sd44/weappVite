import { getActivity } from "../../model/activity"

/** 获取活动列表 */
function mockFetchActivity(ID = 0) {
  return getActivity(ID)
}

/** 获取活动列表 */
export function fetchActivity(ID = 0) {
  return mockFetchActivity(ID)
}
