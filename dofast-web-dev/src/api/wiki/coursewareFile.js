import request from '@/utils/request'

// 创建课件文件的保存地址
export function createCoursewareFile(data) {
  return request({
    url: '/wiki/courseware-file/create',
    method: 'post',
    data: data
  })
}

// 更新课件文件的保存地址
export function updateCoursewareFile(data) {
  return request({
    url: '/wiki/courseware-file/update',
    method: 'put',
    data: data
  })
}

// 删除课件文件的保存地址
export function deleteCoursewareFile(id) {
  return request({
    url: '/wiki/courseware-file/delete?id=' + id,
    method: 'delete'
  })
}

// 获得课件文件的保存地址
export function getCoursewareFile(id) {
  return request({
    url: '/wiki/courseware-file/get?id=' + id,
    method: 'get'
  })
}

// 获得课件文件的保存地址分页
export function getCoursewareFilePage(query) {
  return request({
    url: '/wiki/courseware-file/page',
    method: 'get',
    params: query
  })
}

// 导出课件文件的保存地址 Excel
export function exportCoursewareFileExcel(query) {
  return request({
    url: '/wiki/courseware-file/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
