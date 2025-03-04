import request from '@/utils/request'

// 创建报工缺陷
export function createFeedbackDefect(data) {
  return request({
    url: '/pro/feedback-defect/create',
    method: 'post',
    data: data
  })
}

// 更新报工缺陷
export function updateFeedbackDefect(data) {
  return request({
    url: '/pro/feedback-defect/update',
    method: 'put',
    data: data
  })
}

// 删除报工缺陷
export function deleteFeedbackDefect(id) {
  return request({
    url: '/pro/feedback-defect/delete?id=' + id,
    method: 'delete'
  })
}

// 获得报工缺陷
export function getFeedbackDefect(id) {
  return request({
    url: '/pro/feedback-defect/get?id=' + id,
    method: 'get'
  })
}

// 获得报工缺陷分页
export function getFeedbackDefectPage(query) {
  return request({
    url: '/pro/feedback-defect/page',
    method: 'get',
    params: query
  })
}

// 导出报工缺陷 Excel
export function exportFeedbackDefectExcel(query) {
  return request({
    url: '/pro/feedback-defect/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
