<template v-loading="loading">
  <el-table
    ref="caseTable"
    :data="planeData"
    border
    style="width: 100%;"
    :span-method="arraySpanMethod"
    size="mini">
    <div v-for="(list,lIndex) in headData" :key="lIndex">
      <template v-if="isEdit&&list.name==='check'">
        <el-table-column align="center" label="选择">
          <template slot-scope="scope">
            <el-checkbox
              label=""
              name="type"
              v-if="isEdit && scope.row.operationUser"
              v-model="scope.row.userChecked"
              @change="handleCheckUser(scope.row)">
            </el-checkbox>
            <span v-else></span>
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='查看详情'">
        <el-table-column align="center" :label="list.name" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail">查看</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='操作'">
        <el-table-column align="center" :label="list.name" width="100">
          <template slot-scope="scope">
            <el-checkbox
              label=""
              name="type"
              v-if="isEdit && scope.row.operationClsleve2s"
              v-model="scope.row.checked"
              @change="handleCheckClsleve2(scope.row, lIndex)">
            </el-checkbox>
            <span v-else></span>
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='状态'">
        <el-table-column align="center" :label="list.name" width="80">
          <template slot-scope="scope">
            {{scope.row.clsleve2sStatus | statusFilterPlus}}
            <!--收货列表中的状态为clsleve2sStatus 其余复用该表格为查看状态显示问题可查看此处-->
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='品牌'">
        <el-table-column align="center" :label="list.name" width="80">
          <template slot-scope="scope">
            {{scope.row.brand|brandFilter}}
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='品类'">
        <el-table-column align="center" :label="list.name" width="80">
          <template slot-scope="scope">
            {{scope.row.category|categoryFilter}}
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='二级品类是否齐套' || list.name ==='发货是否齐套'">
        <el-table-column align="center" :label="list.name" width="150">
          <template slot-scope="scope">
            {{scope.row.sendCompleted|secondaryCategoryFilter}}
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='品类'">
        <el-table-column align="center" :label="list.name" width="80">
          <template slot-scope="scope">
            {{scope.row.category|categoryFilter}}
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='本次发货'">
        <el-table-column align="center" :label="list.name" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.clsleve3s.length}}</span>
          </template>
        </el-table-column>
      </template>
      <!--<template v-else-if="list.name ==='已收数量'">-->
      <!--<el-table-column align="center" :label="list.name" width="100">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</template>-->
      <template v-else-if="['本次收货', '订单数量'].includes(list.name)">
        <el-table-column align="center" :label="list.name" width="100">
          <template slot-scope="scope">
            <el-popover
              width="800"
              trigger="click">
              <el-table
                :data="scope.row.clsleve3s"
                border
                size="mini">
                <div v-for="(twoList,tIndex) in twoHeadData" :key="tIndex">
                  <template v-if="isEdit&&twoList.name==='check'">
                    <el-table-column label="选择" width="50">
                      <template slot-scope="scope2">
                        <el-checkbox
                          label=""
                          name="type"
                          v-if="isEdit && scope2.row.status === '10'"
                          @change="handleCheckClsleve3(scope2.row,scope.row)"
                          v-model="scope2.row.checked">
                        </el-checkbox>
                        <span v-else></span>
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else-if="twoList.name ==='例放'">
                    <el-table-column align="center" :label="twoList.name" width="60">
                      <template slot-scope="scope">
                        {{scope.row.caseFlag|exampleReleaseFilter}}
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else-if="twoList.name ==='状态'">
                    <el-table-column align="center" :label="twoList.name" width="60">
                      <template slot-scope="scope">
                        {{scope.row.status | statusFilterPlus}}
                      </template>
                    </el-table-column>
                  </template>

                  <el-table-column
                    :prop="twoList.value"
                    align="center"
                    :label="twoList.name"
                    v-else-if="twoList.name!=='check'">
                  </el-table-column>
                </div>
              </el-table>
              <el-button type="text" slot="reference" v-text="scope.row.haveReceipt ? scope.row.haveReceipt : scope.row.quantityOfReceipt"></el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='已收货'">
        <el-table-column align="center" :label="list.name" width="100">
          <template slot-scope="scope">
            <el-popover
              width="800"
              trigger="click">
              <el-table
                :data="scope.row.clsleve3s"
                border
                size="mini">
                <div v-for="(twoList,tIndex) in twoHeadData" :key="tIndex">
                  <template v-if="isEdit&&twoList.name==='check'">
                    <el-table-column label="选择" width="50">
                      <template slot-scope="scope2">
                        <el-checkbox
                          label=""
                          name="type"
                          v-if="isEdit && scope2.row.status === '10'"
                          @change="handleCheckClsleve3(scope2.row,scope.row)"
                          v-model="scope2.row.checked">
                        </el-checkbox>
                        <span v-else></span>
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else-if="twoList.name ==='例放'">
                    <el-table-column align="center" :label="twoList.name" width="60">
                      <template slot-scope="scope">
                        {{scope.row.caseFlag|exampleReleaseFilter}}
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else-if="twoList.name ==='状态'">
                    <el-table-column align="center" :label="twoList.name" width="60">
                      <template slot-scope="scope">
                        {{scope.row.status| statusFilterPlus}}
                      </template>
                    </el-table-column>
                  </template>

                  <el-table-column
                    :prop="twoList.value"
                    align="center"
                    :label="twoList.name"
                    v-else-if="twoList.name!=='check'">
                  </el-table-column>
                </div>
              </el-table>
              <el-button type="text" slot="reference">{{scope.row.haveReceipt}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='存放库位'">
        <el-table-column align="center" :label="list.name" width="200">
          <template slot-scope="scope">
            <el-autocomplete
              placeholder="请输入存放库位"
              size="mini"
              v-model="scope.row.clsleve2StockPosition"
              :fetch-suggestions="querySearch"
              :max-height="50"
              @focus="getCellRow(scope.row)"
              @select="modifyTheLibraryBit(scope.row,'select')"
              @blur="modifyTheLibraryBit(scope.row,'blur')"></el-autocomplete>
            <!--<span v-if="!isEdit">{{scope.row.clsleve2StockPosition}}</span>-->
          </template>
        </el-table-column>
      </template>
      <template v-else-if="list.name ==='工厂合同自编号'">
        <el-table-column align="center" :label="list.name" width="200">
          <template slot-scope="scope">
            {{scope.row[list.value]}}
          </template>
        </el-table-column>
      </template>
      <el-table-column
        :prop="list.value"
        align="center"
        :label="list.name"
        v-else-if="list.name!=='check'"
      />
    </div>
  </el-table>
</template>

<script>
/**
   tableData 表格数据
   type:Array
   说明:目前接受树结构以及平面结构数据

   tableHead 表头数据
   type Array
   说明:组件会根据传入的表头生成表格数据。不区分顺序

   type 表类型
   type Boolean
   说明: 区分是信息全量表还是送货安装表

   twoHeadData 二级表头数据
   type Array
   说明:组件会根据传入的表头生成表格数据。不区分顺序

   isCheck
   type: Boolean
   说明:是否可选择
   *
   * */

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import storage from '@/utils/storage'
import {
  statusFilter,
  brandFilter,
  categoryFilter,
  completeFilter,
  secondaryCategoryFilter,
  exampleReleaseFilter,
  statusFilterPlus
} from '@/utils/filter'

const receiveListPort = namespace('delivery-installation/receiveListPort')

@Component({
  filters: {
    statusFilter,
    brandFilter,
    categoryFilter,
    completeFilter,
    secondaryCategoryFilter,
    exampleReleaseFilter,
    statusFilterPlus
  }
})
export default class OrderTable extends Vue {
    // 列表数据
    @Prop({
      type: Array,
      default: function () {
        return []
      }
    }) tableData
    // 列表类型
    @Prop({ type: String, default: 'all' }) type
    // 列表表头
    @Prop({
      type: Array,
      default: function () {
        return []
      }
    }) tableHead
    // 二级列表表头
    @Prop({
      type: Array,
      default: function () {
        return []
      }
    }) twoTableHead
    // 是否可选择
    @Prop({ type: Boolean, default: false }) isCheck

    loading = false
    headData = [] // 头部数据
    planeData = [] // 平铺数据
    isRowspanData = {} // 是否跨行
    storeData = []
    userId = ''

    // 修改库位
    @receiveListPort.Action updateStockPosition

    // 用户存放库位
    @receiveListPort.Action getStockPositionList

    // 处理跨行跨列
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let name = column.label
      if (!this.isRowspanData[name] && column.label !== '选择') {
        return false
      }
      if (row.rowIndex === 1) {
        return {
          rowspan: row.rowspan,
          colspan: row.colspan
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }

    // 处理表头数据
    handleHead (headArr, arr) {
      headArr.forEach((list, index) => {
        this.isRowspanData[list.name] = list.isRowspan
        if (index === headArr.length - 1) {
          arr.unshift(list)
        } else {
          arr.push(list)
        }
      })
      return arr
    }

    // 展开数据结构
    unfoldData (arrData) {
      let data = []

      arrData.forEach(list => {
        let haveReceiptOrder = 0
        if (list.clsleve2s && list.clsleve2s.length) {
          list.clsleve2s.forEach(list2 => {
            if (list2.clsleve3s && list2.clsleve3s.length) {
              list2.clsleve3s.forEach(list3 => {
                if (list3.status >= 30) {
                  list3.clsleve2sId = list2.id
                  haveReceiptOrder += 1
                }
              })
            }
          })
        }
        list.haveReceiptOrder = haveReceiptOrder
      })

      let isEdit = false
      arrData.forEach((list, lindex) => {
        if (list.clsleve2s && list.clsleve2s.length) {
          let operationUser = false
          list.clsleve2s.forEach((item, index) => {
            let operationClsleve2s = false
            item.quantityOfReceipt = 0
            if (item.clsleve3s && item.clsleve3s.length) {
              item.haveReceipt = 0
              item.clsleve3s = item.clsleve3s.map(item3 => {
                item3.checked = false
                if (item3.status === '10') {
                  operationUser = true
                  operationClsleve2s = true
                  isEdit = true
                  item3.checked = true
                  item.quantityOfReceipt += 1
                } else if (item3.status >= 30) {
                  item.haveReceipt += 1
                }
                return {
                  ...item3
                }
              })
            }
            data.push({
              customerName: list.customerName, // 客户名称
              id: list.id, // 客户id
              stockQuantity: list.stockQuantity,
              userStockPosition: list.stockPosition,
              haveReceiptOrder: list.haveReceiptOrder, // 已收货总数
              quantityOfReceipt: item.quantityOfReceipt || item.haveReceipt, // 选中收货数量
              haveReceipt: item.haveReceipt, // 已收货数量
              brand: item.brand,
              category: item.category,
              clsleve2Code: item.clsleve2Code,
              clsleve2Name: item.clsleve2Name,
              factoryContractNo: item.factoryContractNo,
              clsleve2sId: item.id,
              receiveCompleted: item.receiveCompleted,
              sendCompleted: item.sendCompleted,
              sendQuantity: item.sendQuantity,
              clsleve2sStatus: item.status,
              stockPosition: item.stockPosition,
              clsleve2StockPosition: item.stockPosition,
              clsleve3s: item.clsleve3s,
              userChecked: true,
              checked: true,
              operationClsleve2s: operationClsleve2s, // 二级品类
              rowspan: list.clsleve2s.length,
              colspan: 1,
              rowIndex: index + 1
            })
          })
          data.forEach(dlist => {
            if (dlist.id === list.id) {
              dlist.operationUser = operationUser
            }
          })
          // data[lindex].operationUser = operationUser
        }
        this.isEdit = isEdit
      })
      return data
    }
    // 库位聚焦时获取客户库位
    getCellRow (row) {
      this.getStockPositionList({ id: row.id }).then(success => {
        success = JSON.parse(JSON.stringify(success))
        console.log('获取用户库位success', success)
        this.storeData = []
        if (success.data.length) {
          success.data.forEach(item => {
            if (item) {
              this.storeData.push({ value: item })
            }
          })
        }
      }).catch(err => {
        console.log('获取用户库位error', err)
      })
    }
    // 页面搜索缓存库位
    querySearch (queryString, cb) {
      if (queryString === null || !queryString) {
        queryString = ''
      }
      queryString = queryString.replace(/\s+/g, '')
      let restaurants = []
      if (queryString === '') {
        restaurants = this.storeData
      } else {
        restaurants = this.storeListArr
      }
      // if(restaurants.length){
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
      // }
    }

    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString) !== -1)
      }
    }

    // 选择或取消用户
    handleCheckUser (row) {
      this.planeData.forEach(list => {
        if (list.id === row.id) {
          // 改变订单选择项
          list.checked = row.userChecked
          if (list.clsleve3s.length) {
            list.quantityOfReceipt = 0
            list.clsleve3s.forEach((item3, index3) => {
              // 改变三级品类选择项
              if (item3.status === '10') {
                item3.checked = row.userChecked
                if (item3.checked) {
                  // 计算已收数量
                  list.quantityOfReceipt += 1
                }
              }
            })
          }
        }
      })
    }

    // 选择或取消二级品类
    handleCheckClsleve2 (row, lIndex) {
      if (row.clsleve3s.length) {
        row.quantityOfReceipt = 0
        row.clsleve3s.forEach(item => {
          // 改变三级品类选择项
          item.checked = row.checked
          if (item.checked) {
            row.quantityOfReceipt += 1
          }
        })
      }
      let orderArr = this.planeData.filter(list => {
        return list.id === row.id
      })
      orderArr.forEach(list => {
        list.userChecked = orderArr.some(item => {
          return item.checked === true
        })
      })
    }

    // 选择或取消三级品类
    handleCheckClsleve3 (row, order) {
      order.checked = order.clsleve3s.some(list => {
        return list.checked === true
      })

      if (order.clsleve3s.length) {
        order.quantityOfReceipt = 0
        order.clsleve3s.forEach(item => {
          if (item.checked) {
            order.quantityOfReceipt += 1
          }
        })
      }

      let orderArr = this.planeData.filter(list => {
        return list.id === order.id
      })
      orderArr.forEach(list => {
        list.userChecked = orderArr.some(item => {
          return item.checked === true
        })
      })
    }

    // 跳转到订单详情页面
    toDetail () {
      this.$router.push({
        path: 'view-by-order'
      })
    }

    // 修改库位
    modifyTheLibraryBit (row, type) {
      // console.log(type)
      // // console.log('row.stockPosition', row.stockPosition,'row.clsleve2StockPosition',row.clsleve2StockPosition)
      if (row.stockPosition === row.clsleve2StockPosition && type === 'blur') {
        return
      }
      if (this.$route.name === 'view-by-order') {
        this.loading = true
        this.updateStockPosition({
          id: row.clsleve2sId,
          stockPosition: row.clsleve2StockPosition
        }).then(res => {
          this.loading = false
          console.log('修改库位res', res)
          if (res.status && res.code === '200') {
            this.$message.success('修改库位成功')
            this.$emit('initData', '')
          }
        }).catch(error => {
          this.loading = false
          console.log('修改库位error', error)
        })
      }
    }

    // 返回列表数据 带有checked标记
    getCheckedData () {
      return this.planeData
    }

    @Watch('tableData')
    watchTableData (newVal, oldVal) {
      this.planeData = this.unfoldData(newVal)
    }

    get storeListArr () {
      let ListArr = []
      let arr = JSON.parse(storage.getItem('userStoreList')) || []
      if (arr.length) {
        arr.forEach((item) => {
          let obj = {}
          obj.value = item.store
          ListArr.push(obj)
        })
      }
      return ListArr
    }

    created () {
      // 处理表头数据
      this.headData = this.handleHead(this.tableHead, [{ name: 'check', value: '' }])
      this.twoHeadData = this.handleHead(this.twoTableHead, [{ name: 'check', value: '' }])
      // 处理数据
      this.planeData = this.unfoldData(this.tableData)
      this.isEdit = this.isCheck
    }
}
</script>

<style scoped lang="scss">
  .bagDetailBtn {
    color: #F08519;
  }

  .bagDetailBtn:hover {
    cursor: pointer;
    opacity: 0.5;
  }
</style>
