import request from '@/utils/request'

// 创建点检计划记录单身
export function createDvCheckPlanLineLog(data) {
  return request({
    url: '/cmms/dv-check-plan-line-log/create',
    method: 'post',
    data: data
  })
}

// 更新点检计划记录单身
export function updateDvCheckPlanLineLog(data) {
  return request({
    url: '/cmms/dv-check-plan-line-log/update',
    method: 'put',
    data: data
  })
}

// 删除点检计划记录单身
export function deleteDvCheckPlanLineLog(id) {
  return request({
    url: '/cmms/dv-check-plan-line-log/delete?id=' + id,
    method: 'delete'
  })
}

// 获得点检计划记录单身
export function getDvCheckPlanLineLog(id) {
  return request({
    url: '/cmms/dv-check-plan-line-log/get?id=' + id,
    method: 'get'
  })
}

// 获得点检计划记录单身分页
export function getDvCheckPlanLineLogPage(query) {
  return request({
    url: '/cmms/dv-check-plan-line-log/page',
    method: 'get',
    params: query
  })
}

// 导出点检计划记录单身 Excel
export function exportDvCheckPlanLineLogExcel(query) {
  return request({
    url: '/cmms/dv-check-plan-line-log/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
