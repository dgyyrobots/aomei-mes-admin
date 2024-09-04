import request from '@/utils/request';

// 查询仓库设置列表
export function listWarehouse(query) {
  return request({
    url: '/wms/warehouse/page',
    method: 'get',
    params: { ids: [] },
  });
}

// 查询仓库设置列表
export function getWarehouseList(query) {
  return request({
    url: '/wms/warehouse/list',
    method: 'get',
    params: query,
  });
}

export function getTreeList() {
  return request({
    url: '/wms/warehouse/getTreeList',
    method: 'get',
  }).then(res => {
    res.data = (res.data || []).map(level1 => {
      if (level1.children) {
        level1.children = level1.children.map(level2 => {
          if (level2.children) {
            level2.children = level2.children.map(level3 => {
              return {
                ...level3,
                pId: level3.id,
                pName: level3.areaName,
                lId: level3.locationId,
                areaId: level3.id,
              };
            });
          }
          return {
            ...level2,
            wId: level2.warehouseId,
            pId: level2.id,
            pName: level2.locationName,
            locationId: level2.id,
          };
        });
      }
      return {
        ...level1,
        wId: level1.id,
        pId: level1.id,
        pName: level1.warehouseName,
        warehouseId: level1.id,
      };
    });
    //   this.warehouseOptions.map(w => {
    //     w.children.map(l => {
    //       let lstr = JSON.stringify(l.children)
    //         .replace(/locationId/g, 'lId')
    //         .replace(/areaId/g, 'pId')
    //         .replace(/areaName/g, 'pName');
    //       l.children = JSON.parse(lstr);
    //     });
    //
    //     let wstr = JSON.stringify(w.children)
    //       .replace(/warehouseId/g, 'wId')
    //       .replace(/locationId/g, 'pId')
    //       .replace(/locationName/g, 'pName');
    //     w.children = JSON.parse(wstr);
    //   });
    // let ostr = JSON.stringify(this.warehouseOptions)
    //   .replace(/warehouseId/g, 'pId')
    //   .replace(/warehouseName/g, 'pName');
    // this.warehouseOptions = JSON.parse(ostr);
    return res;
  });
}

// 查询仓库设置详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/wms/warehouse/get?id=' + warehouseId,
    method: 'get',
  });
}

// 新增仓库设置
export function addWarehouse(data) {
  return request({
    url: '/wms/warehouse/create',
    method: 'post',
    data: data,
  });
}

// 修改仓库设置
export function updateWarehouse(data) {
  return request({
    url: '/wms/warehouse/update',
    method: 'put',
    data: data,
  });
}

// 删除仓库设置
export function delWarehouse(warehouseId) {
  return request({
    url: '/wms/warehouse/delete?id=' + warehouseId,
    method: 'delete',
  });
}
