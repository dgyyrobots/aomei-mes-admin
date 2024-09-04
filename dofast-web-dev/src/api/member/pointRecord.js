import request from '@/utils/request'

// 创建会员积分
export function createPointRecord(data) {
  return request({
    url: '/member/point/record/create',
    method: 'post',
    data: data
  })
}

// 更新会员积分
export function updatePointRecord(data) {
  return request({
    url: '/member/point/record/update',
    method: 'put',
    data: data
  })
}

// 删除会员积分
export function deletePointRecord(id) {
  return request({
    url: '/member/point/record/delete?id=' + id,
    method: 'delete'
  })
}

// 获得会员积分
export function getPointRecord(id) {
  return request({
    url: '/member/point/record/get?id=' + id,
    method: 'get'
  })
}

// 获得会员积分分页
export function getPointRecordPage(query) {
  return request({
    url: '/member/point/record/page',
    method: 'get',
    params: query
  })
}

// 导出会员积分 Excel
export function exportPointRecordExcel(query) {
  return request({
    url: '/member/point/record/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
