import request from '@/utils/request'

// 创建首页知识列表的信息	
export function createCoursewave(data) {
  return request({
    url: '/wiki/coursewave/create',
    method: 'post',
    data: data
  })
}

// 更新首页知识列表的信息	
export function updateCoursewave(data) {
  return request({
    url: '/wiki/coursewave/update',
    method: 'put',
    data: data
  })
}

// 删除首页知识列表的信息	
export function deleteCoursewave(id) {
  return request({
    url: '/wiki/coursewave/delete?id=' + id,
    method: 'delete'
  })
}

// 获得首页知识列表的信息	
export function getCoursewave(id) {
  return request({
    url: '/wiki/coursewave/get?id=' + id,
    method: 'get'
  })
}

// 获得首页知识列表的信息	分页
export function getCoursewavePage(query) {
  return request({
    url: '/wiki/coursewave/page',
    method: 'get',
    params: query
  })
}

// 导出首页知识列表的信息	 Excel
export function exportCoursewaveExcel(query) {
  return request({
    url: '/wiki/coursewave/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
