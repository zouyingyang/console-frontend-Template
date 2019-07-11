/**
 * 用户表单输入校验
 */

// 是否为国内手机号码
export const isPhone = value => {
  const reg = /^1[3|4|5|7|8][0-9]{9}$/
  return reg.test(value)
}

// 邮箱校验
export const isEmail = value => {
  var reg = /^[\w.-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
  return reg.test(value)
}
