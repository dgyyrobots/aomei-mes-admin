import request from '@/utils/request'

// 创建报工入库日志
export function createFeedbackWarehousingLog(data) {
  return request({
    url: '/pro/feedback-warehousing-log/create',
    method: 'post',
    data: data
  })
}

// 更新报工入库日志
export function updateFeedbackWarehousingLog(data) {
  return request({
    url: '/pro/feedback-warehousing-log/update',
    method: 'put',
    data: data
  })
}

// 删除报工入库日志
export function deleteFeedbackWarehousingLog(id) {
  return request({
    url: '/pro/feedback-warehousing-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得报工入库日志
export function getFeedbackWarehousingLog(id) {
  return request({
    url: '/pro/feedback-warehousing-log/get?id=' + id,
    method: 'get'
  })
}

// 获得报工入库日志分页
export function getFeedbackWarehousingLogPage(query) {
  return request({
    url: '/pro/feedback-warehousing-log/page',
    method: 'get',
    params: query
  })
}

// 导出报工入库日志 Excel
export function exportFeedbackWarehousingLogExcel(query) {
  return request({
    url: '/pro/feedback-warehousing-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
