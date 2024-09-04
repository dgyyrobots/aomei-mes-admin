import request from '@/utils/request';

// 创建员工基本信息
export function createEmployeeBasic(data) {
  return request({
    url: '/hr/employee-basic/create',
    method: 'post',
    data: data,
  });
}
// 创建员工基本个人信息
export function createEmployeeBasicmy(data) {
  return request({
    url: '/hr/employee-basic/create-my',
    method: 'post',
    data: data,
  });
}

// 更新员工基本信息
export function updateEmployeeBasic(data) {
  return request({
    url: '/hr/employee-basic/update',
    method: 'put',
    data: data,
  });
}

// 更新员工基本个人信息
export function updateEmployeeBasicmy(data) {
  return request({
    url: '/hr/employee-basic/update-my',
    method: 'put',
    data: data,
  });
}

// 删除员工基本信息 
export function deleteEmployeeBasic(id) {
  return request({
    url: '/hr/employee-basic/delete?id=' + id,
    method: 'delete',
  });
}

// 获得员工基本信息
export function getEmployeeBasic() {
  return request({
    url: '/hr/employee-basic/get',
    method: 'get',
  });
}
// 获得员工基本信息
export function getEmployeeBasicmy() {
  return request({
    url: '/hr/employee-basic/get-my',
    method: 'get',
  });
}

// 获得员工基本信息分页
export function getEmployeeBasicPage(query) {
  return request({
    url: '/hr/employee-basic/page',
    method: 'get',
    params: query,
  });
}

// 导出员工基本信息 Excel
export function exportEmployeeBasicExcel(query) {
  return request({
    url: '/hr/employee-basic/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
