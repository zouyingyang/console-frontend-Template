/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2018/9/29
 * Time: 09:12
 * Desc:
 */

import Ajax from '../convertors/ajax-config'

const ajax = config => new Ajax(config)

export const user = ajax().post('/login')
// 获取用户信息
export const currentUser = ajax().get('/ucenterapi/uc/internal/common/getCurrentUser')
// 获取用户权限信息
export const userMenuList = ajax().get('/ucenterapi/uc/internal/common/getUserMenuListByUserId')
// 退出登录
// todo 认证中心改造
export const setUserLogout = ajax().get('/oauth/logout')
