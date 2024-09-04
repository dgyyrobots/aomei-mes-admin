import request from '@/utils/request';

// 创建工资明细
export function createSalarydetail(data) {
  return request({
    url: '/hr/salarydetail/create',
    method: 'post',
    data: data,
  });
}

// 更新工资明细
export function updateSalarydetail(data) {
  return request({
    url: '/hr/salarydetail/update',
    method: 'put',
    data: data,
  });
}

// 删除工资明细
export function deleteSalarydetail(id) {
  return request({
    url: '/hr/salarydetail/delete?id=' + id,
    method: 'delete',
  });
}

// 获得工资明细
export function getSalarydetail(id) {
  return request({
    url: '/hr/salarydetail/get?id=' + id,
    method: 'get',
  });
}

// 获得工资明细分页
export function getSalarydetailPage(query) {
  return request({
    url: '/hr/salarydetail/page',
    method: 'get',
    params: query,
  });
}

// 导出工资明细 Excel
export function exportSalarydetailExcel(query) {
  return request({
    url: '/hr/salarydetail/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
