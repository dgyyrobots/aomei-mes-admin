import request from '@/utils/request';

// 创建工资总
export function createSalary(data) {
  return request({
    url: '/hr/salary/create',
    method: 'post',
    data: data,
  });
}

// 更新工资总
export function updateSalary(data) {
  return request({
    url: '/hr/salary/update',
    method: 'put',
    data: data,
  });
}

// 删除工资总
export function deleteSalary(id) {
  return request({
    url: '/hr/salary/delete?id=' + id,
    method: 'delete',
  });
}

// 获得工资总
export function getSalary(id) {
  return request({
    url: '/hr/salary/get?id=' + id,
    method: 'get',
  });
}

// 获得工资总分页
export function getSalaryPage(query) {
  return request({
    url: '/hr/salary/page',
    method: 'get',
    params: query,
  });
}

// 导出工资总 Excel
export function exportSalaryExcel(query) {
  return request({
    url: '/hr/salary/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
