import request from '@/utils/request';

// 创建员工教育培训经历
export function createEmployeeEducation(data) {
  return request({
    url: '/hr/employee-education/create',
    method: 'post',
    data: data,
  });
}
// 创建员工个人教育培训经历
export function createEmployeeEducationmy(data) {
  return request({
    url: '/hr/employee-education/create-my',
    method: 'post',
    data: data,
  });
}

// 更新员工教育培训经历
export function updateEmployeeEducation(data) {
  return request({
    url: '/hr/employee-education/update',
    method: 'put',
    data: data,
  });
}

// 删除员工教育培训经历
export function deleteEmployeeEducation(id) {
  return request({
    url: '/hr/employee-education/delete?id=' + id,
    method: 'delete',
  });
}

// 获得员工教育培训经历
export function getEmployeeEducation(id) {
  return request({
    url: '/hr/employee-education/get?id=' + id,
    method: 'get',
  });
}
// 获得gr员工教育培训经历
export function getEmployeeEducationmy(id) {
  return request({
    url: '/hr/employee-education/get-my?id=' + id,
    method: 'get',
  });
}

// 获得员工教育培训经历分页
export function getEmployeeEducationPage(query) {
  return request({
    url: '/hr/employee-education/page',
    method: 'get',
    params: query,
  });
}

// 导出员工教育培训经历 Excel
export function exportEmployeeEducationExcel(query) {
  return request({
    url: '/hr/employee-education/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
