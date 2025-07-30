import request from '@/utils/request'

// 创建报工审批明细
export function createFeedbackAuditDetail(data) {
  return request({
    url: '/mes/pro/feedback-audit-detail/create',
    method: 'post',
    data: data
  })
}

// 更新报工审批明细
export function updateFeedbackAuditDetail(data) {
  return request({
    url: '/mes/pro/feedback-audit-detail/update',
    method: 'put',
    data: data
  })
}

// 删除报工审批明细
export function deleteFeedbackAuditDetail(id) {
  return request({
    url: '/mes/pro/feedback-audit-detail/delete?id=' + id,
    method: 'delete'
  })
}

// 获得报工审批明细
export function getFeedbackAuditDetail(id) {
  return request({
    url: '/mes/pro/feedback-audit-detail/get?id=' + id,
    method: 'get'
  })
}

// 获得报工审批明细分页
export function getFeedbackAuditDetailPage(query) {
  return request({
    url: '/mes/pro/feedback-audit-detail/page',
    method: 'get',
    params: query
  })
}

// 导出报工审批明细 Excel
export function exportFeedbackAuditDetailExcel(query) {
  return request({
    url: '/mes/pro/feedback-audit-detail/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 基于审批单头与汇总Id获取详情信息
export function getAuditDetails(query) {
  return request({
    url: '/mes/pro/feedback-audit-detail/getAuditDetails',
    method: 'get',
    params: query,
  })
}
