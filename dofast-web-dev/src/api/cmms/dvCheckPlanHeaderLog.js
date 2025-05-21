import request from '@/utils/request'

// 创建点检计划记录单头
export function createDvCheckPlanHeaderLog(data) {
  return request({
    url: '/cmms/dv-check-plan-header-log/create',
    method: 'post',
    data: data
  })
}

// 更新点检计划记录单头
export function updateDvCheckPlanHeaderLog(data) {
  return request({
    url: '/cmms/dv-check-plan-header-log/update',
    method: 'put',
    data: data
  })
}

// 删除点检计划记录单头
export function deleteDvCheckPlanHeaderLog(id) {
  return request({
    url: '/cmms/dv-check-plan-header-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得点检计划记录单头
export function getDvCheckPlanHeaderLog(id) {
  return request({
    url: '/cmms/dv-check-plan-header-log/get?id=' + id,
    method: 'get'
  })
}

// 获得点检计划记录单头分页
export function getDvCheckPlanHeaderLogPage(query) {
  return request({
    url: '/cmms/dv-check-plan-header-log/page',
    method: 'get',
    params: query
  })
}

// 导出点检计划记录单头 Excel
export function exportDvCheckPlanHeaderLogExcel(query) {
  return request({
    url: '/cmms/dv-check-plan-header-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
