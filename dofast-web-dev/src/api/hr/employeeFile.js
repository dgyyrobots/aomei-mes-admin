import request from '@/utils/request';

// 创建员工信息文件
export function createEmployeeFile(data) {
  return request({
    url: '/hr/employee-file/create',
    method: 'post',
    data: data,
  });
}
export function createEmployeeFilemy(data) {
  return request({
    url: '/hr/employee-file/create-my',
    method: 'post',
    data: data,
  });
}

// 更新员工信息文件
export function updateEmployeeFile(data) {
  return request({
    url: '/hr/employee-file/update',
    method: 'put',
    data: data,
  });
}
// 更新员工信息文件
export function updateEmployeeFilemy(data) {
  return request({
    url: '/hr/employee-file/update-my',
    method: 'put',
    data: data,
  });
}

// 删除员工信息文件
export function deleteEmployeeFile(id) {
  return request({
    url: '/hr/employee-file/delete?id=' + id,
    method: 'delete',
  });
}

// 获得员工信息文件
export function getEmployeeFile(id) {
  return request({
    url: '/hr/employee-file/get?id=' + id,
    method: 'get',
  });
}
// 获得员工信息文件
export function getEmployeeFilemy(id) {
  return request({
    url: '/hr/employee-file/get-my?id=' + id,
    method: 'get',
  });
}

// 获得员工信息文件分页
export function getEmployeeFilePage(query) {
  return request({
    url: '/hr/employee-file/page',
    method: 'get',
    params: query,
  });
}

// 导出员工信息文件 Excel
export function exportEmployeeFileExcel(query) {
  return request({
    url: '/hr/employee-file/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
