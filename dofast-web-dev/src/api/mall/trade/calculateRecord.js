import request from '@/utils/request';

// 创建计价记录
export function createCalculateRecord(data) {
  return request({
    url: '/trade/calculate-record/create',
    method: 'post',
    data: data,
  });
}

// 更新计价记录
export function updateCalculateRecord(data) {
  return request({
    url: '/trade/calculate-record/update',
    method: 'put',
    data: data,
  });
}

// 删除计价记录
export function deleteCalculateRecord(id) {
  return request({
    url: '/trade/calculate-record/delete?id=' + id,
    method: 'delete',
  });
}

// 获得计价记录
export function getCalculateRecord(id) {
  return request({
    url: '/trade/calculate-record/get?id=' + id,
    method: 'get',
  });
}

// 获得计价记录分页
export function getCalculateRecordPage(query) {
  return request({
    url: '/trade/calculate-record/page',
    method: 'get',
    params: query,
  });
}

// 导出计价记录 Excel
export function exportCalculateRecordExcel(query) {
  return request({
    url: '/trade/calculate-record/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
