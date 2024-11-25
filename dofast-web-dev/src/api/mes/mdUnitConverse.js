import request from '@/utils/request'

// 创建单位换算
export function createMdUnitConverse(data) {
  return request({
    url: '/mes/md-unit-converse/create',
    method: 'post',
    data: data
  })
}

// 更新单位换算
export function updateMdUnitConverse(data) {
  return request({
    url: '/mes/md-unit-converse/update',
    method: 'put',
    data: data
  })
}

// 删除单位换算
export function deleteMdUnitConverse(id) {
  return request({
    url: '/mes/md-unit-converse/delete?id=' + id,
    method: 'delete'
  })
}

// 获得单位换算
export function getMdUnitConverse(id) {
  return request({
    url: '/mes/md-unit-converse/get?id=' + id,
    method: 'get'
  })
}

// 获得单位换算分页
export function getMdUnitConversePage(query) {
  return request({
    url: '/mes/md-unit-converse/page',
    method: 'get',
    params: query
  })
}

// 导出单位换算 Excel
export function exportMdUnitConverseExcel(query) {
  return request({
    url: '/mes/md-unit-converse/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
