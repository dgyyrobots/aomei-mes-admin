import request from '@/utils/request'

// 创建报工审批主表
export function createFeedbackAudit(data) {
  return request({
    url: '/mes/pro/feedback-audit/create',
    method: 'post',
    data: data
  })
}

// 更新报工审批主表
export function updateFeedbackAudit(data) {
  return request({
    url: '/mes/pro/feedback-audit/update',
    method: 'put',
    data: data
  })
}

// 删除报工审批主表
export function deleteFeedbackAudit(id) {
  return request({
    url: '/mes/pro/feedback-audit/delete?id=' + id,
    method: 'delete'
  })
}

// 获得报工审批主表
export function getFeedbackAudit(id) {
  return request({
    url: '/mes/pro/feedback-audit/get?id=' + id,
    method: 'get'
  })
}

// 获得报工审批主表分页
export function getFeedbackAuditPage(query) {
  return request({
    url: '/mes/pro/feedback-audit/page',
    method: 'get',
    params: query
  })
}

// 导出报工审批主表 Excel
export function exportFeedbackAuditExcel(query) {
  return request({
    url: '/mes/pro/feedback-audit/export-excel',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}


export function auditFeedback(data) {
  return request({
    url: '/mes/pro/feedback-audit/auditFeedback',
    method: 'post',
    data: data
  });
}

export function executes(data) {
  return request({
    url: `/mes/pro/feedback-audit/update-feedbackAudit-status`,
    method: 'put',
    params: {
      id: data.id,
      status: data.status
    }
  });
}

