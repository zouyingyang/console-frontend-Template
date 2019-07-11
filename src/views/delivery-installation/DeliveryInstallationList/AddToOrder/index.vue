<template>
  <div v-loading="loading" class="my-case-index">
    <Card>
      <el-col :span="24" slot="head">
        <el-col :span="24">
          <el-form :inline="true" class="searchBox" @submit.native.prevent>
            <el-row>
              <el-col :span="24">
                <el-col :span="12">
                  <el-form-item class="op-left">
                    <el-button type="primary" size="mini" icon="el-icon-upload2">导出</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus">导入</el-button>
                    <el-button type="text" size="mini" icon="el-icon-download">下载导入摸板
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="op-right">
                    <el-button
                      @click="isShowDeliveryOrder=true"
                      type="text" size="mini"
                      icon="el-icon-tickets">
                      已添加的送货安装订单数
                      <span style="color: #000;">{{totalNum}}</span>
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col class="add-to-order">
                <el-form-item class="no-margin-bottom op-left">
                  <el-button @click="batchJoin" type="primary" size="mini">批量加入送货安装列表</el-button>
                </el-form-item>
                <el-form-item class="no-margin-bottom op-left" v-show="!isShowReceiptSearch">
                  <el-checkbox v-model="params.serviceNoComplete" label="2" @change="initData">客户齐套</el-checkbox>
                  <el-checkbox v-model="params.isComplete" label=true @change="initData">订单齐套</el-checkbox>
                  <el-checkbox v-model="params.isExpired" label=true @change="initData">是否过期</el-checkbox>
                  <el-checkbox v-model="params.isBack" label=true @change="initData">是否返仓</el-checkbox>
                  <el-checkbox-group class="op-right" v-model="nDays" @change="chooseNDay">
                    <el-checkbox class="margin-right" label="7" >7天内到期</el-checkbox>
                    <el-checkbox class="margin-right" label="3" >3天内到期</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item class="no-margin-bottom">
                  <el-tooltip class="item" effect="dark" content="客户名称、客户手机号、客户地址、工厂合同自编号" placement="top">
                    <el-input
                      clearable
                      size="mini"
                      @keyup.enter.native="initData"
                      maxlength="100"
                      placeholder="客户名称、客户手机号、客户地址、工厂合同自编号"
                      v-model="params.searchKeyword">
                    </el-input>
                  </el-tooltip>
                </el-form-item>
                <el-form-item style="margin-right: 0" class="no-margin-bottom">
                  <el-button size="mini" type="primary" @click="initData" v-show="!isShowReceiptSearch">
                    查询
                  </el-button>
                  <el-button type="primary" size="mini" @click="isShowReceiptSearch = !isShowReceiptSearch">
                    {{isShowReceiptSearch ? '收起高级搜索' : '展开高级搜索'}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24" style="margin-top: 10px" v-show="isShowReceiptSearch">
          <el-form class="add-to-order">
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户是否齐套" size="mini">
                  <el-checkbox-group @change="chooseserviceNoComplete" class="op-left" v-model="serviceNoComplete" >
                    <el-checkbox  label="2" name="serviceNoComplete">已齐套</el-checkbox>
                    <el-checkbox  label="1" name="serviceNoComplete">部分齐套</el-checkbox>
                    <el-checkbox  label="0" name="serviceNoComplete">未收货</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单是否齐套" size="mini">
                  <el-checkbox-group @change="chooseisComplete" class="op-left" v-model="isComplete" >
                    <el-checkbox  label="2" name="isComplete">已齐套</el-checkbox>
                    <el-checkbox  label="1" name="isComplete">部分齐套</el-checkbox>
                    <el-checkbox  label="0" name="isComplete">未收货</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态" size="mini">
                  <el-select placeholder="选择状态" size="mini" v-model="params.status">
                    <el-option :key="item.value" :label="item.label" :value="item.value"
                               v-for="item in options.status"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="期望交期" size="mini">
                  <el-date-picker
                    value-format="timestamp"
                    v-model="factoryExpDate"
                    size="mini"
                    style="width: 260px;"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="品牌" size="mini">
                    <el-select placeholder="选择品牌" size="mini" v-model="params.brand">
                      <el-option :key="item.value" :label="item.label" :value="item.value"
                                 v-for="item in options.brand"></el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="品类" size="mini">
                  <el-select v-model="params.category" placeholder="请选择">
                    <el-option v-for="item in options.category" :key="item.value"
                               :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-row style="margin-bottom:22px;float:right;">
                  <el-button type="primary" size="mini" @click="initData">高级查询</el-button>
                  <el-button type="primary" size="mini" @click="emptySearch">清空所有条件</el-button>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-col>

      <ReuseTable
        slot="content"
        ref="reuseTable"
        type="addToOrder"
        :tableHead="tableHead"
        :tableData="tableData"
        :twoTableHead="twoTableHead"
        :isCheck="true">
      </ReuseTable>

      <!--分页-->
      <el-pagination
        slot="foot"
        class="busPagin"
        @current-change="changeCurrentPage"
        @size-change="handleSizeChange"
        :current-page="params.pageNo"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </Card>

    <!--加入送货安装列表弹窗-->
    <el-dialog
      title="加入送货安装列表-消息提示"
      :visible.sync="isShowBatchJoin"
      width="30%"
      center>
      <h3 style="text-align: center;font-weight: bold; font-size: 22px">温馨提示</h3>
      <p style="text-align: center;font-weight: bold;">
        <i class="el-icon-check" style="font-size: 28px;line-height: 24px;color:green">
        </i>已成功加入送货安装列表
      </p>
      <span slot="footer" class="dialog-footer">
       <el-button type="primary" @click="showDeliveryOrder">查看送货安装列表</el-button>
       <el-button @click="continueJoin">继续添加</el-button>
      </span>
    </el-dialog>

    <!--已配置的送货安装订单弹窗-->
    <el-dialog
      :visible.sync="isShowDeliveryOrder"
      title="已配置的送货安装订单"
      center
      width="90%"
      :close-on-click-modal="false"
      class="deliveryOrder">
      <ConfiguredOrder  @closeDeliveryOrder="close" :isShowDeliveryOrder="isShowDeliveryOrder" :isShow="isShowDeliveryOrder" ></ConfiguredOrder>
    </el-dialog>
  </div>
</template>
<script>

import { Component, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import ReuseTable from '@/views/delivery-installation/FullInfoTable/components/ReuseTable'
import Card from '@/components/Card'
import ConfiguredOrder from '../../OrderDispatchList/components/ConfiguredOrder.vue'
const moduleFullDose = namespace('delivery-installation/fullInfoTable')
const moduleOrderDispatchList = namespace('delivery-installation/orderDispatchList')

  @Component({
    components: { ReuseTable, Card, ConfiguredOrder }
  })
export default class AddOrder extends Vue {
    loading = false
    totalNum = 0 // 已添加的送货安装订单数
    isShowReceiptSearch = false // 展开高级搜索
    isShowDeliveryOrder = false // 是否弹窗 已配置的送货安装订单
    isShowBatchJoin = false // 是否弹窗 批量加入送货安装列表
    IMGURL = process.env.OSS_PATH
    small = '?x-oss-process=style/small'
    nDays = []
    serviceNoComplete = [] // 客户齐套
    isComplete = [] // 订单齐套
    factoryExpDate = [] // 期望交期
    params = {
      searchKeyword: '', // 搜索字段
      serviceNoComplete: false, // 客户是否齐套
      isComplete: false, // 订单是否齐套
      isExpired: false, // 是否过期
      isBack: false, // 是否返货
      nDays: '', // 几天内到期
      brand: '', // 品牌
      category: '', // 品类
      dispatch: '', // 送货员
      factoryExpDateStart: null, // 工厂交期 开始日期
      factoryExpDatEnd: null, // 工厂交期 结束日期
      status: '', // 订单状态
      pageNum: 1,
      pageSize: 5
    }
    options = {
      brand: [
        { value: '', label: '全部' },
        { value: 'brand_oppein', label: '欧派' },
        { value: 'brand_oboli', label: '欧铂丽' },
        { value: 'brand_oboni', label: '欧铂尼' }
      ],
      category: [
        { value: '', label: '全部' },
        { value: 'category_chugui', label: '橱柜' },
        { value: 'category_yigui', label: '集成家居' },
        { value: 'category_mumen', label: '木门' },
        { value: 'category_weiyu', label: '卫浴' },
        { value: 'category_qiangshi', label: '软装' },
        { value: 'category_jinshumenchuang', label: '金属门窗' }
      ],
      // 订单状态
      status: [
        { value: '', label: '全部' },
        { value: '10', label: '待收货' },
        { value: '20', label: '部分收货' },
        { value: '30', label: '已收货' },
        { value: '40', label: '待出库' },
        { value: '50', label: '部分待出库' },
        { value: '60', label: '部分出库' },
        { value: '70', label: '待送货' },
        { value: '80', label: '部分送货' },
        { value: '90', label: '待安装' },
        { value: '100', label: '部分安装' },
        { value: '110', label: '已安装' },
        { value: '120', label: '已验收' }
      ]
    }
    total = 0
    tableData = [] // 列表数据
    tableHead = [
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'mobilePhone', isRowspan: true },
      { name: '客户地址', value: 'address', isRowspan: true },
      { name: '服务号是否齐套', value: 'serviceNoComplete', isRowspan: true },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '订单是否齐套', value: 'isComplete' },
      { name: '库存数量', value: 'stockQuantity' },
      { name: '已出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '合同交期', value: 'contractDeliverDt' },
      { name: '工厂计划交期', value: 'expectDate' },
      { name: '是否过期', value: 'isExpired' },
      { name: '是否返仓', value: 'isBack' },
      { name: '状态', value: 'status' },
      { name: '收货齐套时间', value: 'srvCompleteTime' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编码', value: 'marketCode' },
      { name: '门店', value: 'store' },
      { name: '是否加入待调度列表', value: 'isDispatch' }
    ]
    twoTableHead = [
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '订单是否齐套', value: 'isComplete' },
      { name: '库存数量', value: 'quanlity' },
      { name: '已出库数量', value: 'stockQuantity' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '期望交期', value: 'expectDate' },
      { name: '是否过期', value: 'isExpired' },
      { name: '状态', value: 'status' },
      { name: '是否加入待调度列表', value: 'isDispatch' }
    ]

    // 获取全量信息表数据
    @moduleFullDose.Action getInfoList

    // 待确认送货安装清单新增接口
    @moduleOrderDispatchList.Action conflistAdd

    //  已添加的送货安装订单数查询接口
    @moduleOrderDispatchList.Action countList

    initData (pageNum = 1) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      let params = {}
      if (!this.isShowReceiptSearch) {
        if (this.nDays.length) {
          params.nDays = this.nDays.join('')
        } else {
          params.nDays = ''
        }
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
        params.isBack = this.params.isBack === true ? 1 : null
        params.isExpired = this.params.isExpired === true ? 1 : null
        params.searchKeyword = this.params.searchKeyword
        params.serviceNoComplete = this.params.serviceNoComplete ? 2 : null
        params.isComplete = this.params.isComplete ? 2 : null
      } else {
        params = JSON.parse(JSON.stringify(this.params))
        if (this.serviceNoComplete.length) {
          params.serviceNoComplete = this.serviceNoComplete[0] * 1
        } else {
          params.serviceNoComplete = null
        }
        if (this.isComplete.length) {
          params.isComplete = this.isComplete[0] * 1
        } else {
          params.isComplete = null
        }
        if (this.factoryExpDate.length) {
          params.factoryExpDateStart = this.factoryExpDate[0]
          params.factoryExpDatEnd = this.factoryExpDate[1]
        } else {
          params.factoryExpDateStart = null
          params.factoryExpDatEnd = null
        }
        params.isBack = null
        params.isExpired = null
        params.searchKeyword = this.params.searchKeyword
      }
      this.getAllList(params)
    }
    // 数据初始化
    getAllList (params) {
      this.loading = true
      this.getTotalNum()
      this.getInfoList(params).then(res => {
        console.log('获取订单信息全量表res', res)
        this.loading = false
        if (res.status && res.code === '200') {
          if (res.data.list.length) {
            this.tableData = JSON.parse(JSON.stringify(res.data.list))
            this.total = res.data.total
          } else {
            this.tableData = []
            this.total = 0
          }
        } else {
          this.total = 0
          this.$message.error(res.message || '系统错误')
        }
      }).catch(error => {
        console.log('获取订单信息全量表error', error)
        this.loading = false
      })
    }
    // nDay选择 5/3只能选一个
    chooseNDay (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.nDays = []
        this.nDays.push(arr[1])
      }
      this.initData()
    }
    // 选择客户是否齐套
    chooseserviceNoComplete (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.serviceNoComplete = []
        this.serviceNoComplete.push(arr[1])
      }
    }
    // 选择订单是否齐套
    chooseisComplete (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.isComplete = []
        this.isComplete.push(arr[1])
      }
    }

    // 获取已添加安装单总数
    getTotalNum () {
      this.countList().then(res => {
        if (res.status && res.code === '200') {
          this.totalNum = res.data
        }
      }).catch(() => {
        // this.$message.error('获取已添加安装单总数失败')
      })
    }

    // 继续添加按钮
    continueJoin () {
      this.isShowBatchJoin = false
      this.initData()
    }

    // 换页控制
    changeCurrentPage (val) {
      this.initData(val)
    }

    // 一页展示多少条数据
    handleSizeChange (size) {
      this.params.pageSize = size
      this.initData()
    }

    // 打开已配置的送货安装订单
    showDeliveryOrder () {
      const self = this
      this.isShowBatchJoin = false
      setTimeout(function () {
        self.isShowDeliveryOrder = true
      }, 190)
    }

    // 搜索
    receiptTicketSearch () {
      this.initData()
    }

    // 子组件关闭送货安装订单
    close (data) {
      this.isShowDeliveryOrder = data
    }

    // 批量加入送货安装列表
    batchJoin () {
      let checkData = this.$refs.reuseTable.getCheckedData()
      let arr = checkData.filter(list => {
        return list.userChecked
      }).map(list => {
        return {
          custId: list.id,
          orders: [
            {
              leve2: list.clsleve2 ? list.clsleve2.filter(i => {
                return i.checked
              }).map(j => { return j.id }) : '',
              orderId: list.orderId
            }
          ]
        }
      })
      if (arr.length) {
        this.loading = true
        // console.log(JSON.stringify(arr))
        this.conflistAdd({ data: arr }).then(res => {
          this.loading = false
          if (res.status && res.code === '200') {
            this.isShowBatchJoin = true
          } else {
            this.$message.error(res.message || '添加失败')
          }
        }).catch(error => {
          console.log('添加失败error', error)
          // this.$message({
          //   message: '添加成功',
          //   type: 'error'
          // })
          this.loading = false
        })
      } else {
        this.$message.warning('您未选择操作订单')
      }
    }

    // 标准品确认回调
    submitMenu (data) {
      console.log(data)
    }

    toAddPage () {
      this.$router.push({
        path: 'delivery-installation-list/add-order'
      })
    }
    // 清除搜索条件
    emptySearch () {
      this.params.searchKeyword = ''
      this.serviceNoComplete = []
      this.isComplete = []
      this.factoryExpDate = []
      this.nDays = []
      this.params.serviceNoComplete = false
      this.params.isComplete = false
      this.params.isExpired = false// 是否过期
      this.params.isBack = false // 是否返货
      this.params.brand = '' // 品牌
      this.params.category = ''// 品类
      this.params.status = '' // 订单状态
    }
    // 监听添加送货安装弹窗更新订单总数
    @Watch('isShowBatchJoin')
    isShowBatchJoinChange (isShowBatchJoin) {
      if (!isShowBatchJoin) {
        this.initData()
      } else {
        this.getTotalNum()
      }
    }
    // 监听已配置安装弹窗更新订单总数
    @Watch('isShowDeliveryOrder')
    isShowDeliveryOrderChange (isShowDeliveryOrder) {
      if (!isShowDeliveryOrder) {
        this.initData()
      } else {
        this.initData()
      }
    }

    created () {
      this.initData()
    }
  }
</script>

<style src="./style.scss" scoped lang="scss">

</style>
