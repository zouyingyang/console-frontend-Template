<template>
  <div>
    <Card>
      <div id="printBox" slot="head">
        <div class="printHead">
          <div class="printLogo">欧派家居集团商场出库清单</div>
        </div>

        <table id="tableForm" border="1" style="margin-top: 10px">
          <tr>
            <td>出库单号</td>
            <td>{{tableInfo.no}}</td>
            <td>制单人</td>
            <td :colspan="3">{{tableInfo.createBy}}</td>
            <td>制单日期</td>
            <td :colspan="3">
              {{tableInfo.createTime | format("yyyy-MM-dd HH:mm")}}
            </td>
          </tr>
          <tr>
            <td>送货车辆</td>
            <td>{{tableInfo.plateNum}}</td>
            <td>送货责任人</td>
            <td>{{tableInfo.deliveryOwnerName}}</td>
            <td>送货协助人</td>
            <td>{{tableInfo.deliveryFacilitatorName}}</td>
            <td>预约送货日期</td>
            <td :colspan="3">
              {{tableInfo.plannedDeliveryTime | format("yyyy-MM-dd HH:mm")}}
            </td>
          </tr>
          <tr>
            <td>是否送装一体</td>
            <td>
              <span>{{tableInfo.deliveryInstallModel === '1' ? '是' : '否'}}</span>
            </td>
            <td>安装责任人</td>
            <td>{{tableInfo.installationOwnerName}}</td>
            <td>安装协助人</td>
            <td>{{tableInfo.installationFacilitatorName}}</td>
            <td>预约安装日期</td>
            <td :colspan="3">
              {{tableInfo.plannedInstallationTime | format("yyyy-MM-dd HH:mm")}}
            </td>
          </tr>
          <tr>
            <td>客户姓名</td>
            <td>{{tableInfo.customerName}}</td>
            <td>客户电话</td>
            <td :colspan="3">{{tableInfo.customerTel}}</td>
            <td>客户地址</td>
            <td :colspan="3">{{tableInfo.customerAddress}}</td>
          </tr>
          <tr style="background-color:#ccc ">
            <td>工厂合同自编号</td>
            <td>品牌</td>
            <td>品类</td>
            <td>待出库数/已出库数</td>
            <td>产品类别</td>
            <td>待出库数/已出库数</td>
            <td>存放库位</td>
            <td>三级品类</td>
            <td>包条码</td>
            <td>包编号</td>
          </tr>
          <tr v-for="(list,index) in planeData" :key="index">
            <td v-if="list.clsleve2Key===0 && list.orderVoRow" :rowspan="list.orderVoRow" v-text="list.factoryContractNo"></td>
            <td v-if="list.clsleve2Key===0 && list.orderVoRow" :rowspan="list.orderVoRow">
              {{list.brand | brandFilter}}
            </td>
            <td v-if="list.clsleve2Key===0 && list.orderVoRow" :rowspan="list.orderVoRow">
              {{list.category | categoryFilter}}
            </td>
            <td v-if="list.clsleve2Key===0 && list.orderVoRow" :rowspan="list.orderVoRow" v-text="list.quanlityDesc"></td>
            <td v-if="list.clsleve3Key===0" :rowspan="list.clsleve2Row" v-text="list.clsleve2Name"></td>
            <td v-if="list.clsleve3Key===0" :rowspan="list.clsleve2Row" v-text="list.clsleve2Quanlity"></td>
            <td v-if="list.clsleve3Key===0" :rowspan="list.clsleve2Row" v-text="list.storage"></td>
            <td v-text="list.clsleve3Name"></td>
            <td v-text="list.barCode"></td>
            <td v-text="list.packageNo"></td>
          </tr>
          <tr class="print-sign-box">
            <td class="print-sign-list op-text-right">仓管员</td>
            <td class="print-sign-list op-text-left">
               __________________________
            </td>
            <td class="print-sign-list op-text-right">送货员</td>
            <td class="print-sign-list op-text-left">
               __________________________
            </td>
            <td class="print-sign-list op-text-right">安装工</td>
            <td class="print-sign-list op-text-left">
               __________________________
            </td>
            <td class="print-sign-list op-text-right">客户</td>
            <td class="print-sign-list op-text-left">
               __________________________
            </td>
          </tr>
        </table>
      </div>
      <div class="op-text-center" slot="foot">
        <el-button @click="printInit" type="primary" size="mini">打印</el-button>
      </div>
    </Card>
  </div>
</template>
<script>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Card from '@/components/Card'
import printJS from 'print-js'
import { brandFilter, categoryFilter, format } from '@/utils/filter'

  @Component({
    components: { Card },
    filters: { brandFilter, categoryFilter, format }
  })
export default class PrintTable extends Vue {
    // 列表数据
    planeData = []

    @Prop({ type: Array, default: function () { return [] } }) tableData
    @Prop({ type: Object, default: function () { return [] } }) tableInfo

    printInit () {
      printJS({
        printable: 'printBox',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
      })
    }

    // 展开数据结构
    unfoldData (orderVo) {
      let data = []
      orderVo.forEach((orderVoList, orderVoIndex) => {
        if (orderVoList.clsleve2VoList && orderVoList.clsleve2VoList.length) {
          let orderVoRow = 0
          orderVoList.clsleve2VoList.forEach((clsleve2Item, clsleve2Index) => {
            if (clsleve2Item.clsleve3VoList && clsleve2Item.clsleve3VoList.length) {
              clsleve2Item.clsleve3VoList.forEach((clsleve3Item, clsleve3Index) => {
                orderVoRow++
                data.push({
                  clsleve2Key: clsleve2Index,
                  clsleve3Key: clsleve3Index,
                  orderVoKey: orderVoIndex,
                  orderVoRow: 0,
                  clsleve2Row: clsleve2Item.clsleve3VoList.length,
                  factoryContractNo: orderVoList.factoryContractNo,
                  brand: orderVoList.brand,
                  category: orderVoList.category,
                  quanlity: orderVoList.quanlity,
                  quanlityDesc: orderVoList.quanlityDesc,
                  clsleve2Name: clsleve2Item.clsleve2Name,
                  clsleve2Quanlity: clsleve2Item.clsleve2QuanlityDesc,
                  storage: clsleve2Item.storage,
                  clsleve3Name: clsleve3Item.clsleve3Name,
                  barCode: clsleve3Item.barCode,
                  packageNo: clsleve3Item.packageNo
                })
              })
            }
          })
          data.forEach(list => {
            if (list.clsleve2Key === 0 && list.clsleve3Key === 0 && list.orderVoKey === orderVoIndex) {
              list.orderVoRow = orderVoRow
              list.orderVoKey = 0
            }
          })
        }
      })
      return data
    }
    @Watch('tableData')
    watchTableData (newVal, oldVal) {
      this.planeData = this.unfoldData(newVal)
    }
    created () {
      this.planeData = this.unfoldData(this.tableData)
    }
  }
</script>
<style lang="scss">
  #printBox {
    background-color: #fff;
    font-size: 14px;
    color: #606266;
    width: 100%;
    .printHead {
      margin-left: -2px;
      position: relative;
    }
    .printLogo {
      background-repeat: no-repeat;
      padding-left: 161px;
      background-image: url("../../../../assets/images/logo.png");
      line-height: 30px;
      object-fit: cover;
      width: 100%;
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 18px;
      color: #333;
    }
    .printTitle {
      display: inline-block;
      vertical-align: super;
      margin-left: 10px;
    }
    #tableForm {
      border-collapse: collapse;
      width: 100%;
      border: none;
      text-align: center;
      td {
        min-width: 100px;
        border-color: #606266;
      }
    }
    .print-sign-box{
      border: none;
      .print-sign-list{
        padding-top: 20px;
        border: none;
      }
    }
  }
</style>
