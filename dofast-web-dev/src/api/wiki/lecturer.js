import request from '@/utils/request'

// 创建讲师的信息	
export function createLecturer(data) {
  return request({
    url: '/wiki/lecturer/create',
    method: 'post',
    data: data
  })
}

// 更新讲师的信息	
export function updateLecturer(data) {
  return request({
    url: '/wiki/lecturer/update',
    method: 'put',
    data: data
  })
}

// 删除讲师的信息	
export function deleteLecturer(id) {
  return request({
    url: '/wiki/lecturer/delete?id=' + id,
    method: 'delete'
  })
}

// 获得讲师的信息	
export function getLecturer(id) {
  return request({
    url: '/wiki/lecturer/get?id=' + id,
    method: 'get'
  })
}

// 获得讲师的信息	分页
export function getLecturerPage(query) {
  return request({
    url: '/wiki/lecturer/page',
    method: 'get',
    params: query
  })
}

// 导出讲师的信息	 Excel
export function exportLecturerExcel(query) {
  return request({
    url: '/wiki/lecturer/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
