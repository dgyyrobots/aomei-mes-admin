import request from '@/utils/request'

// 创建安灯呼叫记录
export function createAndonRecord(data) {
  return request({
    url: '/pro/andon-record/create',
    method: 'post',
    data: data
  })
}

// 更新安灯呼叫记录
export function updateAndonRecord(data) {
  return request({
    url: '/pro/andon-record/update',
    method: 'put',
    data: data
  })
}

// 删除安灯呼叫记录
export function deleteAndonRecord(id) {
  return request({
    url: '/pro/andon-record/delete?id=' + id,
    method: 'delete'
  })
}

// 获得安灯呼叫记录
export function getAndonRecord(id) {
  return request({
    url: '/pro/andon-record/get?id=' + id,
    method: 'get'
  })
}

// 获得安灯呼叫记录分页
export function getAndonRecordPage(query) {
  return request({
    url: '/pro/andon-record/page',
    method: 'get',
    params: query
  })
}

// 导出安灯呼叫记录 Excel
export function exportAndonRecordExcel(query) {
  return request({
    url: '/pro/andon-record/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
