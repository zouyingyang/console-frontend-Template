/**
 * Created by Shijiuwei.
 * User: romantic.stone@gmail.com
 * Date: 2018/9/8
 * Time: 17:42
 * 转换数据结构，处理数据
 */

class HandlerData {
  /**
   * 将扁平的一维数组数据转为树形结构
   * @param data 数组对象
   * @param id
   * @param pid
   */
  toTree (data, id, pid) {
    const treeList = data.slice(0)
    const formartFun = (ys, json) => {
      let len = json.length
      while (len > 0) {
        len--
        let oo = json[len]
        if (ys[id] === oo[pid]) {
          ys.children = ys.children || []
          ys.children.push(oo)
          json.splice(len, 1)
        }
      }
    }
    for (let item of data) {
      formartFun(item, treeList)
    }
    return treeList[0].children
  }

  /**
   * 将数据排序
   * @param data
   */
  sortTree (data) {
    return data.sort((a, b) => {
      return b.sort - a.sort
    })
  }

  /**
   * 设置按钮级权限
   * @param data
   */
  authority (data) {
    return data.filter(i => {
      return i.permission
    }).map(j => {
      return j.permission
    })
  }
}
export default HandlerData
