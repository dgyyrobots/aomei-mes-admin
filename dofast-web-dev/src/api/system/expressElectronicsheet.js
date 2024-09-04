import request from '@/utils/request'

// 创建电子面单
export function createExpressElectronicsheet(data) {
  return request({
    url: '/system/express-electronicsheet/create',
    method: 'post',
    data: data
  })
}

// 更新电子面单
export function updateExpressElectronicsheet(data) {
  return request({
    url: '/system/express-electronicsheet/update',
    method: 'put',
    data: data
  })
}

// 删除电子面单
export function deleteExpressElectronicsheet(id) {
  return request({
    url: '/system/express-electronicsheet/delete?id=' + id,
    method: 'delete'
  })
}

// 获得电子面单
export function getExpressElectronicsheet(id) {
  return request({
    url: '/system/express-electronicsheet/get?id=' + id,
    method: 'get'
  })
}

// 获得电子面单分页
export function getExpressElectronicsheetPage(query) {
  return request({
    url: '/system/express-electronicsheet/page',
    method: 'get',
    params: query
  })
}

// 导出电子面单 Excel
export function exportExpressElectronicsheetExcel(query) {
  return request({
    url: '/system/express-electronicsheet/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
export function getElectronSheetList(orderId) {
  return request({
    url: '/deliver/express-electronicsheet/page',
    method: 'get',
    params: { orderId, pageSize: 100, pageNo: 1 },
  }).then(res => {
    return {
      ...res,
      data: res.data ? res.data.list : [],
    };
  });
}

// export function getElectronSheetList() {
//   return Promise.resolve({
//     data: [
//       //
//       {
//         id: 1,
//         companyName: '快递鸟-顺心速运-01',
//         type: 'kdbird',
//         info: {},
//         code: 'SX',
//         // dot3Code: 'SX',
//         template: {},
//         config: {
//           code: 'S571BJE',
//           id: 'C50016740',
//           CustomerName: 'C50016740',
//           CustomerPwd: 'C84CA159AE18F3C514469DECBD9D4A37',
//           SendSite: 'S571BJE', // '2200787324679',
//           ExpType: 1,
//           PayType: 3,
//         },
//       },
//       {
//         id: 2,
//         companyName: '快递鸟-顺心速运-02',
//         type: 'kdbird',
//         info: {},
//         code: 'SX',
//         // dot3Code: 'SX',
//         template: {},
//         config: {
//           code: 'S571BJE',
//           id: 'C50016739',
//           CustomerName: 'C50016739',
//           CustomerPwd: '47CE7AF08BF360620A412014F7565073',
//           SendSite: 'S571BJE', // '2211105729824',
//           ExpType: 1,
//           PayType: 3,
//         },
//       },
//       {
//         id: 3,
//         companyName: '快递鸟-韵达速递-自用',
//         type: 'kdbird',
//         info: {},
//         code: 'YD',
//         // dot3Code: 'YD',
//         template: { id: 180, size: '100*180' },
//         config: { code: '56571721', CustomerName: '56571721', CustomerPwd: '56571721', ExpType: 1, PayType: 3 },
//       },
//       {
//         id: 4,
//         companyName: '快递鸟-邮政国内标快-自用',
//         type: 'kdbird',
//         info: {},
//         code: 'EMS',
//         // dot3Code: 'EMS',
//         template: { id: 180, size: '100*180' },
//         config: { code: '56571721', CustomerName: '1100134225559', CustomerPwd: '123456', ExpType: 1, PayType: 3 },
//       },
//       {
//         id: 5,
//         companyName: '快递鸟-顺丰速运-自用',
//         type: 'kdbird',
//         info: {},
//         code: 'SF',
//         // dot3Code: 'SF',
//         template: { id: 180, size: '100*180' },
//         config: {
//           code: '56571721',
//           CustomerName: 'XL15618003959',
//           CustomerPwd: 'xl202159',
//           MonthCode: '0210479638',
//           ExpType: 1,
//           PayType: 3,
//         },
//       },
//       {
//         id: 6,
//         companyName: '点三-测试物流',
//         type: 'dot3',
//         info: {},
//         template: {
//           id: '',
//           url: '',
//         },
//         code: 'YD',
//         dot3Code: 'testC',
//         config: {
//           id: '794663',
//           code: 'testC',
//           name: '测试物流',
//           status: 'VALID',
//           printTemplate: null,
//           authInfo: null,
//           ewPlatformType: 'PDD',
//           logisticsCode: '1',
//           logisticsName: '韵达快递',
//         },
//       },
//     ],
//   });
// }
