/**
 * Created by Zyy.
 * User: zouyingyang@qq.com
 * Date: 2019/4/18
 * Time: 11:23
 * Desc:
 */

export default (to, from, next) => {
  let target
  let crumbsList = sessionStorage.getItem('crumbsList') || '[]'
  let newTo = {
    path: to.path,
    fullPath: to.fullPath,
    meta: to.meta,
    name: to.name,
    query: to.query
  }
  const isAddCrumbs = (newTo) => {
    let blacklist = ['analysis', '403', '404', '500', 'dashboard/blank']
    return blacklist.join(',').indexOf(newTo.name) === -1
  }
  let isExistence = false
  crumbsList = JSON.parse(crumbsList)
  crumbsList.forEach((list, index) => {
    if (newTo.name === list.name) {
      isExistence = true
      crumbsList[index] = newTo
    }
  })
  isAddCrumbs(newTo) && !isExistence && crumbsList.push(newTo)
  if (crumbsList.length > 8) {
    crumbsList = crumbsList.slice(1)
  }
  sessionStorage.setItem('crumbsList', JSON.stringify(crumbsList))
  next(target)
}
