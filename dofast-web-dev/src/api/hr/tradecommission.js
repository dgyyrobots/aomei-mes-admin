import request from '@/utils/request';

// 创建工资提成
export function createTradecommission(data) {
  return request({
    url: '/hr/tradecommission/create',
    method: 'post',
    data: data,
  });
}

// 更新工资提成
export function updateTradecommission(data) {
  return request({
    url: '/hr/tradecommission/update',
    method: 'put',
    data: data,
  });
}

// 删除工资提成
export function deleteTradecommission(id) {
  return request({
    url: '/hr/tradecommission/delete?id=' + id,
    method: 'delete',
  });
}

// 获得工资提成
export function getTradecommission(id) {
  return request({
    url: '/hr/tradecommission/get?id=' + id,
    method: 'get',
  });
}

// 获得工资提成分页
export function getTradecommissionPage(query) {
  return request({
    url: '/hr/tradecommission/page',
    method: 'get',
    params: query,
  });
}

// 导出工资提成 Excel
export function exportTradecommissionExcel(query) {
  return request({
    url: '/hr/tradecommission/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
