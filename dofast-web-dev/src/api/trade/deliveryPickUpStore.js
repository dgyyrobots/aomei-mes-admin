import request from '@/utils/request'

// 创建自提门店
export function createDeliveryPickUpStore(data) {
  return request({
    url: '/trade/delivery/pick-up-store/create',
    method: 'post',
    data: data
  })
}

// 更新自提门店
export function updateDeliveryPickUpStore(data) {
  return request({
    url: '/trade/delivery/pick-up-store/update',
    method: 'put',
    data: data
  })
}

// 删除自提门店
export function deleteDeliveryPickUpStore(id) {
  return request({
    url: '/trade/delivery/pick-up-store/delete?id=' + id,
    method: 'delete'
  })
}

// 获得自提门店
export function getDeliveryPickUpStore(id) {
  return request({
    url: '/trade/delivery/pick-up-store/get?id=' + id,
    method: 'get'
  })
}

// 获得自提门店分页
export function getDeliveryPickUpStorePage(query) {
  return request({
    url: '/trade/delivery/pick-up-store/page',
    method: 'get',
    params: query
  })
}

// 导出自提门店 Excel
export function exportDeliveryPickUpStoreExcel(query) {
  return request({
    url: '/trade/delivery/pick-up-store/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
