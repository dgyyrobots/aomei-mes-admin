import request from '@/utils/request';

// 创建绩效工资
export function createSalarycommission(data) {
  return request({
    url: '/hr/salarycommission/create',
    method: 'post',
    data: data,
  });
}

// 更新绩效工资
export function updateSalarycommission(data) {
  return request({
    url: '/hr/salarycommission/update',
    method: 'put',
    data: data,
  });
}

// 删除绩效工资
export function deleteSalarycommission(id) {
  return request({
    url: '/hr/salarycommission/delete?id=' + id,
    method: 'delete',
  });
}

// 获得绩效工资
export function getSalarycommission(id) {
  return request({
    url: '/hr/salarycommission/get?id=' + id,
    method: 'get',
  });
}

// 获得绩效工资分页
export function getSalarycommissionPage(query) {
  return request({
    url: '/hr/salarycommission/page',
    method: 'get',
    params: query,
  });
}

// 导出绩效工资 Excel
export function exportSalarycommissionExcel(query) {
  return request({
    url: '/hr/salarycommission/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
