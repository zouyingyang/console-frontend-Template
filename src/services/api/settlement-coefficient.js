/**
 * Created by lijianyi.
 * User: kinyee@163.com
 * Date: 2018/12/19
 * Time: 15:12
 * 商场结算系数接口
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

// 批量删除规则
export const batchDeleteRuleByIds = ajax().get('/usercenter-api/ruleCoefficient/batchDeleteRuleByIds')

// 新增结算系数规则
export const saveRule = ajax().post('/usercenter-api/ruleCoefficient/saveRule')

// 查看系数规则详情
export const getRuleById = ajax().get('/usercenter-api/ruleCoefficient/getRuleById')

// 根据品牌品类搜索名获取商场列表
export const getMarketByBrandCategory = ajax().get('/usercenter-api/market/getMarketByBrandCategoryKeyword')

// 根据规则名称查询
export const searchByRuleName = ajax().get('/usercenter-api/ruleCoefficient/searchByRuleName')

// 编辑规则
export const editRule = ajax().post('/usercenter-api/ruleCoefficient/editRule')

// 根据字典编码获取下级字典列表
export const getDictionaryCacheListByCode = ajax().get('/cases/kn/dictionaryCache/getDictionaryCacheListByCode')
