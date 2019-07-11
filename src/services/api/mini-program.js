/*
 * @Author: laiyit
 * @Date: 2018-09-18 09:42:37
 * @Last Modified by: laiyiting
 * @Last Modified time: 2018-11-13 09:12:00
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)
// 广告
export const bannerList = ajax().get('/cases/kn/banner/findBannerPage') // 广告列表
export const bannerDetail = ajax().get('/cases/kn/banner/getOneById') // 广告详情
export const bannerUpdate = ajax().post('/cases/kn/banner/update') // 更新广告详情
export const bannerAdd = ajax().post('cases/kn/banner/add') // 增加广告详情
// export const activity = ajax().post('/activity').format('form')
// 文章
export const articleList = ajax().get('/cases/kn/info/findInfoPage') // 文章列表
export const articleAddDetail = ajax().post('/cases/kn/info/add') // 新增文章
export const articleDelete = ajax().get('/cases/kn/info/delete') // 删除文章
export const articleUpdateStatus = ajax().post('/cases/kn/info/updateStatus') // 文章上下架
export const articleDetail = ajax().get('/cases/kn/info/find') // 文章详情
export const articleUpdateDetail = ajax().post('/cases/kn/info/update') // 修改文章详情
// 服务单
export const getMyCaseList = ajax().get('/cases/kn/case/getMyCasePage') // 我的案例列表
export const getMyOrderList = ajax().get('/cases/kn/orderCase/findMyOrder') // 我的案例列表
export const updateOrderCases = ajax().post('/cases/kn/orderCase/updateOrderCases') // 根据服务单ID编辑多个案例
export const getOrderCaseList = ajax().get('/cases/kn/orderCase/getCasesListToOrder') // 根据服务单ID获取已关联案例
export const getOrderCaseListDetail = ajax().get('/cases/kn/orderCase/findOrderCasePageList') // 根据服务单ID获取案例列表
// 客户反馈
export const getFeekbackList = ajax().get('/mtdssales/program/customerFeedback/getCustomerFeedbackList') // 客户反馈列表
// 评价列表
export const getShopCommentList = ajax().get('/mtdssales/program/shopComment/getShopCommentList') // 评价列表
export const updateShopComment = ajax().post('/mtdssales/program/shopComment/updateShopComment') // 审批评价
