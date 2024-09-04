import request from '@/utils/request';

// 创建运费模板
export function createExpressTemplate(data) {
  return request({
    url: '/system/express-template/create',
    method: 'post',
    data: data,
  });
}

// 更新运费模板
export function updateExpressTemplate(data) {
  return request({
    url: '/system/express-template/update',
    method: 'put',
    data: data,
  });
}

// 删除运费模板
export function deleteExpressTemplate(id) {
  return request({
    url: '/system/express-template/delete?id=' + id,
    method: 'delete',
  });
}

// 获得运费模板
export function getExpressTemplate(id) {
  return request({
    url: '/system/express-template/get?id=' + id,
    method: 'get',
  });
}

// 获得运费模板分页
export function getExpressTemplatePage(query) {
  return request({
    url: '/system/express-template/page',
    method: 'get',
    params: query,
  });
}

// 导出运费模板 Excel
export function exportExpressTemplateExcel(query) {
  return request({
    url: '/system/express-template/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}
