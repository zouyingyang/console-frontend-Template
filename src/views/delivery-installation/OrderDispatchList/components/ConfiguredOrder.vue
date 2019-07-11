<!--suppress ALL -->
<template>
  <el-container v-loading="loading">
    <el-main >
      <div class="plan">
        <el-form :inline="true" style="overflow: hidden">
          <el-col style="border-bottom: 2px solid #f08519;line-height: 1em;margin-bottom: 2em">
            <el-col>
              <el-form-item style="margin-bottom:0px;">
                <h3 style="line-height: 0.5em;">送货安装计划 </h3>
              </el-form-item>
              <el-form-item style="margin-bottom:0px;" class="op-right">
                <el-button @click="createInstallationList" size="mini" type="primary">生成送货安装单</el-button>
                <el-button size="mini" type="primary" @click="print">生成并打印送货安装单</el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
        <el-row>
          <el-form>
            <el-row>
              <el-col :span="8">
                <el-form-item label=" " :rules="rules.deliveryInstallModel">
                  <el-radio-group v-model="params.deliveryInstallModel">
                    <el-radio label="0">送装分离</el-radio>
                    <el-radio style="margin-left:4em" label="1">送装一体</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="送货车辆" size="mini">
                  <!-- <el-input class="width170" maxlength="20" size="mini" v-model="params.plateNum" placeholder="请输入送货车辆"></el-input> -->
                  <el-autocomplete
                    class="auto_input"
                    clearable
                    :maxlength="20"
                    value-key="plateNum"
                    v-model="params.plateNum"
                    :fetch-suggestions="getAllPlateSelect"
                    @blur="blurSave('plateNum',params.plateNum)"
                    @select="autocompleteSelect('plateNum',arguments)"
                    placeholder="请输入送货车辆"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="司机" size="mini">
                  <!-- <el-input class="width170" maxlength="20" size="mini" v-model="params.driver" placeholder="请输入司机"></el-input> -->
                  <el-autocomplete
                    class="auto_input"
                    clearable
                    :maxlength="20"
                    value-key="driver"
                    v-model="params.driver"
                    :fetch-suggestions="getAllDriverSelect"
                    @blur="blurSave('driver',params.driver)"
                    @select="autocompleteSelect('driver',arguments)"
                    placeholder="请输入司机"
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="预约送货时间" size="mini">
                  <el-date-picker
                    class="width200"
                    v-model="params.detail.plannedDeliveryTime"
                    type="datetime"
                    default-time="9:00:00"
                    value-format="timestamp"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="送货责任人" size="mini" value="1">
                  <el-tag v-if="deliveryOwner" size="mini">{{deliveryOwner}}</el-tag>
                  <el-tag class="checkTag" v-else size="mini">暂未选择</el-tag>
                  <el-button type="text" @click="choiceDeliveryOwner">选择</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="送货协助人" size="mini" value="1" class="mulCheck">
                  <el-tag class="checkTag" v-if="deliveryFacilitator.length===0" size="mini">暂未选择</el-tag>
                  <el-tag v-else v-for="(item,index) in deliveryFacilitator" :key="index" size="mini">
                    {{item.name}}
                  </el-tag>
                  <el-button type="text" @click="mulChoiceDeliveryFacilitator">选择</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item class="margin-top-5" v-if="params.deliveryInstallModel==='0'" label="预约安装时间" size="mini" >
                  <el-date-picker
                    v-model="params.detail.plannedInstallationTime"
                    type="datetime"
                    class="width200"
                    default-time="9:00:00"
                    value-format="timestamp"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-else label="预约安装时间" size="mini" class="margin-top-5">
                  <el-date-picker
                    v-model="params.detail.plannedDeliveryTime"
                    type="datetime"
                    class="width200"
                    default-time="9:00:00"
                    disabled
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="安装责任人" size="mini" value="1" :rules="rules.deliverPersonValue" class="margin-top-5">
                  <el-tag v-if="installationOwner" size="mini">{{installationOwner}}</el-tag>
                  <el-tag class="checkTag" v-else size="mini">暂未选择</el-tag>
                  <el-button type="text" @click="choiceDeliveryMan">选择</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="安装协助人" size="mini" value="1" class="mulCheck margin-top-5">
                  <el-tag class="checkTag" v-if="installationFacilitator.length===0" size="mini">暂未选择</el-tag>
                  <el-tag v-else v-for="(item,index) in installationFacilitator" :key="index"
                          size="mini">{{item.name}}
                  </el-tag>
                  <el-button type="text" @click="mulChoiceDeliveryMan">选择</el-button>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item style="margin-left: 90px;" v-show="!installationOwner&&!deliveryOwner&&!installationFacilitator.length&&!deliveryFacilitator.length">
                  预约送货时间或预约安装时间需添加一个
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item
                  style="margin-top: 5px;"
                  label="备注"
                  label-width="95px">
                  <el-input
                    style="width:75%;margin-top: 5px"
                    type="textarea"
                    :rows="1"
                    v-model="params.detail.deliveryRemark" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
      </div>
      <!--送货安装清单-->
      <div v-if="!userData.length" class="clientTable">
        <p style="text-align: center;font-size: 16px;font-weight: bold">暂无数据</p>
      </div>
      <div v-else class="detailed">
        <el-form :inline="true" style="overflow: hidden">
          <el-col style="border-bottom: 2px solid #f08519">
            <el-form-item style="margin-bottom:0px;">
              <h3 style="line-height: 0.5em;">送货安装清单 </h3>
            </el-form-item>
            <el-form-item class="op-right" style="margin-bottom:0px;">
              <el-button type="text" @click="isShowAllDeleteAll=true">删除</el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <div class="clientTable" :key="index" v-for="(item,index) in userData">
          <div style="margin-bottom: 5px">
            <el-checkbox v-model="item.All" label="" name="type" @change="allCheck(item)"></el-checkbox>
            <span class="userTitle">{{item.customerName}}</span>
            <span class="userTitle">{{item.customerTel}}</span>
            <span class="userTitle">{{item.customerAddress}}</span>
          </div>
          <template>
            <el-table
              ref="table"
              size="mini"
              :data="item.newData"
              :span-method="arraySpanMethod"
              border
              style="width: 100%; margin-bottom: 26px">
              <div :key="index" v-for="(list,index) in tableHead">
                <div v-if="list.name==='工厂合同自编号'">
                  <el-table-column align="center" :label="list.name" width="200">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.one" label="" name="type" @change="oneCheck(scope.row)"></el-checkbox>
                      {{scope.row.factoryContractNo}}
                    </template>
                  </el-table-column>
                </div>
                <template v-else-if="list.name==='二级品类'">
                  <el-table-column align="left" :label="list.name">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.two" label="" name="type" @change="twoCheck(scope.row)"></el-checkbox>
                      {{scope.row.clsleve2Name}}
                    </template>
                  </el-table-column>
                </template>
                <template v-else-if="list.name==='操作'">
                  <el-table-column align="center" :label="list.name" v-if="list.name==='操作'">
                    <template slot-scope="scope">
                      <el-button @click="ShowProductList(scope.row)" type="text">添加标准品</el-button>
                    </template>
                  </el-table-column>
                </template>
                <template v-else-if="list.name==='是否齐套'">
                  <el-table-column align="center" :label="list.name" v-if="list.name==='是否齐套'">
                    <template slot-scope="scope">
                      {{scope.row.isComplete|completeFilter}}
                    </template>
                  </el-table-column>
                </template>
                <template v-else-if="list.name==='品牌'">
                  <el-table-column align="center" :label="list.name" v-if="list.name==='品牌'">
                    <template slot-scope="scope">
                      {{scope.row.brand|brandFilter}}
                    </template>
                  </el-table-column>
                </template>
                <template v-else-if="list.name==='品类'">
                  <el-table-column align="center" :label="list.name" v-if="list.name==='品类'">
                    <template slot-scope="scope">
                      {{scope.row.category|categoryFilter}}
                    </template>
                  </el-table-column>
                </template>
                <template v-else>
                  <el-table-column align="center" :prop="list.value" :label="list.name"></el-table-column>
                </template>
              </div>
            </el-table>
          </template>
        </div>
      </div>

      <!--送货责任人/协助人弹窗选择-->
      <el-dialog
        class="deliveryAndSetter"
        :title="choose?'协助人选择':'责任人选择'"
        :visible.sync="isShowDeliveryMan"
        width="52%"
        height="45%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <DeliveryAndSetter
          :type="type"
          :choose="choose"
          :dutyPreson="type===1?params.detail.deliveryOwner:params.detail.installationOwner"
          :multipleValues="type===1?deliveryFacilitator:installationFacilitator"
          @choseDeliveryInstallStaff="chose"
          :changeState="isShowDeliveryMan"
          @multipleChoseDeliveryInstallStaff="multiplChose" />
      </el-dialog>

      <!--添加标准品-->
      <el-dialog
        title="添加标准品"
        :visible.sync="isShowProductList"
        width="60%"
        height="45%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <StandardAddition @submitMenu="submitMenu" :StandardAdditionId="StandardAdditionId"  :isShow="isShowProductList"></StandardAddition>
      </el-dialog>

      <!--确认全部删除弹窗-->
      <el-dialog
        v-loading="twoLoading"
        title="确认删除"
        :visible.sync="isShowAllDeleteAll"
        width="30%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <h3 style="text-align: center">温馨提示</h3>
        <p style="text-align: center">您确定删除选中数据么吗</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowAllDeleteAll = false">取 消</el-button>
          <el-button type="primary" @click="deleteAll">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>

</template>

<script>
import { Component, Watch, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import StandardAddition from '@/views/delivery-installation/OrderDispatchList/components/StandardAddition'
import { brandFilter, categoryFilter, completeFilter } from '@/utils/filter'

const orderDispatchList = namespace('delivery-installation/orderDispatchList')
const deliveryInstallationList = namespace('delivery-installation/deliveryInstallationList')

  @Component({
    components: { DeliveryAndSetter, StandardAddition },
    filters: { brandFilter, categoryFilter, completeFilter }
  })
export default class ConfiguredOrder extends Vue {
    // 组件是否调用
    @Prop({ type: Boolean, default: false }) isShowDeliveryOrder
    loading=false
    twoLoading = false
    isShowDeliveryMan = false// 显示责任/协助人弹窗
    isShowProductList = false// 添加标准品弹窗
    isShowAllDeleteAll=false // 删除全部弹窗
    type = 2// 安装责任人弹窗请求数据类型 1-送货员 2-安装工
    choose = false// 责任人弹窗是否多选
    installationOwner = ''// 安装责任人弹窗的安装责任人
    installationFacilitator = []// 安装协助人弹窗的安装协助人
    deliveryOwner = ''// 送货责任人弹窗的送货责任人
    deliveryFacilitator = []// 送货协助人弹窗的送货协助人
    ProductListArr = []// 已选标准品数组
    createInstallation = {}// 生成安装单传参
    StandardAdditionId = '' // 添加标准品的订单ID
    params = { // 生成安装单页面临时变量
      deliveryInstallModel: '0', // 送装一体 0-送装分离 1-送装一体
      detail: { // 订单详情列表
        categoryType: '', // 二级品类类型 0-二级品类 1-标准品
        clsleve2Id: '', // 二级品类或者是标准品ID，通过类型区分
        deliveryFacilitator: [], // 送货协助人
        deliveryOwner: '', // 送货责任人
        deliveryRemark: '', // 备注
        installationFacilitator: [], // 安装协助人
        installationOwner: '', // 安装责任人
        orderId: '', // 订单id
        plannedDeliveryTime: '', // 计划送货时间
        plannedInstallationTime: '', // 计划安装时间
        quantily: '' // 件数
      },
      driver: '', // 司机
      plateNum: ''// 车牌号
    }
    rules = {
      deliveryInstallModel: { required: true, message: '', trigger: 'blur' }
    }
    deliverPerson = [
      { // 状态选项
        value: '1',
        label: '小吴'
      }, {
        value: '2',
        label: '老张'
      }, {
        value: '3',
        label: '老王'
      }, {
        value: '4',
        label: '小李'
      }]
    tableHead = [
      { name: '包编号', value: 'packageNo' },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '是否齐套', value: 'isComplete' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '数量', value: 'quanlity' },
      { name: '三级品类', value: 'clsleve3Name' },
      { name: '包条码', value: 'barCode' }
    ]// 表头数据
    isRowspanData = {} // 是否跨行
    tableData = []// 表格数据
    userData = []// 用户数据
    dispatchUser = {
      dispatchUser: ''// 调度员id
    }
    productList = {} // 添加的标准品
    // 待确认送货安装清单查询接口
    @orderDispatchList.Action confirmedList
    // 生成安装单接口
    @orderDispatchList.Action createPlant
    // 待确认送货安装清单删除接口
    @orderDispatchList.Action deleteRepertoire
    // 待确认送货安装清单删除接口(dev1.1新增删除接口)
    @orderDispatchList.Action newDeleteRepertoire
    // 获取司机列表
    @deliveryInstallationList.Action driverList
    // 获取车辆列表
    @deliveryInstallationList.Action plateNumList
    // 保存司机和送货车辆信息
    @deliveryInstallationList.Action saveDriverAndPlateNum
    // 初始化数据
    initData () {
      this.loading = true
      this.userData = []
      this.tableData = []
      this.confirmedList({ ...this.dispatchUser }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status && res.code === '200') {
          if (res.data.length) {
            // 请求返回数据加check值
            res.data.forEach((user, userI) => {
              user.All = true
              user.orders.forEach((oneItem, oneIndex) => {
                oneItem.one = true
                oneItem.leve2.forEach((twoItem, twoIndex) => {
                  twoItem.two = true
                })
              })
            })
            this.tableData = res.data
            for (let standardAdditionId in this.productList) {
              this.setProduct(this.productList[standardAdditionId], standardAdditionId)
            }
            console.log('待确认送货安装清单res', JSON.parse(JSON.stringify(this.tableData)))
          } else {
            this.$message.warning('暂无送货安装订单')
            setTimeout(() => {
              this.$emit('changeDeliveryOrder', false)
            }, 300)
          }
        }
      }).catch(error => {
        this.total = 0
        this.loading = false
        // this.$message.error('待确认送货安装清单error')
        console.log('待确认送货安装清单error', error)
      })
    }
    getAllPlateSelect (queryString, cb) { // 获取车辆列表信息
      let qureyStr = queryString.trim()
      let params = {
        pageNum: 1,
        pageSize: 10
      }
      if (qureyStr) {
        params.searchKeyword = qureyStr
        params.pageSize = 20
      }
      let result = []
      this.plateNumList(params).then(res => {
        if (res.code === '200' && res.status && res.data && Array.isArray(res.data.list)) {
          result = res.data.list
        }
        cb(result)
      }).catch(err => {
        console.log(err)
        cb(result)
      })
    }
    getAllDriverSelect (queryString, cb) { // 获取司机列表信息
      let qureyStr = queryString.trim()
      let params = {
        pageNum: 1,
        pageSize: 10
      }
      if (qureyStr) {
        params.searchKeyword = qureyStr
        params.pageSize = 20
      }
      let result = []
      this.driverList(params).then(res => {
        if (res.code === '200' && res.status && res.data && Array.isArray(res.data.list)) {
          result = res.data.list
        }
        cb(result)
      }).catch(err => {
        console.log(err)
        cb(result)
      })
    }
    blurSave (type, keyword) {
      let kw = keyword.trim()
      if (!kw) {
        return
      }
      let params = { type }
      params[type] = kw
      // switch (type) {
      //   case 'driver':
      //     params.driver = kw
      //     break
      //   case 'plateNum':
      //     params.plateNum = kw
      //     break
      // }
      this.saveDriverAndPlateNum(params).then(res => {
        console.log(res, '存储司机或者车辆信息成功')
      }).catch(err => {
        console.log(err, '存储司机或者车辆信息失败')
      })
    }
    autocompleteSelect (type, e) {
      if (e[0] && e[0][type]) {
        this.blurSave(type, e[0][type])
      }
    }
    // 修改安装计划 选择安装责任人
    choiceDeliveryMan () {
      this.type = 2
      this.choose = false
      this.isShowDeliveryMan = true
    }

    // 修改安装计划 选择安装协助人
    mulChoiceDeliveryMan () {
      this.type = 2
      this.choose = true
      this.isShowDeliveryMan = true
    }

    // 批量修改安装计划确认
    submitInstallPlan () {
      // apiGet.logisticsInstall.mulModifyInstallPlan(this.mulModifyInstallPlan).then(res => {
      //     this.loading = false;
      //     res =  JSON.parse(JSON.stringify(res))
      //     if (res.status) {
      //         if(res.data){
      //             console.log(res)
      //
      //         }
      //     }
      // })
      this.isShowInstallPlan = false
    }

    // 修改送货计划 选择送货责任人
    choiceDeliveryOwner () {
      this.type = 1
      this.choose = false
      this.isShowDeliveryMan = true
    }

    // 修改送货计划 选择送货协助人
    mulChoiceDeliveryFacilitator () {
      this.type = 1
      this.choose = true
      this.isShowDeliveryMan = true
    }

    // 选择责任人关闭
    chose (data) {
      if (this.type === 2) { // 安装
        this.params.detail.installationOwner = data.id
        this.installationOwner = data.name
      } else if (this.type === 1) { // 送货
        this.params.detail.deliveryOwner = data.id
        this.deliveryOwner = data.name
      }

      this.isShowDeliveryMan = false
    }

    // 选择协助人关闭
    multiplChose (data) {
      if (this.type === 2) { // 安装协助人
        this.params.detail.installationFacilitator = []
        this.installationFacilitator = []
        if (data.length) {
          data.forEach((item, index) => {
            this.params.detail.installationFacilitator.push(item.id)
            this.installationFacilitator.push(item)
          })
        }
      } else if (this.type === 1) { // 送货协助人
        this.params.detail.deliveryFacilitator = []
        this.deliveryFacilitator = []
        if (data.length) {
          data.forEach((item, index) => {
            this.params.detail.deliveryFacilitator.push(item.id)
            this.deliveryFacilitator.push(item)
          })
        }
      }

      this.isShowDeliveryMan = false
    }

    // 添加标准品
    ShowProductList (row) {
      this.isShowProductList = true
      this.StandardAdditionId = row.orderId
      // console.log('添加标准品Id', this.StandardAdditionId)
    }

    // 添加标准品返回函数
    submitMenu (data) {
      if (!this.productList[this.StandardAdditionId]) {
        this.productList[this.StandardAdditionId] = []
      }
      data.length && data.forEach(list => {
        this.productList[this.StandardAdditionId].push(list)
      })
      for (let standardAdditionId in this.productList) {
        this.setProduct(this.productList[standardAdditionId], standardAdditionId)
      }
      this.isShowProductList = false
    }

    // 设置标准品
    setProduct (data, standardAdditionId) {
      data = this.duplicateRemovalArr(data)
      this.tableData.forEach((item, index) => {
        item.orders.forEach((orderList, i) => {
          if (standardAdditionId === orderList.id) {
            data = data.map(list => {
              orderList.leve2.filter((item2, index2) => {
                list.id === item2.id && orderList.leve2.splice(index2, 1)
              })
              return { ...list, clsleve2Name: list.productName, isProduct: true }
            })
            orderList.leve2.push(...data)
            this.unfoldData(this.tableData)
          }
        })
      })
    }

    // 生成送货安装单
    createInstallationList () {
      this.loading = true
      let createTableData = [] // 生成送货安装单二级品类数组
      this.userData.forEach((user, userI) => {
        user.newData.forEach((item, index) => {
          if (item.two) {
            let obj = {}
            obj.categoryType = item.categoryType + ''
            obj.clsleve2Id = item.clsleve2Id
            obj.deliveryFacilitator = this.params.detail.deliveryFacilitator.join(',')
            obj.deliveryOwner = this.params.detail.deliveryOwner
            obj.deliveryRemark = this.params.detail.categoryType
            obj.installationFacilitator = this.params.detail.installationFacilitator.join(',')
            obj.installationOwner = this.params.detail.installationOwner
            obj.orderId = item.orderId
            obj.plannedDeliveryTime = this.params.detail.plannedDeliveryTime
            obj.plannedInstallationTime = this.params.detail.plannedInstallationTime
            obj.quantily = item.quanlity - 0
            if (this.params.deliveryInstallModel === '1') { // 如果送装一体 计划安装时间就和计划送货时间一致
              obj.plannedInstallationTime = this.params.detail.plannedDeliveryTime
            }
            if (createTableData.length) {
              createTableData.forEach((e, i) => {
                if (e.clsleve2Id === obj.clsleve2Id && e.categoryType === '0') {
                  createTableData.splice(i, 1)
                }
              })
            }
            createTableData.push(obj)
          }
        })
      })
      this.createInstallation.deliveryInstallModel = this.params.deliveryInstallModel
      this.createInstallation.detail = createTableData
      this.createInstallation.driver = this.params.driver
      this.createInstallation.plateNum = this.params.plateNum

      console.log('生成安装单数据', createTableData)
      if (!this.createInstallation.detail.length) {
        this.loading = false
        this.$message.warning('您未选取订单~')
        return false
      } else if (!this.deliveryOwner && !this.deliveryFacilitator.length && !this.installationOwner && !this.installationFacilitator.length) { // 变量验证（若送货责任人、送货协助人、安装责任人、安装协助人都为空时，送货时间和安装时间只需必填一个）
        if (!!this.params.detail.plannedDeliveryTime || !!this.params.detail.plannedInstallationTime) {
          this.creatFunction()
        } else {
          this.loading = false
          this.$message.warning('预约送货时间或预约安装时间需添加一个')
          return false
        }
      } else if ((!!this.deliveryOwner || !!this.deliveryFacilitator.length) && (!!this.installationOwner || !!this.installationFacilitator.length)) {
        if (!this.params.detail.plannedDeliveryTime) {
          this.loading = false
          this.$message.warning('已填入送货人员必须填写预约送货时间~')
          return false
        } else if (!this.params.detail.plannedInstallationTime && this.params.deliveryInstallModel === '0') {
          this.loading = false
          this.$message.warning('已填入安装人员必须填写预约安装时间~')
          return false
        } else if (!this.params.detail.plannedInstallationTime && this.params.deliveryInstallModel === '0') {
          this.loading = false
          this.$message.warning('已填入安装人员必须填写预约安装时间~')
          return false
        } else if (!this.params.detail.plannedDeliveryTime && this.params.deliveryInstallModel === '1') {
          this.loading = false
          this.$message.warning('已填入安装人员必须填写预约安装时间~')
          return false
        } else {
          this.creatFunction()
        }
      } else if ((!!this.deliveryOwner || !!this.deliveryFacilitator.length) && (!this.installationOwner && !this.installationFacilitator.length) && !this.params.detail.plannedInstallationTime) {
        if (!this.params.detail.plannedDeliveryTime) {
          this.loading = false
          this.$message.warning('已填入送货人员必须填写预约送货时间~')
          return false
        } else {
          this.creatFunction()
        }
      } else if ((!!this.installationOwner || !!this.installationFacilitator.length) && (!this.deliveryOwner && !this.deliveryFacilitator.length) && !this.params.detail.plannedDeliveryTime) {
        if (!this.params.detail.plannedInstallationTime) {
          this.loading = false
          this.$message.warning('已填入安装人员必须填写预约安装时间~')
          return false
        } else {
          this.creatFunction()
        }
      }
    }

    // 生成安装单函数
    creatFunction () {
      return new Promise((resolve, reject) => {
        this.createPlant({ ...this.createInstallation }).then(res => {
          res = JSON.parse(JSON.stringify(res))
          if (res.status && res.code === '200') {
            this.$message.success('生成安装单成功')
            this.loading = false
            this.emptyCondition()
            this.initData()
            resolve(res)
          }
        }).catch(error => {
          // this.$message.error('生成安装单error')
          this.loading = false
          console.log('生成安装单接口error', error)
        })
      })
    }

    // 清空配置安装订单的填写内容
    emptyCondition () {
      this.params.deliveryInstallModel = '0'
      this.params.driver = ''
      this.params.plateNum = ''
      this.params.detail.categoryType = ''
      this.params.detail.clsleve2Id = ''
      this.params.detail.deliveryFacilitator = []
      this.params.detail.deliveryOwner = ''
      this.params.detail.deliveryRemark = ''
      this.params.detail.installationFacilitator = []
      this.deliveryFacilitator = []
      this.deliveryOwner = ''
      this.installationOwner = ''
      this.deliveryRemark = ''
      this.installationFacilitator = []
      this.params.detail.installationOwner = ''
      this.params.detail.orderId = ''
      this.params.detail.plannedDeliveryTime = ''
      this.params.detail.plannedInstallationTime = ''
      this.params.detail.quantily = ''
    }

    // 删除
    deleteAll () {
      let deleteArr = []

      // 获取二级品类id
      const getClsleve2Id = (arr) => {
        const leve2 = arr.reduce((accumulator, { two, clsleve2Id }) => {
          two && accumulator.push({ id: clsleve2Id })
          return accumulator
        }, [])
        return this.duplicateRemovalArr(leve2)
      }

      // 处理订单数据格式
      const getOrdersId = (arr) => {
        arr.forEach((list, index) => {
          if (list.isProduct && list.two) {
            for (let name in this.productList) {
              if (list.orderId === name) {
                this.productList[name].forEach((prodList, prodIndex) => {
                  if (list.clsleve2Id === prodList.id) {
                    this.productList[name].splice(prodIndex, 1)
                  }
                })
              }
            }
          }
        })
        // 先过滤、再聚合 isProduct 是否为手动添加的标准品 是:true 否:false
        const ordersObj = arr.filter(list => !list.isProduct).reduce((accumulator, list) => {
          accumulator[list.orderId] = !accumulator[list.orderId] ? [list] : [...accumulator[list.orderId], list]
          return accumulator
        }, {})
        const ordersArr = []
        for (let id in ordersObj) {
          if (ordersObj[id].length) {
            const filterArray = getClsleve2Id(ordersObj[id])
            if (filterArray.length) {
              ordersArr.push({
                orderId: id,
                leve2: filterArray
              })
            }
          }
        }
        return ordersArr
      }
      let productList = JSON.stringify(this.productList)
      this.userData.forEach((list, index) => {
        if (list.All) {
          deleteArr.push({
            'custId': list.id,
            'orders': getOrdersId(list.newData)
          })
        }
      })
      this.twoLoading = true
      this.newDeleteRepertoire({ 'data': deleteArr }).then(res => {
        this.twoLoading = false
        if (res.status && res.code === '200') {
          this.$message.success('安装清单删除成功')
          this.isShowAllDeleteAll = false
          this.initData()
        }
      }).catch(error => {
        this.twoLoading = false
        this.productList = JSON.parse(productList)
        console.log('安装清单删除error', error)
      })
    }

    // 用户勾选
    allCheck (item) {
      this.userData.forEach((user, userI) => {
        if (user.All) {
          if (user.id === item.id) {
            user.newData.forEach((row, index) => {
              this.userData[userI].newData[index].one = true
              this.userData[userI].newData[index].two = true
            })
          }
        } else {
          if (user.id === item.id) {
            user.newData.forEach((row, index) => {
              this.userData[userI].newData[index].one = false
              this.userData[userI].newData[index].two = false
            })
          }
        }
      })
    }

    // 一级勾选
    oneCheck (item) {
      let oneLevel = []
      this.userData.forEach((user, userI) => {
        let allRow = []
        user.newData.forEach((row, index) => {
          if (row.oneNum) { // 捕获合同号第一条数据
            allRow.push(row)
          }
          if (item.id === row.id) { // 捕获相同合同自编号行
            oneLevel.push(row)
          }
        })
        user.newData.forEach((row, index) => {
          if (item.factoryContractNo === row.factoryContractNo) {
            if (oneLevel[0].one) { // 如果一级勾选二级全勾选
              this.userData[userI].newData[index].two = true
            } else {
              this.userData[userI].newData[index].two = false
            }
          }
        })
        let allCheck = allRow.some((someOne) => { // 判断用户勾选是否点亮
          return someOne.one === true
        })
        if (allCheck) {
          this.userData[userI].All = true
        } else {
          this.userData[userI].All = false
        }
      })
    }

    // 二级勾选
    twoCheck (item, leve2) {
      let checked = false
      let obj = {}
      this.userData.forEach((user, userI) => { // 取到二级品类的第一条数据
        if (user.newData.length) {
          user.newData.forEach(list => {
            if (list.clsleve2Id === item.clsleve2Id) {
              list.two = item.two
            }
          })
        }
        for (let i = user.newData.length - 1; i >= 0; i--) {
          if (user.newData[i].factoryContractNo === item.factoryContractNo) {
            obj[user.newData[i].factoryContractNo + user.newData[i].clsleve2Id] = user.newData[i].two
          }
        }
      })
      for (let key in obj) {
        if (obj[key]) {
          checked = true// 有一个二级品类勾选则checked为true
        }
      }
      if (checked) {
        this.userData.forEach((user, userI) => {
          user.newData.forEach((row, index) => {
            if (row.factoryContractNo === item.factoryContractNo) { // 有一个二级平类为真，用户和订单都勾选
              this.userData[userI].newData[index].one = true
              this.userData[userI].All = true
            }
          })
        })
      } else {
        this.userData.forEach((user, userI) => {
          let oneRow = []
          user.newData.forEach((row, index) => {
            if (row.factoryContractNo === item.factoryContractNo) { // 二级品类全部勾选则订单取消勾选
              this.userData[userI].newData[index].one = false
            }
            if (row.oneNum) {
              oneRow.push(row.one)
            }
          })
          let someUser = oneRow.some((someOne) => { // 如果订单都为false则用户勾选为false
            return someOne === true
          })
          if (!someUser) {
            this.userData[userI].All = false
          }
        })
      }
    }

    // 处理跨行
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let name = column.label
      if (name === '操作' || name === '工厂合同自编号' || name === '是否齐套' || name === '品牌' || name === '品类') {
        if (row.oneNum) {
          return {
            rowspan: row.oneNum,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (name === '二级品类' || name === '存放库位' || name === '数量') {
        if (row.twoNum && row.rowIndex === 1) {
          return {
            rowspan: row.twoNum,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }

    // 展开数据结构
    unfoldData (arrData) {
      this.userData = []
      arrData.forEach((list) => { // 客户
        if (!list.orders) {
          return
        }
        let newData = []
        list.orders.forEach((item, index) => { // 订单
          list.ordersId = list.orders[index].id
          let newData1 = []
          let oneNum = 0
          item.leve2.forEach((item1, index1) => { // 二级品类
            let categoryType = item1.categoryType * 1 || 0
            // 是否为手动添加的标准品 是:true 否:false
            let isProduct = item1.isProduct || false
            if (item1.leve3.length) {
              item1.leve3.forEach((item2, index2) => { // 三级品类
                oneNum += 1
                newData1.push({
                  ...item,
                  ...item1,
                  ...item2,
                  id: item2.id,
                  oneOrders: item,
                  twoOrders: item1,
                  treeOrders: item2,
                  isProduct: isProduct,
                  orderId: list.orders[index].id,
                  clsleve2Id: item.leve2[index1].id,
                  factoryContractNo: item.factoryContractNo,
                  categoryType: categoryType,
                  brand: list.orders[index].brand,
                  category: list.orders[index].category,
                  isComplete: list.orders[index].isComplete,
                  rowIndex: index2 + 1,
                  twoNum: item1.leve3.length
                })
              })
            }
          })
          if (newData1.length) {
            newData1[0].oneNum = oneNum
          }
          newData = newData.concat(newData1)// 合并数组
        })
        this.userData.push({
          ...list,
          newData: newData
        })
      })
    }

    // 跳转到打印页面
    print () {
      this.createInstallationList().then(res => {
        if (res.data) {
          this.$router.push({
            name: 'print-page',
            query: {
              ids: res.data
            }
          })
        }
      })
    }

    // 数组去重
    duplicateRemovalArr (arr) {
      if (!arr || !arr.length) { return [] }
      let newObj = {}
      return arr.reduce((accumulator, list) => {
        if (!newObj[list.id]) {
          newObj[list.id] = true
          accumulator.push(list)
        }
        return accumulator
      }, [])
    }

    @Watch('tableData')
    tableDataChange (tableData) {
      this.unfoldData(this.tableData)
    }

    @Watch('isShowDeliveryOrder')
    isShowDeliveryOrderChange (isShowDeliveryOrder) {
      if (isShowDeliveryOrder) {
        this.initData()
      }
    }

    created () {
      this.initData()
      this.productList = {}
      // 处理数据
    }
  }
</script>

<style  lang="scss">
  .title {
    text-align: center;
    .el-button {
      float: right;
      padding: 0;
      margin-right: 40px;
    }
  }
  .plan {
    .el-input {
      width: 60%;
    }
  }
  .auto_input{
    .el-input {
      width: 80%;
    }
  }
  .userTitle {
    margin-left: 10px;
    font-weight: 600;
    color: #666;
  }

  .clientTable {
    margin-top: 2em;
  }

  .mulCheck{
    .el-tag--mini{
      margin: 0 5px;
    }
  }
  .checkTag{
    color:#606266;
    background-color: #d9d9d9;
  }

  .deliveryOrder{
    .el-form-item__content {
      line-height: 28px;
    }
    .el-dialog__title{
      font-weight: bold;
    }
  }
  .width170{
    width: 170px !important;
  }
  .width200{
    width: 200px !important;
  }
  .margin-top-5{
    margin-top: 5px;
  }
</style>
