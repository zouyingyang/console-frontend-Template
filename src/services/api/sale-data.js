import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

// 根据资料明细审核id查询历史审核记录
export const getAuditHistoryByCondition = ajax().get('mtdssales-collection/collection/auditHistory/getAuditHistoryByCondition')

// 促销活动展示列表
export const getActivityList = ajax().get('mtdssales-collection/collection/activity/view')
// 促销活动创建
export const createActivity = ajax().post('mtdssales-collection/collection/activity/create')

// 查询促销活动下的资料审核记录(单次填报)
export const getSingleAuditDetailByCondition = ajax().get('mtdssales-collection/collection/auditDetail/getSingleAuditDetailByCondition')

// 根据审核明细id查看审核详情(多次填报)
export const getMultipleAuditDetailByCondition = ajax().get('mtdssales-collection/collection/auditDetail/getMultipleAuditDetailByCondition')

// 审核填报资料(单次填报)
export const auditSingleAuditDetail = ajax().post('mtdssales-collection/collection/auditDetail/auditSingleAuditDetail')

// 根据审核明细id查看审核详情(多次填报)
export const auditMultipleAuditDetail = ajax().post('mtdssales-collection/collection/auditDetail/auditMultipleAuditDetail')

// 启用或者禁用活动状态
export const editStatus = ajax().post('mtdssales-collection/collection/activity/editStatus')

// 编辑促销活动数据
export const editActivity = ajax().post('mtdssales-collection/collection/activity/edit')

// 促销活动上传资料明细导出Excel
export const exportActivity = ajax().get('mtdssales-collection/collection/activity/exportActivity')

// 获取登录用户的部门品牌品类
export const findBrandCategory = ajax().get('mtdssales-collection/collection/activity/findBrandCategory')

// 获取半年内的促销活动
export const findActivityName = ajax().get('mtdssales-collection/collection/activity/findActivityName')

// 获取已提交门店列表
export const findSubmitActivity = ajax().post('mtdssales-collection/collection/activity/findSubmitActivity')

// 获取未提交门店列表
export const findNoSubmitActivity = ajax().post('mtdssales-collection/collection/activity/findNoSubmitActivity')
