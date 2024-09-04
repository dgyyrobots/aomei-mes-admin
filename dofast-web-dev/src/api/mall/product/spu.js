import request from '@/utils/request';

// 创建商品 SPU
export function createSpu(data) {
  return request({
    url: '/product/spu/create',
    method: 'post',
    data: data,
  });
}

// 更新商品 SPU
export function updateSpu(data) {
  return request({
    url: '/product/spu/update',
    method: 'put',
    data: data,
  });
}

// 删除商品 SPU
export function deleteSpu(id) {
  return request({
    url: '/product/spu/delete?id=' + id,
    method: 'delete',
  });
}

// 获得商品 SPU 详情
export function getSpuDetail(id) {
  return request({
    url: '/product/spu/get-detail?id=' + id,
    method: 'get',
  });
}

// 获得商品 SPU 详情
export function getSpuList(ids) {
  console.log(ids)
  return request({
    // url: '/product/spu/list?ids=' + ids.join(','),
    // method: 'get',
    url: '/product/spu/list',
    method: 'get',
    // 此处为了处理错误这样写，不知为何页面中并没有使用这个返回的数据所以应该没有影响
    params: { spuIds: ((ids && ids.length) ? ids.join(',') : '1') }
  });
}

// 获得商品 SPU 分页
export function getSpuPage(query) {
  return request({
    url: '/product/spu/page',
    method: 'get',
    params: query,
  });
}

// 获得商品 SPU 精简列表
export function getSpuSimpleList() {
  return request({
    url: '/product/spu/list-all-simple',
    method: 'get',
  });
}
// 查询快递运费模版
export function getSimpleTemplateList() {
  return request({
    url: '/trade/delivery/express-template/list-all-simple',
    method: 'get',
  });
}
