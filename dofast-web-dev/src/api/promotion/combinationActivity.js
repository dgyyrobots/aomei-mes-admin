import request from '@/utils/request'

// 创建拼团活动
export function createCombinationActivity(data) {
  return request({
    url: '/promotion/combination-activity/create',
    method: 'post',
    data: data
  })
}

// 更新拼团活动
export function updateCombinationActivity(data) {
  return request({
    url: '/promotion/combination-activity/update',
    method: 'put',
    data: data
  })
}

// 删除拼团活动
export function deleteCombinationActivity(id) {
  return request({
    url: '/promotion/combination-activity/delete?id=' + id,
    method: 'delete'
  })
}

// 获得拼团活动
export function getCombinationActivity(id) {
  return request({
    url: '/promotion/combination-activity/get?id=' + id,
    method: 'get'
  })
}

// 获得拼团活动分页
export function getCombinationActivityPage(query) {
  return request({
    url: '/promotion/combination-activity/page',
    method: 'get',
    params: query
  })
}

// 导出拼团活动 Excel
export function exportCombinationActivityExcel(query) {
  return request({
    url: '/promotion/combination-activity/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
