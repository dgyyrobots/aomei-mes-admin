import request from '@/utils/request'

// 创建报工审批汇总
export function createFeedbackAuditItem(data) {
  return request({
    url: '/mes/pro/feedback-audit-item/create',
    method: 'post',
    data: data
  })
}

// 更新报工审批汇总
export function updateFeedbackAuditItem(data) {
  return request({
    url: '/mes/pro/feedback-audit-item/update',
    method: 'put',
    data: data
  })
}

// 删除报工审批汇总
export function deleteFeedbackAuditItem(id) {
  return request({
    url: '/mes/pro/feedback-audit-item/delete?id=' + id,
    method: 'delete'
  })
}

// 获得报工审批汇总
export function getFeedbackAuditItem(id) {
  return request({
    url: '/mes/pro/feedback-audit-item/get?id=' + id,
    method: 'get'
  })
}

// 获得报工审批汇总分页
export function getFeedbackAuditItemPage(query) {
  return request({
    url: '/mes/pro/feedback-audit-item/page',
    method: 'get',
    params: query
  })
}

// 导出报工审批汇总 Excel
export function exportFeedbackAuditItemExcel(query) {
  return request({
    url: '/mes/pro/feedback-audit-item/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 基于审批单头获得报工审批汇总
export function getAuditSummary(id) {
  return request({
    url: '/mes/pro/feedback-audit-item/getAuditSummary?auditId=' + id,
    method: 'get'
  })
}
