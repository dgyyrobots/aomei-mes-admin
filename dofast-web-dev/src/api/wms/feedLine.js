import request from '@/utils/request'

// 创建上料详情
export function createFeedLine(data) {
  return request({
    url: '/wms/feed-line/create',
    method: 'post',
    data: data
  })
}

export function createFeedLineList(data) {
  return request({
    url: '/wms/feed-line/createList',
    method: 'post',
    data: data
  })
}


export function createFeedLineListByIssueId(issueId) {
  return request({
    url: '/wms/feed-line/createListByIssueId',
    method: 'post',
    data: issueId
  })
}



// 更新上料详情
export function updateFeedLine(data) {
  return request({
    url: '/wms/feed-line/update',
    method: 'put',
    data: data
  })
}

// 删除上料详情
export function deleteFeedLine(id) {
  return request({
    url: '/wms/feed-line/delete?id=' + id,
    method: 'delete'
  })
}

// 获得上料详情
export function getFeedLine(id) {
  return request({
    url: '/wms/feed-line/get?id=' + id,
    method: 'get'
  })
}

export function getByTaskId(id) {
  return request({
    url: '/wms/feed-line/getByTaskId?id=' + id,
    method: 'get'
  })
}


// 获得上料详情
export function getByIssueId(id) {
  return request({
    url: '/wms/feed-line/getByIssueId?id=' + id,
    method: 'get'
  })
}

// 获得上料详情分页
export function getFeedLinePage(query) {
  return request({
    url: '/wms/feed-line/page',
    method: 'get',
    params: query
  })
}

// 导出上料详情 Excel
export function exportFeedLineExcel(query) {
  return request({
    url: '/wms/feed-line/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 获取汇总信息
export function summeryPage(query) {
  return request({
    url: '/wms/feed-line/summeryPage',
    method: 'get',
    params: query
  })
}

