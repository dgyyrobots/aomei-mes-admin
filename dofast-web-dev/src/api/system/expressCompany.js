import request from '@/utils/request';

// 创建系统物流公司
export function createExpressCompany(data) {
  return request({
    url: '/system/express-company/create',
    method: 'post',
    data: data,
  });
}

// 更新系统物流公司
export function updateExpressCompany(data) {
  return request({
    url: '/system/express-company/update',
    method: 'put',
    data: data,
  });
}

// 删除系统物流公司
export function deleteExpressCompany(id) {
  return request({
    url: '/system/express-company/delete?id=' + id,
    method: 'delete',
  });
}

// 获得系统物流公司
export function getExpressCompany(id) {
  return request({
    url: '/system/express-company/get?id=' + id,
    method: 'get',
  });
}

// 获得系统物流公司分页
export function getExpressCompanyPage(query) {
  return request({
    url: '/system/express-company/page',
    method: 'get',
    params: query,
  });
}

// 导出系统物流公司 Excel
export function exportExpressCompanyExcel(query) {
  return request({
    url: '/system/express-company/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

export function getDot3ExpressCompanyPage(query) {
  return request({
    url: '/dian3/order/get-logistics-list',
    method: 'post',
    data: {
      pageNo: query.pageNo,
      pageSize: query.pageSize,
      name: query.name,
    },
  });
}

// 获得系统物流公司列表
export function getExpressCompanyList(query) {
  return request({
    url: '/system/express-company/page',
    method: 'get',
    params: { pageSize: 100, pageNo: 1 },
  }).then(res => {
    return {
      ...res,
      data: res.data ? res.data.list : [],
    };
  });
}
