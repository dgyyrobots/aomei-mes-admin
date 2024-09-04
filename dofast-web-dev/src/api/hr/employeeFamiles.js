import request from '@/utils/request';

// 创建员工家庭成员
export function createEmployeeFamiles(data) {
  return request({
    url: '/hr/employee-familes/create',
    method: 'post',
    data: data,
  });
}
// 创建员工家庭成员
export function createEmployeeFamilesmy(data) {
  return request({
    url: '/hr/employee-familes/create-my',
    method: 'post',
    data: data,
  });
}

// 更新员工家庭成员
export function updateEmployeeFamiles(data) {
  return request({
    url: '/hr/employee-familes/update',
    method: 'put',
    data: data,
  });
}

// 删除员工家庭成员
export function deleteEmployeeFamiles(id) {
  return request({
    url: '/hr/employee-familes/delete?id=' + id,
    method: 'delete',
  });
}

// 获得员工家庭成员
export function getEmployeeFamiles(id) {
  return request({
    url: '/hr/employee-familes/get?id=' + id,
    method: 'get',
  });
}
// 获得员工家庭成员
export function getEmployeeFamilesmy(id) {
  return request({
    url: '/hr/employee-familes/get-my?id=' + id,
    method: 'get',
  });
}

// 获得员工家庭成员分页
export function getEmployeeFamilesPage(query) {
  return request({
    url: '/hr/employee-familes/page',
    method: 'get',
    params: query,
  });
}

// 导出员工家庭成员 Excel
export function exportEmployeeFamilesExcel(query) {
  return request({
    url: '/hr/employee-familes/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
