/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/29
 * Time: 09:12
 * Desc:
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)
// 获取用户信息
export const currentUser = ajax().get('/aaa')
// 获取用户权限信息
export const userMenuList = ajax().get('/bbb')
// 退出登录
export const setUserLogout = ajax().get('/ccc')
