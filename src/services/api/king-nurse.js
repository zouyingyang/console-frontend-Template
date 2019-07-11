/**
 * Created by lijianyi.
 * User: kinyee@163.com
 * Date: 2019/1/22
 * Time: 16:12
 * 橱柜-金保姆
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

// 获取组织人员架构树
export const getOrgChildNodes = ajax().get('/mtdssales-housekeeper/goldenHousekeeper/getOrgChildNodes')

// 根据条件获取金保姆列表
export const getGoldenHousekeeperList = ajax().get('/mtdssales-housekeeper/goldenHousekeeper/getGoldenHousekeeperList')

// 根根据用户id获取用户的信息
export const getUserById = ajax().get('/mtdssales-housekeeper/goldenHousekeeper/getUserById')

// 新增金保姆
export const saveGoldenHousekeeper = ajax().post('/mtdssales-housekeeper/goldenHousekeeper/saveGoldenHousekeeper')

// 修改金保姆人员
export const updateGoldenHousekeeper = ajax().post('/mtdssales-housekeeper/goldenHousekeeper/updateGoldenHousekeeper')

// 删除金保姆人员
export const deleteGoldenHousekeeper = ajax().post('/mtdssales-housekeeper/goldenHousekeeper/deleteGoldenHousekeeper')

// 获取导入模板url
export const getDownloadImportTemplate = ajax().get('/mtdssales-housekeeper/goldenHousekeeper/getDownloadImportTemplate')

// 根据条件导出金保姆列表
export const exportGoldenHousekeeperList = ajax().get('/mtdssales-housekeeper/goldenHousekeeper/exportGoldenHousekeeperList')

// 导入金保姆人员
export const importExcel = ajax().post('/mtdssales-housekeeper/goldenHousekeeper/importExcel')
