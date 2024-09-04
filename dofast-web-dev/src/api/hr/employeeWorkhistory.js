import request from '@/utils/request';

// 创建员工工作经历
export function createEmployeeWorkhistory(data) {
  return request({
    url: '/hr/employee-workhistory/create',
    method: 'post',
    data: data,
  });
}
export function createEmployeeWorkhistorymy(data) {
  return request({
    url: '/hr/employee-workhistory/create-my',
    method: 'post',
    data: data,
  });
}

// 更新员工工作经历
export function updateEmployeeWorkhistory(data) {
  return request({
    url: '/hr/employee-workhistory/update',
    method: 'put',
    data: data,
  });
}
// 更新员工工作经历
export function updateEmployeeWorkhistorymy(data) {
  return request({
    url: '/hr/employee-workhistory/update-my',
    method: 'put',
    data: data,
  });
}

// 删除员工工作经历
export function deleteEmployeeWorkhistory(id) {
  return request({
    url: '/hr/employee-workhistory/delete?id=' + id,
    method: 'delete',
  });
}

// 获得员工工作经历
export function getEmployeeWorkhistory(id) {
  return request({
    url: '/hr/employee-workhistory/get?id=' + id,
    method: 'get',
  });
}
// 获得员工工作经历
export function getEmployeeWorkhistorymy(id) {
  return request({
    url: '/hr/employee-workhistory/get-my?id=' + id,
    method: 'get',
  });
}

// 获得员工工作经历分页
export function getEmployeeWorkhistoryPage(query) {
  return request({
    url: '/hr/employee-workhistory/page',
    method: 'get',
    params: query,
  });
}

// 导出员工工作经历 Excel
export function exportEmployeeWorkhistoryExcel(query) {
  return request({
    url: '/hr/employee-workhistory/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
