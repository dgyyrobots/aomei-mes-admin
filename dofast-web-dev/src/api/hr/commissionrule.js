import request from '@/utils/request';

// 创建提成规则
export function createCommissionrule(data) {
  return request({
    url: '/hr/commissionrule/create',
    method: 'post',
    data: data,
  });
}

// 更新提成规则
export function updateCommissionrule(data) {
  return request({
    url: '/hr/commissionrule/update',
    method: 'put',
    data: data,
  });
}

// 删除提成规则
export function deleteCommissionrule(id) {
  return request({
    url: '/hr/commissionrule/delete?id=' + id,
    method: 'delete',
  });
}

// 获得提成规则
export function getCommissionrule(id) {
  return request({
    url: '/hr/commissionrule/get?id=' + id,
    method: 'get',
  });
}

// 获得提成规则分页
export function getCommissionrulePage(query) {
  return request({
    url: '/hr/commissionrule/page',
    method: 'get',
    params: query,
  });
}

// 导出提成规则 Excel
export function exportCommissionruleExcel(query) {
  return request({
    url: '/hr/commissionrule/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
