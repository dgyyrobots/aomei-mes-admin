import request from '@/utils/request'

// 创建首页的分类
export function createCategory(data) {
  return request({
    url: '/wiki/category/create',
    method: 'post',
    data: data
  })
}

// 更新首页的分类
export function updateCategory(data) {
  return request({
    url: '/wiki/category/update',
    method: 'put',
    data: data
  })
}

// 删除首页的分类
export function deleteCategory(id) {
  return request({
    url: '/wiki/category/delete?id=' + id,
    method: 'delete'
  })
}

// 获得首页的分类
export function getCategory(id) {
  return request({
    url: '/wiki/category/get?id=' + id,
    method: 'get'
  })
}

// 获得首页的分类分页
export function getCategoryPage(query) {
  return request({
    url: '/wiki/category/page',
    method: 'get',
    params: query
  })
}

// 导出首页的分类 Excel
export function exportCategoryExcel(query) {
  return request({
    url: '/wiki/category/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
