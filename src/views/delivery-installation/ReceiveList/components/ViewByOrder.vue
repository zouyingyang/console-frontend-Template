<template>
  <div class="my-case-index">
    <Card v-loading="loading">
      <OrderTable
        :tableHead="tableHead"
        :tableData="tableData"
        :twoTableHead="twoTableHead"
        slot="content"
        @initData="initData"
        :isCheck="false">
      </OrderTable>

    </Card>
  </div>
</template>

<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import OrderTable from './OrderTable.vue'
import Card from '@/components/Card'
const receiveListPort = namespace('delivery-installation/receiveListPort')

  @Component({
    components: { OrderTable, Card }
  })
export default class ViewByOrder extends Vue {
    loading = false
    orderNum = ''
    storeData = []
    orderReceipt = {
      search: '',
      warehouseValue: '5',
      warehouse: [{ // 仓库选项
        value: '1',
        label: 'A'
      }, {
        value: '2',
        label: 'B'
      }, {
        value: '3',
        label: 'C'
      }, {
        value: '4',
        label: 'D'
      }, {
        value: '5',
        label: '其他'
      }]
    }
    tableData = [] // 列表数据
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
      { name: '已收货', value: 'a6' },
      { name: '存放库位', value: 'stockPosition' }
    ]
    twoTableHead = [
      { name: '三级品类', value: 'clsleve3Name' },
      { name: '包条码', value: 'barCode' },
      { name: '例放', value: 'caseFlag' },
      { name: '包序号', value: 'packageNo' },
      { name: '状态', value: 'status' }
    ]

    // 按订单签收列表（订单详情）
    @receiveListPort.Action takeDeliveryByOrder

    // 初始化数据
    initData () {
      this.loading = true
      this.takeDeliveryByOrder({ 'deliveryNo': this.deliveryNo }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        console.log('获取订单签收列表res', res)
        if (res.status && res.code === '200') {
          this.tableData = res.data
        }
      }).catch(error => {
        console.log('获取订单签收列表error', error)
      })
    }

    created () {
      this.deliveryNo = this.$route.query.deliveryNo
      this.initData()
    }
  }
</script>

<style lang="scss">
  .el-input--mini .el-input__inner {
    max-width: 200px !important;
  }
</style>
