import request from '@/utils/request'

// 创建物料类别
export function createMdItemCategory(data) {
  return request({
    url: '/mes/md-item-category/create',
    method: 'post',
    data: data
  })
}

// 更新物料类别
export function updateMdItemCategory(data) {
  return request({
    url: '/mes/md-item-category/update',
    method: 'put',
    data: data
  })
}

// 删除物料类别
export function deleteMdItemCategory(id) {
  return request({
    url: '/mes/md-item-category/delete?id=' + id,
    method: 'delete'
  })
}

// 获得物料类别
export function getMdItemCategory(id) {
  return request({
    url: '/mes/md-item-category/get?id=' + id,
    method: 'get'
  })
}

// 获得物料类别分页
export function getMdItemCategoryPage(query) {
  return request({
    url: '/mes/md-item-category/page',
    method: 'get',
    params: query
  })
}

// 导出物料类别 Excel
export function exportMdItemCategoryExcel(query) {
  return request({
    url: '/mes/md-item-category/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
