import request from '@/utils/request'

// 创建产品冻结信息
export function createFreezeInfo(data) {
  return request({
    url: '/mes/freeze-info/create',
    method: 'post',
    data: data
  })
}

// 更新产品冻结信息
export function updateFreezeInfo(data) {
  return request({
    url: '/mes/freeze-info/update',
    method: 'put',
    data: data
  })
}

// 删除产品冻结信息
export function deleteFreezeInfo(id) {
  return request({
    url: '/mes/freeze-info/delete?id=' + id,
    method: 'delete'
  })
}

// 获得产品冻结信息
export function getFreezeInfo(id) {
  return request({
    url: '/mes/freeze-info/get?id=' + id,
    method: 'get'
  })
}

// 获得产品冻结信息分页
export function getFreezeInfoPage(query) {
  return request({
    url: '/mes/freeze-info/page',
    method: 'get',
    params: query
  })
}

// 导出产品冻结信息 Excel
export function exportFreezeInfoExcel(query) {
  return request({
    url: '/mes/freeze-info/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
