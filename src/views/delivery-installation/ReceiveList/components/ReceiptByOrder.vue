<template>
  <div class="my-receipt-by-order">
    <Card v-loading="loading" >
      <el-col :span="24" slot="head">
        <el-form :model="params" :inline="true" class="el-right op-text-right" @submit.native.prevent>
          <span class="span-label op-left">批量维护库位</span>
          <el-form-item class="no-margin-bottom op-left">
            <el-autocomplete
              size="mini"
              v-model="stockPosition"
              :fetch-suggestions="querySearch"
              :max-height="50"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item class="op-left">
            <el-button size="mini" type="primary" @click="bulkCollection">批量签收
            </el-button>
          </el-form-item>

          <el-form-item class="no-margin-bottom">
            <el-tooltip class="item" effect="dark" content="客户名称、包条码、工厂合同自编号" placement="top">
              <el-input
                size="mini"
                clearable
                @keyup.enter.native="initData"
                maxlength="100"
                placeholder="客户名称、包条码、工厂合同自编号"
                v-model="params.searchKeyword">
              </el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item style="margin-right: 0" class="no-margin-bottom">
            <el-button size="mini" type="primary" @click="initData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <OrderTable
      :tableHead="tableHead"
      :tableData="tableData"
      :twoTableHead="twoTableHead"
      slot="content"
      ref="orderTable"
      @initData="initData"
      :isCheck="true">
    </OrderTable>
    </Card>

    <!--批量收货-->
    <el-dialog
      title="确认收货"
      :visible.sync="isShowBulkCollection"
      :close-on-click-modal="false"
      width="30%"
      v-loading="oneLoading"
      center>
      <p>请确认是否收货<span class="red">{{pieces}}件</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowBulkCollection = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitBulkCollection" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { Vue, Component } from 'vue-property-decorator'
import storage from '@/utils/storage'
import { namespace } from 'vuex-class'
import OrderTable from './OrderTable'
import Card from '@/components/Card'
const receiveListPort = namespace('delivery-installation/receiveListPort')

  @Component({
    components: { OrderTable, Card }
  })
export default class ReceiptByOrder extends Vue {
    loading = false
    oneLoading = false // 一层弹窗
    params = {
      deliveryNo: '', // 货运清单号
      searchKeyword: '' // 搜索字段 客户姓名 包条码工厂合同自编号
    }
    stockPosition = '' // 库位
    // 是否显示批量收货弹窗
    isShowBulkCollection = false
    pieces = 0
    tableData = []
    storeData = []
    tableHead = [
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '已收数量', value: 'haveReceiptOrder', isRowspan: true },
      { name: '已放库位', value: 'userStockPosition', isRowspan: true },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '发货是否齐套', value: 'sendCompleted' },
      { name: '状态', value: 'status' },
      { name: '本次发货', value: 'sendQuantity' },
      { name: '本次收货', value: 'a6' },
      { name: '存放库位', value: 'stockPosition' }
    ]
    twoTableHead = [
      { name: '三级品类', value: 'clsleve3Name' },
      { name: '包条码', value: 'barCode' },
      { name: '例放', value: 'caseFlag' },
      { name: '包序号', value: 'packageNo' },
      { name: '状态', value: 'status' }
    ]
    bathDeliveryData = []

    // 按订单签收列表（订单详情）
    @receiveListPort.Action takeDeliveryByOrder

    // 批量收货
    @receiveListPort.Action bathDeliveryByCar

    // 初始化数据
    initData () {
      this.loading = true
      this.takeDeliveryByOrder(this.params).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        console.log('获取订单签收列表res', res)
        if (res.status && res.code === '200') {
          this.tableData = res.data
        }
      }).catch(error => {
        this.total = 0
        console.log('获取订单签收列表error', error)
      })
    }
    // 页面搜索缓存库位
    querySearch (queryString, cb) {
      let restaurants = this.storeListArr
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    }
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString) !== -1)
      }
    }

    // 点击搜索按钮搜索
    orderReceiptSearch () {
      this.initData()
    }

    // 重置参数
    reset () {
      this.params = {
        search: '',
        warehouseValue: '5',
        warehouse: ''
      }
    }

    // 点击批量收货显示弹窗
    bulkCollection () {
      this.pieces = 0
      this.bathDeliveryData = []
      this.$refs.orderTable.getCheckedData().forEach(list => {
        this.bathDeliveryData.push(list)
        if (list.clsleve3s && list.clsleve3s.length) {
          list.clsleve3s.forEach(clsleve3sList => {
            if (clsleve3sList.checked) {
              this.pieces += 1
            }
          })
        }
      })
      console.log('this.bathDeliveryData', this.bathDeliveryData)
      if (!this.pieces) {
        this.$message.warning('您还没有选择订单')
        return false
      }
      this.isShowBulkCollection = true
    }
    // 确认批量收货
    submitBulkCollection () {
      let data = [{
        orders: [{
          leve2: []
        }]
      }]
      this.stockPosition = this.stockPosition.replace(/\s+/g, '')
      if (this.stockPosition === '') {
        this.bathDeliveryData.forEach(list => {
          data[0].orders[0].leve2.push({
            id: list.id,
            stockPosition: list.clsleve2StockPosition,
            leve3: list.clsleve3s ? list.clsleve3s.map(j => {
              return {
                barCode: j.barCode,
                caseFlag: j.caseFlag,
                clsleve3Code: j.clsleve3Code,
                clsleve3Name: j.clsleve3Name,
                id: j.id,
                packageNo: j.packageNo,
                checked: j.checked ? '1' : '0'
              }
            }) : []
          })
        })
      } else {
        this.bathDeliveryData.forEach(list => {
          data[0].orders[0].leve2.push({
            id: list.id,
            stockPosition: this.stockPosition,
            leve3: list.clsleve3s ? list.clsleve3s.map(j => {
              return {
                barCode: j.barCode,
                caseFlag: j.caseFlag,
                clsleve3Code: j.clsleve3Code,
                clsleve3Name: j.clsleve3Name,
                id: j.id,
                packageNo: j.packageNo,
                checked: j.checked ? '1' : '0'
              }
            }) : []
          })
        })
      }
      this.oneLoading = true
      this.bathDeliveryByCar({
        data: data,
        deliveryNo: this.params.deliveryNo
      }).then(res => {
        this.oneLoading = false
        this.isShowBulkCollection = false
        console.log('批量收货res', res)
        if (res.status && res.code === '200') {
          this.$message.success('批量收货成功')
          this.$router.push({
            name: 'view-by-order',
            query: {
              deliveryNo: this.params.deliveryNo
            }
          })
        }
      }).catch(error => {
        this.oneLoading = false
        // this.$message.error('批量收货失败')
        console.log('批量收货error', error)
      })
    }
    // 获取用户库位
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
      this.params.deliveryNo = this.$route.query.deliveryNo
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  .my-receipt-by-order{
    .el-input--mini .el-input__inner {
      max-width: 200px !important;
    }
    .el-dialog {
      h3 {
        text-align: center;
        font-size: 20px;
      }
      p {
        text-align: center;
        font-size: 16px;
        .red {
          color: red;
        }
      }
      .el-input {
        width: 180px;
      }
      .el-form-item__label {
        /*width: 34%;*/
        line-height: 30px;
      }
    }
    .card__head{
      padding-bottom: 0;
    }
    .el-form-item{
      margin-bottom: 0;
    }
    .span-label{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 30px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
