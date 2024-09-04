import request from '@/utils/request';
import { tansParams } from '@/utils/ruoyi';

// 创建电子面单
export function createElectronicsheetPackage(data) {
  return request({
    url: '/trade/electronicsheet-package/create',
    method: 'post',
    data: data,
  });
}

// 更新电子面单
export function updateElectronicsheetPackage(data) {
  return request({
    url: '/trade/electronicsheet-package/update',
    method: 'put',
    data: data,
  });
}

// 删除电子面单
export function deleteElectronicsheetPackage(id) {
  return request({
    url: '/trade/electronicsheet-package/delete?id=' + id,
    method: 'delete',
  });
}

// 获得电子面单
export function getElectronicsheetPackage(id) {
  return request({
    url: '/trade/electronicsheet-package/get?id=' + id,
    method: 'get',
  });
}

// 获得电子面单分页
export function getElectronicsheetPackagePage(query) {
  return request({
    url: '/trade/electronicsheet-package/page',
    method: 'get',
    params: query,
  });
}

// 导出电子面单 Excel
export function exportElectronicsheetPackageExcel(query) {
  return request({
    url: '/trade/electronicsheet-package/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 获得电子面单分页
export function getElectronicsheetPackageList(orderId) {
  return request({
    url: '/trade/electronicsheet-package/page',
    method: 'get',
    params: { orderId, pageSize: 100, pageNo: 1 },
  }).then(res => {
    return {
      ...res,
      data: res.data ? res.data.list : [],
    };
  });
}

export function createElectronicsheetPackageByDot3(data) {
  return Promise.resolve({ data: {} });
}

export function getElectronConfig(orderNo) {
  return request({
    url: '/trade/electronicsheet-package/getByOrderNo?orderNo=' + orderNo,
    method: 'GET',
  });
}
// export function getElectronConfig(waybillCodes) {
//   return request({
//     url: '/dian3/order/cloud-print-info?waybillCodes=' + waybillCodes.join(','),
//     method: 'POST',
//     data: {
//       waybillCodes,
//     },
//   });
// }
