import request from '@/utils/request'

// 创建不良品信息管理
export function createDefectiveInfo(data) {
  return request({
    url: '/mes/defective-info/create',
    method: 'post',
    data: data
  })
}

// 更新不良品信息管理
export function updateDefectiveInfo(data) {
  return request({
    url: '/mes/defective-info/update',
    method: 'put',
    data: data
  })
}

// 删除不良品信息管理
export function deleteDefectiveInfo(id) {
  return request({
    url: '/mes/defective-info/delete?id=' + id,
    method: 'delete'
  })
}

// 获得不良品信息管理
export function getDefectiveInfo(id) {
  return request({
    url: '/mes/defective-info/get?id=' + id,
    method: 'get'
  })
}

// 获得不良品信息管理分页
export function getDefectiveInfoPage(query) {
  return request({
    url: '/mes/defective-info/page',
    method: 'get',
    params: query
  })
}

// 导出不良品信息管理 Excel
export function exportDefectiveInfoExcel(query) {
  return request({
    url: '/mes/defective-info/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
