import request from '@/utils/request'

// 创建工序异常缺陷名称
export function createcessDefect(data) {
  return request({
    url: '/pro/cess-defect/create',
    method: 'post',
    data: data
  })
}

// 更新工序异常缺陷名称
export function updatecessDefect(data) {
  return request({
    url: '/pro/cess-defect/update',
    method: 'put',
    data: data
  })
}

// 删除工序异常缺陷名称
export function deletecessDefect(id) {
  return request({
    url: '/pro/cess-defect/delete?id=' + id,
    method: 'delete'
  })
}

// 获得工序异常缺陷名称
export function getcessDefect(id) {
  return request({
    url: '/pro/cess-defect/get?id=' + id,
    method: 'get'
  })
}

// 获得工序异常缺陷名称分页
export function getcessDefectPage(query) {
  return request({
    url: '/pro/cess-defect/page',
    method: 'get',
    params: query
  })
}

// 导出工序异常缺陷名称 Excel
export function exportcessDefectExcel(query) {
  return request({
    url: '/pro/cess-defect/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获得工序异常缺陷名称
export function getByCode(processCode) {
  return request({
    url: '/pro/cess-defect/getByCode?processCode=' + processCode,
    method: 'get',
  })
}
