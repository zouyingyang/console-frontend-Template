/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/7
 * Time: 9:02
 * 物流送货安装接口
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

export const message = ajax().get('/message')
export const allChartsDate = ajax().get('/allChartsDate')
export const mapDate = ajax().get('/mapDate')
export const activity = ajax().post('/activity').format('form')
export const assets = ajax().post('/assets')
export const repository = ajax().post('/repository')

// 库位管理
export const addStore = ajax().post('mtdssales-delivery/delivery/salesDeliveryStore/addStore')
export const storeList = ajax().post('mtdssales-delivery/delivery/salesDeliveryStore/storeList')
export const updateStore = ajax().post('mtdssales-delivery/delivery/salesDeliveryStore/updateStore')
export const deleteStore = ajax().post('mtdssales-delivery/delivery/salesDeliveryStore/deleteStore')

// 标准品管理
export const addProduct = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/addProduct')
export const deleteProduct = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/deleteProduct')
export const updateProduct = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/updateProduct')
export const productList = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/productList')
export const importProductExcel = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/importProductExcel')
export const salesDeliveryProductList = ajax().post('mtdssales-delivery/delivery/salesDeliveryProduct/list')

// 关联商场
export const listMainMarket = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/listMainMarket')
export const addRelationMarket = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/addRelationMarket')
export const updateMarket = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/updateMarket')
export const delMainMarket = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/delMainMarket')
export const listAllMarket = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/listAllMarket')
export const getShopByOrgId = ajax().post('mtdssales-delivery/delivery/salesDeliveryRelation/getShopByOrgId')

// =====订单信息全量表start=====
// 获取订单信息全量表
export const getInfoList = ajax().post('mtdssales-delivery/delivery/full_info_api/list')
// 获取全量信息表二级品类
export const getAllLeve2list = ajax().post('mtdssales-delivery/delivery/clsleveapi/leve2list')
// 获取送货安装单二级品类
export const getInstallPlantClsleve2 = ajax().get('mtdssales-delivery/delivery/dispatch/getInstallPlantClsleve2')
// 获取三级品类
export const getInstallPlantClsleve3 = ajax().get('mtdssales-delivery/delivery/dispatch/getInstallPlantClsleve3')
// 送货安装列表增加客户跟踪、订单内容字段 接口
export const updateTrackingContent = ajax().get('mtdssales-delivery/delivery/full_info_api/updateTrackingContent')
// 客户跟踪 new
export const updateTracks = ajax().get('mtdssales-delivery/delivery/full_info_api/updateTracks')

// =====送货安装列表start=====
// 查询送货安装单列表
export const deliveryDispatch = ajax().post('mtdssales-delivery/delivery/dispatch/getInstallPlant')
// 批量完成出库
export const mulStockOut = ajax().get('mtdssales-delivery/delivery/dispatch/mulStockOut')
// 批量作废
export const mulCancel = ajax().get('mtdssales-delivery/delivery/dispatch/mulCancel')
// 批量修改送货计划
export const mulModifyDeliverPlanPort = ajax().post('mtdssales-delivery/delivery/dispatch/mulModifyDeliverPlan')
// 批量修改安装计划
export const mulModifyInstallPlanPort = ajax().post('mtdssales-delivery/delivery/dispatch/mulModifyInstallPlan')
// 获取送货安装工列表
export const deliveryInstallStaff = ajax().post('mtdssales-delivery/delivery/salesDeliveryInstallStaff/listDeliveryMan')
// 待确认送货安装清单查询接口
export const confirmedList = ajax().get('mtdssales-delivery/delivery/conflistapi/list')
// 待确认送货安装清单数量接口
export const countList = ajax().post('mtdssales-delivery/delivery/conflistapi/count')
// 打印送货安装单
export const printInstallList = ajax().post('mtdssales-delivery/delivery/dispatch/printInstallList')
// 获取司机列表信息
export const driverList = ajax().post('mtdssales-delivery/delivery/platNumManage/driverList')
// 获取车辆列表信息
export const plateNumList = ajax().post('mtdssales-delivery/delivery/platNumManage/plateNumList')
// 获取上一次配置的司机和车辆信息
export const getDriverAndPlatNum = ajax().post('mtdssales-delivery/delivery/conflistapi/getDriverAndPlatNum')
// 配置安装单保存司机和送货车辆信息
export const saveDriverAndPlateNum = ajax().get('mtdssales-delivery/delivery/conflistapi/saveDriverAndPlateNum')

// =====验收列表start=====
// 批量验收
export const mulAcceptance = ajax().post('mtdssales-delivery/delivery/acceptance/mulAcceptance')
// 根据服务单查看验收记录
export const acceptanceRecord = ajax().get('mtdssales-delivery/delivery/acceptance/acceptanceRecord')
// 完成验收
export const finishAcceptance = ajax().post('mtdssales-delivery/delivery/acceptance/finishAcceptance')

// =====收货列表start=====
// 获取收货列表
export const deliveryOrderList = ajax().get('mtdssales-delivery/delivery/signing/deliveryOrderList')
// 导出收货列表
export const bathDeliveryExport = ajax().post('mtdssales-delivery/delivery/signing/bathDeliveryExport')
// 按订单签收列表（订单详情）
export const takeDeliveryByOrder = ajax().get('mtdssales-delivery/delivery/signing/takeDeliveryByOrder')

// 查询用户的存放库位
export const getStockPositionList = ajax().get('mtdssales-delivery/delivery/signing/getStockPositionList')

// 查看订单详情
export const detailContent = ajax().get('/mtdssales-delivery/delivery/full_info_api/detail')
// 批量收货
export const bathDeliveryByCar = ajax().post('mtdssales-delivery/delivery/signing/bathDeliveryByCar')
// 修改库位
export const updateStockPosition = ajax().post('mtdssales-delivery/delivery/signing/updateStockPosition')
// 整车签收
export const takeDeliveryByCar = ajax().get('mtdssales-delivery/delivery/signing/takeDeliveryByCar')
// 整车返货
export const returnsByCar = ajax().post('mtdssales-delivery/delivery/signing/returnsByCar')
// 成品收货列表
export const deliveryStandardList = ajax().post('mtdssales-delivery/delivery/signing/deliveryStandardList')
// 成品签收
export const signingByStandard = ajax().post('mtdssales-delivery/delivery/signing/signingByStandard')

// =====订单调度列表start=====
// 待确认送货安装清单新增接口
export const conflistAdd = ajax().post('mtdssales-delivery/delivery/conflistapi/add')
// 生成安装单接口
export const createPlant = ajax().post('mtdssales-delivery/delivery/conflistapi/createPlant')
// 待确认送货安装清单删除接口
export const deleteRepertoire = ajax().get('mtdssales-delivery/delivery/conflistapi/delete')
// 待确认送货安装清单删除接口
export const newDeleteRepertoire = ajax().post('mtdssales-delivery/delivery/conflistapi/newDelete')

// =====返库列表start=====
// 批量返仓
export const mulReturnStock = ajax().post('mtdssales-delivery/delivery/dispatch/mulReturnStock')

// =====遗留单申请start=====
// 遗留单申请原因
export const getReasonList = ajax().post('mtdssales-delivery/delivery/leaveDeclare/app/reasonList')
// 提交遗留单
export const submitleaveDeclareInfo = ajax().post('mtdssales-delivery/delivery/leaveDeclare/app/submitleaveDeclareInfo')
// 遗留申报列表
export const leaveDeclareList = ajax().get('mtdssales-delivery/delivery/leaveDeclare/listLeaveOrder')
// 遗留申报详情
export const leaveDeclareDetail = ajax().get('mtdssales-delivery/delivery/leaveDeclare/app/detail')

// =====验收列表start=====
// 回访列表
export const returnVisitList = ajax().post('mtdssales-delivery/delivery/returnVisit/returnVisitList')
// 回访保存
export const saveReturnVisit = ajax().post('mtdssales-delivery/delivery/returnVisit/saveReturnVisit')
