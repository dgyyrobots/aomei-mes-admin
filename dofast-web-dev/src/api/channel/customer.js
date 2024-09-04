import request from '@/utils/request';

// 创建交易客户
export function createCustomer(data) {
  return request({
    url: '/channel/customer/create',
    method: 'post',
    data: data,
  });
}

// 更新交易客户
export function updateCustomer(data) {
  return request({
    url: '/channel/customer/update',
    method: 'put',
    data: data,
  });
}

// 删除交易客户
export function deleteCustomer(id) {
  return request({
    url: '/channel/customer/delete?id=' + id,
    method: 'delete',
  });
}

// 获得交易客户
export function getCustomer(id) {
  return request({
    url: '/channel/customer/get?id=' + id,
    method: 'get',
  });
}

// 获得交易客户分页
export function getCustomerPage(query) {
  return request({
    url: '/channel/customer/page',
    method: 'get',
    params: query,
  });
}

// 导出交易客户 Excel
export function exportCustomerExcel(query) {
  return request({
    url: '/channel/customer/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
