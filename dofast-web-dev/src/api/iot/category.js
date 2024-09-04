import request from '@/utils/request'

// 创建产品分类
export function createCategory(data) {
  return request({
    url: '/iot/category/create',
    method: 'post',
    data: data
  })
}

// 更新产品分类
export function updateCategory(data) {
  return request({
    url: '/iot/category/update',
    method: 'put',
    data: data
  })
}

// 删除产品分类
export function deleteCategory(id) {
  return request({
    url: '/iot/category/delete?id=' + id,
    method: 'delete'
  })
}

// 获得产品分类
export function getCategory(id) {
  return request({
    url: '/iot/category/get?id=' + id,
    method: 'get'
  })
}

// 获得产品分类分页
export function getCategoryPage(query) {
  return request({
    url: '/iot/category/page',
    method: 'get',
    params: query
  })
}

// 导出产品分类 Excel
export function exportCategoryExcel(query) {
  return request({
    url: '/iot/category/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
