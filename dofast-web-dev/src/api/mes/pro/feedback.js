import request from '@/utils/request';

// 查询生产报工记录列表
export function listFeedback(query) {
  return request({
    url: '/mes/pro/feedback/page',
    method: 'get',
    params: query,
  });
}

export function listFeedbackAuditPage(query) {
  return request({
    url: '/mes/pro/feedback/auditPage',
    method: 'get',
    params: query,
  });
}


// 查询生产报工记录列表
export function traceFeedbackPage(query) {
  return request({
    url: '/mes/pro/feedback/traceFeedbackPage',
    method: 'get',
    params: query,
  });
}


// 查询生产报工记录详细
export function getFeedback(recordId) {
  return request({
    url: '/mes/pro/feedback/get?id=' + recordId,
    method: 'get',
  });
}

// 查询生产报工记录详细
export function getFeedbackDetail(recordId) {
  return request({
    url: '/mes/pro/feedback/getDetail?id=' + recordId,
    method: 'get',
  });
}

// 新增生产报工记录
export function addFeedback(data) {
  return request({
    url: '/mes/pro/feedback/create',
    method: 'post',
    data: data,
  });
}

// 修改生产报工记录
export function updateFeedback(data) {
  return request({
    url: '/mes/pro/feedback/update',
    method: 'put',
    data: data,
  });
}


// 修改生产报工记录备注
export function updateFeedbackRemark(data) {
  return request({
    url: '/mes/pro/feedback/updateRemark',
    method: 'put',
    data: data,
  });
}


// 删除生产报工记录
export function delFeedback(recordId) {
  return request({
    url: '/mes/pro/feedback/delete?id=' + recordId,
    method: 'delete',
  });
}

export function execute(recordId) {
  return request({
    url: '/mes/pro/feedback/' + recordId,
    method: 'put',
  });
}
//增加-审核是否通过
export function executes(data) {
  return request({
    url: `/mes/pro/feedback/update-feedback-status`,
    method: 'put',
    params: {
      id: data.id,
      status: data.status,
      warehouseId: data.warehouseId,
      locationId: data.locationId,
      areaId: data.areaId
    }
    // data: data
  });
}

// 产成品入库
export function startWareHousing(data) {
  return request({
    url: '/mes/pro/feedback/wareHousing',
    method: 'post',
    data: data,
  });
}

// 报工单拆分
export function splitFeedback(data) {
  return request({
    url: '/mes/pro/feedback/splitFeedback',
    method: 'post',
    data: data,
  })
}

// 获取条码打印数据
export function checkWarehousing(recordId) {
  return request({
    url: '/mes/pro/feedback/checkWarehousing?id=' + recordId,
    method: 'get',
  });
}

// 撤销报工
export function reFeedback(data) {
  return request({
    url: '/mes/pro/feedback/reFeedback',
    method: 'post',
    data: data,
  });
}

// 合并报工单
export function mergeFeedback(data) {
  return request({
    url: '/mes/pro/feedback/mergeFeedback',
    method: 'post',
    data: data,
  });
}

// 查询报工后的存储仓库
export function initWarehouse(query) {
  return request({
    url: '/mes/pro/feedback/initWarehouse',
    method: 'get',
    params: query,
  });
}

// 查询生产报工记录详细
export function updatePrintStatus(recordId) {
  return request({
    url: '/mes/pro/feedback/updatePrintStatus?id=' + recordId,
    method: 'put',
  });
}

export function feedbackErp(id) {
  return request({
    url: '/mes/pro/feedback/feedbackErp?id=' + id,
    method: 'put',
  });
}

export function warehousingErp(data) {
  return request({
    url: '/mes/pro/feedback/warehousingErp',
    method: 'post',
    data: data
  });
}


export function checkProcess(recordId) {
  return request({
    url: '/mes/pro/feedback/checkProcess?id=' + recordId,
    method: 'get',
  });
}


// 查询生产报工记录详细
export function test(recordId) {
  return request({
    url: '/iot/device/getIotDevice',
    method: 'get',
  });
}


// 导出主订单 Excel
export function exportExcel(query) {
  return request({
    url: '/mes/pro/feedback/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob',
  });
}

// 导出主订单 Excel
export function exportJimu(query) {
  return request({
    url: '/mes/pro/feedback/export-jimu',
    method: 'get',
    params: query,
  });
}

export function syncwarehousingErp(ids) {
  return request({
    url: '/mes/pro/feedback/syncwarehousingErp?ids=' + ids,
    method: 'put',
  });
}

// 提交审核API
export function submitFeedbackAudit(ids) {
  return request({
    url: '/mes/pro/feedback/audit',
    method: 'post',
    data: ids
  })
}

export function getIotFeedbackData(machineryCode) {
  return request({
    url: '/mes/pro/feedback/getIotFeedbackData?machineryCode=' + machineryCode,
    method: 'get',
  });
}

// 产成品撤销入库
export function reWarehousing(data) {
  return request({
    url: '/mes/pro/feedback/reWareHousing',
    method: 'post',
    data: data,
  });
}

export function updateMergeStatus(id) {
  return request({
    url: '/mes/pro/feedback/updateMergeStatus?id=' + id,
    method: 'put',
  });
}



export function initCertificate(ids) {
  return request({
    url: '/mes/pro/feedback/initCertificate?ids=' + ids,
    method: 'get',
  });
}
