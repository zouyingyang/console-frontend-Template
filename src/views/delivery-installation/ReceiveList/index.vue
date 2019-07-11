<template>
  <div>
    <div class="op-receive-list" v-show="!$route.meta.hidden">
      <Card v-loading="loading">
        <el-col :span="24" slot="head">
          <el-col :span="24" class="searchBox">
            <el-form class="el-right" :inline="true" @submit.native.prevent>
              <el-form-item label="" class="op-left no-margin-bottom">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-download"
                  v-if="checkPermission('ReceiveListExcelBtn')"
                  @click="bathDeliveryExportInit">
                  批量导出
                </el-button>
              </el-form-item>
              <el-form-item label="" class="op-left no-margin-bottom">
                <el-button
                  type="primary"
                  size="mini"
                  @click="productDeliveryList">
                  成品收货列表
                </el-button>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-tooltip class="item" effect="dark" content="输入货运清单号、车牌号" placement="top">
                  <el-input
                    style="width:200px"
                    @keyup.enter.native="receiptTicketSearch"
                    v-model="params.searchKeyword"
                    class='receiptSearch'
                    maxlength="100"
                    size="mini"
                    placeholder="货运清单号、车次">
                  </el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item class="no-margin-bottom no-margin-right">
                <el-button v-show="!isShowReceiptSearch" @click="receiptTicketSearch" size="mini" type="primary">查询
                </el-button>
                <el-button type="primary" size="mini" @click="isShowReceiptSearch = !isShowReceiptSearch">
                  {{isShowReceiptSearch ? '收起高级搜索' : '展开高级搜索'}}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" v-show="isShowReceiptSearch" class="op-margin-top-20">
            <el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
              <el-row class="receiptTicketRow1">
                <el-col :span="5">
                  <el-form-item label="状态" size="mini">
                    <el-select v-model="params.status" placeholder="请选择">
                      <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="收货人" size="mini">
                    <el-tag style="margin-right: 5px" v-if="!takeBy.length" class="checkTag" size="mini">暂未选择收货人</el-tag>
                    <el-tag v-else closable @close="closeTag"  style="margin-right: 5px" v-for="(item,index) in takeBy" :key="index" size="mini">{{item.name}}</el-tag>
                    <el-button @click="takeBySearch" type="text">选择</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="车次" size="mini">
                    <el-input maxlength="20" size="mini" v-model="params.carnum" placeholder="请输入车次"></el-input>
                  </el-form-item>
                </el-col>
                <!--<el-col :span="11">-->
                  <!--<el-form-item label="实际收货时间" size="mini">-->
                    <!--<div class="block">-->
                      <!--<el-date-picker v-model="params.date1" type="daterange" start-placeholder="开始日期"-->
                                      <!--end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">-->
                      <!--</el-date-picker>-->
                    <!--</div>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="9">
                  <el-form-item label="发货日期" size="mini">
                    <el-date-picker
                      value-format="timestamp"
                      v-model="sendTime"
                      size="mini"
                      style="width: 280px;"
                      unlink-panels
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!--<el-col :span="12">-->
                  <!--<el-form-item label="计划收货时间" size="mini">-->
                    <!--<el-date-picker v-model="params.date3" type="daterange" start-placeholder="开始日期"-->
                                    <!--end-placeholder="结束日期"-->
                                    <!--:default-time="['00:00:00', '23:59:59']">-->
                    <!--</el-date-picker>-->
                  <!--</el-form-item>-->
                <!--</el-col>-->
              </el-row>
              <el-row>
                <el-col :span="24" class="no-margin-bottom">
                  <el-row class="op-right">
                    <el-button type="primary" size="mini" @click="advancedSearch">高级查询</el-button>
                    <el-button type="primary" size="mini" @click="emptySearch">清空所有条件</el-button>
                  </el-row>
                </el-col>
              </el-row>

            </el-form>
          </el-col>
        </el-col>
        <el-table slot="content" cell-class-name="receive-list-cell" size="mini" :data="tableData" border style="width: 100%" :max-height="tableHeight">
          <div v-for="(list,lIndex) in tableHead" :key="lIndex">
            <template v-if="list.name==='选择'">
              <el-table-column fixed :label="list.name" align="center" width="50">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.choose"></el-checkbox>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name ==='货运单号'">
            <el-table-column align="center" :label="list.name" width="200">
              <template slot-scope="scope">
                {{scope.row[list.value]}}
              </template>
            </el-table-column>
          </template>
            <template v-else-if="list.name ==='发货时间'">
              <el-table-column align="center" :label="list.name" width="200">
                <template slot-scope="scope">
                  {{scope.row[list.value]| format("yyyy-MM-dd HH:mm:ss")}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='状态'">
              <el-table-column :label="list.name" align="center" width="100">
                <template slot-scope="scope" prop="status">
                  {{scope.row.status|statusFilter}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='操作'">
              <el-table-column fixed="right" label="操作" align="center" width="230">
                <template slot-scope="scope" prop="status">
                  <el-button v-if="scope.row.status ==='10'||scope.row.status==='20'" @click="orderReceipt(scope.row)"
                             type="text" size="mini">
                    按订单签收
                  </el-button>
                  <el-button v-else size="mini" type="text" @click="orderDetail(scope.row)">按订单查看</el-button>
                  <el-button @click="openAllReceipt(scope.row)" v-if="scope.row.status==='10'" size="mini" type="text">
                    整车签收
                  </el-button>
                  <el-button @click="openReturnReason(scope.row)" v-if="scope.row.status==='10'" type="text" size="mini">
                    整车返货
                  </el-button>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column :prop="list.value" :label="list.name" align="center" width="120"></el-table-column>
            </template>
          </div>
        </el-table>

        <!--分页-->
        <el-pagination
          slot="foot"
          class="busPagin"
          @current-change="changeCurrentPage"
          @size-change="handleSizeChange"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </Card>

      <!--整车返货-->
      <el-dialog :close-on-click-modal="false" title="确认返回工厂" :visible.sync="isShowReturnReason" center>
        <el-form :model="ReturnReasonForm" :rules="rules">
          <p class="reasonNum">
            共发货{{sendQuantity}}件，返货{{sendQuantity}}件</p>
          <el-form-item
            label="返货原因"
            prop="reason"
            :label-width="formLabelWidth">
            <el-input maxlength="50" v-model="ReturnReasonForm.reason"></el-input>
          </el-form-item>
          <el-form-item
            label="备注"
            :label-width="formLabelWidth">
            <el-input maxlength="100" type="textarea" v-model="ReturnReasonForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowReturnReason = false" size="mini">取 消</el-button>
          <el-button v-if="ReturnReasonForm.reason" type="primary" @click="submitReturnReason" size="mini">确 定</el-button>
          <el-button v-else disabled type="primary" size="mini">确 定</el-button>
        </div>
      </el-dialog>

      <!--整车签收-->
      <el-dialog
        v-loading="receiptLoading"
        title="确认收货"
        :visible.sync="isShowAllReceipt"
        width="30%"
        :close-on-click-modal="false"
        center>
        <h3 style="text-align: center">温馨提示</h3>
        <p style="text-align: center">您所选择的记录共发货<span class="red">{{sendQuantity}}件</span>，确认是否收货<span class="red">{{sendQuantity}}件</span>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowAllReceipt = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitAllReceipt" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <!--收货人选择弹窗-->
      <el-dialog
        class="deliveryAndSetter"
        :title="choose?'':'收货人选择'"
        :visible.sync="isShowDeliveryMan"
        width="52%"
        height="45%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <DeliveryAndSetter :type="type" :choose="choose"
                           @choseDeliveryInstallStaff="chose"
                           :multipleValues="[]"
                           :changeState="isShowDeliveryMan"></DeliveryAndSetter>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import CURRENT_ENV_PATH from '@/services/baseUrl.js'
import Card from '@/components/Card'
import { namespace } from 'vuex-class'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import { statusFilter, format } from '@/utils/filter'
const receiveListPort = namespace('delivery-installation/receiveListPort')
const moduleUser = namespace('user')

  @Component({
    components: { Card, DeliveryAndSetter },
    filters: { statusFilter, format }
  })
export default class ReceiveList extends Vue {
    tableHeight = 0
    total = 0
    type = null
    choose = false
    isShowDeliveryMan = false // 收货人弹窗
    takeBy = [] // 收货人
    filename = '' // 文件导出名字
    loading = false
    receiptLoading = false// 整车收货loading
    // 是否展开高级搜索
    isShowReceiptSearch = false
    // 是否打开退货提醒
    isShowReturnReason = false
    // 是否弹窗整车签收
    isShowAllReceipt = false
    // 发货数量
    sendQuantity = 0
    sendTime = [] // 发货时间
    // 物流厂商选项
    warehouse= [
      { value: '1', label: 'A仓库' },
      { value: '2', label: 'B仓库' }]
    // 订单状态
    status = [
      { value: '', label: '全部' },
      { value: '10', label: '待收货' },
      { value: '20', label: '部分收货' },
      { value: '30', label: '已收货' },
      { value: '1', label: '已返货' }]
    ReturnReasonForm = {
      deliveryNo: '', // 货运清单号
      reason: '', // 返货原因
      remark: ''// 备注
    }
    rules = {// 返货原因说明
      reason: [{
        required: true,
        message: '请填写返货原因说明',
        trigger: 'blur'
      }]
    }
    params = { // 获取查询列表参数
      searchKeyword: '',
      carnum: '', // 车次
      // markeCode: '', // 商场编号
      // markeName: '', // 商场名称
      // plantakeDeliveryTimeBg: '', // 计划收货开始时间
      // plantakeDeliveryTimeEd: '', // 计划收货结束时间
      sendTimeBg: '', // 发货开始时间
      sendTimeEd: '', // 发货结束时间
      status: '10', // 状态
      takeBy: '', // 收货人
      // takeDeliveryTimeBg: '', // 实际收货开始时间
      // takeDeliveryTimeEd: '', // 实际收货结束时间
      pageNum: 1,
      pageSize: 20
    }
    tableHead = [ // 表头数据
      { name: '操作', value: '' },
      { name: '选择', value: '' },
      { name: '货运单号', value: 'deliveryNo' },
      { name: '回执单号', value: 'receiptNumber' },
      { name: '发货基地', value: 'siteCode' },
      { name: '物流厂商', value: 'logisticsCompany' },
      { name: '车次', value: 'carnum' },
      { name: '车号', value: 'platenum' },
      { name: '发货件数', value: 'sendQuantity' },
      { name: '收货件数', value: 'receiveQuantity' },
      { name: '状态', value: 'status' },
      { name: '发货时间', value: 'deliveryTime' },
      { name: '收货人', value: 'createBy' },
      { name: '返货原因', value: 'reason' },
      { name: '备注', value: 'remark' }
    ]
    tableData = []
    formLabelWidth = '80px'
    // 货运清单号
    deliveryNo = ''

    // 权限控制
    @moduleUser.Getter permission
    // 收货列表
    @receiveListPort.Action deliveryOrderList
    // 导出
    @receiveListPort.Action bathDeliveryExport
    // 整车返货
    @receiveListPort.Action returnsByCar
    // 整车签收
    @receiveListPort.Action takeDeliveryByCar

    productDeliveryList () {
      this.$router.push({
        name: 'product-delivery-list'
      })
    }

    // 数据初始化
    initData (pageNum = 1, searchKeyword) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      this.loading = true
      // 预约安装时间啊
      if (this.sendTime && this.sendTime.length) {
        this.params.sendTimeBg = this.sendTime[0]
        this.params.sendTimeEd = this.sendTime[1]
      } else {
        this.params.sendTimeBg = null
        this.params.sendTimeEd = null
      }
      this.takeBy.length ? this.params.takeBy = this.takeBy[0].id : this.params.takeBy = null
      let params = {}
      if (searchKeyword) {
        params.searchKeyword = this.params.searchKeyword
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
      } else {
        params = Object.assign(params, this.params)
      }
      this.deliveryOrderList({ ...params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status) {
          if (res.data) {
            this.total = res.data.total
            this.tableData = res.data.list
          }
        }
      }).catch(error => {
        this.loading = false
        this.total = 0
        this.tableData = []
        console.log('收货列表error', error)
      })
    }
    // 收货人选择
    takeBySearch () {
      this.type = null
      this.isShowDeliveryMan = true
    }
    // 选择收货人关闭
    chose (data) {
      this.takeBy = []
      this.takeBy.push(data)
      this.isShowDeliveryMan = false
    }
    // 收货人移除
    closeTag (data) {
      // console.log(data)
      if (data.isTrusted) {
        this.takeBy = []
      }
    }

    // 导出
    bathDeliveryExportInit () {
      // 预约安装时间啊
      if (this.sendTime && this.sendTime.length) {
        this.params.sendTimeBg = this.sendTime[0]
        this.params.sendTimeEd = this.sendTime[1]
      } else {
        this.params.sendTimeBg = ''
        this.params.sendTimeEd = ''
      }
      this.loading = true
      axios({
        method: 'post',
        baseURL: CURRENT_ENV_PATH.baseUrl,
        url: '/mtdssales-delivery/delivery/signing/bathDeliveryExport',
        data: this.params,
        responseType: 'blob'
      }).then(res => {
        this.loading = false
        console.log('收货列表导出res', res)
        // let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let blob = res.data
        let anchor = document.createElement('a')
        anchor.download = '收货列表导出数据.xlsx'
        anchor.href = URL.createObjectURL(blob)
        document.body.appendChild(anchor)
        anchor.click()
        this.$message.success('导出成功')
      }).catch((error) => {
        this.loading = false
        this.$message.error('导出失败,系统出现异常')
        console.log('收货列表导出error', error)
      })
    }

    formatJson (filterVal, jsonData) {
      return jsonData.map(v => {
        return filterVal.map(j => v[j])
      })
    }

    // 查询
    receiptTicketSearch () {
      this.initData(false, true)
    }

    // 按订单查看路由跳转
    orderDetail (item) {
      this.$router.push({
        path: 'receive-list/view-by-order',
        query: {
          deliveryNo: item.deliveryNo
        }
      })
    }

    // 按订单签收路由跳转
    orderReceipt (item) {
      this.$router.push({
        name: 'receipt-by-order',
        query: {
          deliveryNo: item.deliveryNo
        }
      })
    }

    // 点击整车返库按钮
    openReturnReason (item) {
      this.isShowReturnReason = true
      this.ReturnReasonForm.reason = '' // 清空返货原因
      this.ReturnReasonForm.remark = ''// 清空备注
      this.ReturnReasonForm.deliveryNo = item.deliveryNo
      this.sendQuantity = item.sendQuantity
      // console.log(item)
    }

    // 返库确认按钮
    submitReturnReason () {
      this.loading = true
      this.returnsByCar({ ...this.ReturnReasonForm }).then(res => {
        res = JSON.parse(JSON.stringify(res))
        if (res.status) {
          if (res.data) {
            this.loading = false
            this.$message.success('整车返货成功')
            this.initData()
          }
        }
      }).catch(error => {
        this.loading = false
        this.$message.error('整车返货error', error)
      })
      this.isShowReturnReason = false
    }

    // 整车签收确认弹窗
    openAllReceipt (item) {
      this.isShowAllReceipt = true
      this.sendQuantity = item.sendQuantity
      this.deliveryNo = item.deliveryNo
    }

    // 整车签收确认
    submitAllReceipt () {
      this.receiptLoading = true
      this.takeDeliveryByCar({ deliveryNo: this.deliveryNo }).then(res => {
        console.log('整车签收确认res', res)
        this.receiptLoading = false
        if (res.status && res.code === '200') {
          this.$message.success('整车签收成功')
          this.initData()
        }
        this.isShowAllReceipt = false
      }).catch(error => {
        this.receiptLoading = false
        this.$message.error('整车签收失败')
        console.log('整车签收确认error', error)
      })
      // returnsByCar
    }

    // 换页控制
    changeCurrentPage (num) {
      this.initData(num)
    }

    // 一页展示多少条数据
    handleSizeChange (size) {
      this.params.pageSize = size
      this.initData()
    }

    // 获取屏幕高度，设定表格最大高度适屏幕
    // get fullHeight () {
    //   return document.documentElement.clientHeight - 315
    // }
    advancedSearch () {
      this.initData()
    }
    // 清空查询信息
    emptySearch () {
      this.params.searchKeyword = ''
      this.params.status = ''
      this.takeBy = []
      this.params.carnum = ''
      this.sendTime = []
    }

    // 判断是否拥有权限
    checkPermission (permissionStr) {
      if (!this.permission || this.permission === null || this.permission === undefined) {
        return false
      } else {
        return this.permission.indexOf(permissionStr) > -1
      }
    }
    created () {
      this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
      this.initData()
    }
  }
</script>

<style src="./style.scss" lang="scss" scoped></style>
