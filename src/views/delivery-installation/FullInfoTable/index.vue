<template>
  <div>
    <div class="my-full-info-table" v-show="!$route.meta.hidden">
      <Card v-loading="loading">
        <el-col :span="24" slot="head">
          <el-col :span="24">
            <el-form :model="params" :inline="true" class="op-text-right" @submit.native.prevent>
              <el-form-item label="" class="op-left no-margin-bottom">
                <el-button @click="fullScaleDerivation" size="mini" type="primary">导出</el-button>
              </el-form-item>
              <el-form-item class="no-margin-bottom op-left" v-show="!seniorSearchFlag">
                <!-- <el-checkbox v-model="ordinaryParams.localStore" label=true @change="initData">本商场</el-checkbox> -->
                <el-checkbox v-model="ordinaryParams.serviceNoComplete" label="2" @change="initData">客户齐套</el-checkbox>
                <el-checkbox v-model="ordinaryParams.isComplete" label=true @change="initData">订单齐套</el-checkbox>
                <el-checkbox v-model="ordinaryParams.servicenoIsComplete" label=true @change="initData">服务单是否齐套</el-checkbox>
                <el-checkbox-group class="op-right" v-model="nDays" @change="chooseNDay">
                  <el-checkbox class="margin-right" label="5" >5天内到期</el-checkbox>
                  <el-checkbox class="margin-right" label="3" >3天内到期</el-checkbox>
                </el-checkbox-group>
                <el-checkbox v-model="ordinaryParams.isExpired" label=true @change="initData">过期</el-checkbox>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-tooltip class="item" effect="dark" content="客户名称、客户手机号、客户地址、工厂合同自编号、服务单单号" placement="top">
                  <el-input
                    size="mini"
                    clearable
                    @keyup.enter.native="initData"
                    maxlength="100"
                    placeholder="客户名称、客户手机号、客户地址、工厂合同自编号"
                    v-model="params.searchKeyword">
                  </el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item class="no-margin-bottom no-margin-right">
                <el-button size="mini" type="primary" @click="initData" v-show="!seniorSearchFlag">
                  查询
                </el-button>
                <el-button type="primary" size="mini" @click="seniorSearchFlag = !seniorSearchFlag">
                  {{seniorSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" v-show="seniorSearchFlag" class="op-margin-top-20">
            <el-form :model="params" :inline="true">
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="客户是否齐套" size="mini">
                          <el-checkbox-group @change="chooseserviceNoComplete" class="op-right" v-model="serviceNoComplete" >
                            <el-checkbox  label="2" name="serviceNoComplete">已齐套</el-checkbox>
                            <el-checkbox  label="1" name="serviceNoComplete">部分齐套</el-checkbox>
                            <el-checkbox  label="0" name="serviceNoComplete">未收货</el-checkbox>
                          </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="订单是否齐套" size="mini">
                        <el-checkbox-group @change="chooseisComplete" class="op-right" v-model="isComplete" >
                          <el-checkbox  label="2" name="isComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="isComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="isComplete">未收货</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="验收结果" size="mini">
                        <el-checkbox-group @change="chooseIsPass" class="op-right" v-model="isPass" >
                          <el-checkbox  label="1" name="isPass">通过</el-checkbox>
                          <el-checkbox  label="0" name="isPass">不通过</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="品牌" size="mini">
                        <el-select placeholder="选择品牌" size="mini" v-model="params.brand">
                          <el-option :key="item.value" :label="item.label" :value="item.value"
                                     v-for="item in options.brand"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="品类" size="mini">
                        <el-select placeholder="选择品类" size="mini" v-model="params.category">
                          <el-option :key="item.value" :label="item.label" :value="item.value"
                                     v-for="item in options.category"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="订单状态" size="mini">
                        <el-select placeholder="选择选择订单状态" size="mini" v-model="params.status">
                          <el-option :key="item.value" :label="item.label" :value="item.value"
                                     v-for="item in options.status"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row >
                    <el-col :span="8">
                      <el-form-item label="合同交期" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="expectDate"
                          size="mini"
                          style="width: 260px;"
                          unlink-panels
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="工厂交期" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="factoryExpDat"
                          size="mini"
                          unlink-panels
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
                      <el-form-item label="收货齐套时间" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="srvCompleteDate"
                          size="mini"
                          unlink-panels
                          style="width: 260px;"
                          type="datetimerange"
                          :default-time="['10:00:00']"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="checkMaketTag">
                    <el-col :span="8">
                      <el-form-item label="商场名称" size="mini">
                        <el-tag v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                        <el-tag v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketName}}
                        </el-tag>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="商场编号" size="mini">
                        <el-tag v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                        <el-tag v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketCode}}
                        </el-tag>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="门店名称" size="mini">
                        <el-tag v-if="!checkStoreArr.length" class="checkTag" size="mini">暂未选择门店</el-tag>
                        <el-tag v-else  v-for="(item,index) in checkStoreArr" :key="index" size="mini">{{item.shopName}}</el-tag>
                        <el-button @click="showSearchStoreById" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="查询维度" size="mini">
                        <el-select @change="dimChange" placeholder="选择查询维度" size="mini" v-model="params.dim">
                          <el-option
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            v-for="item in options.dim">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="维度责任人" size="mini">
                        <el-tag v-if="!dimOwner.length" class="checkTag" size="mini">暂未选择维度责任人</el-tag>
                        <el-tag v-else closable @close="closeTag" style="margin-right: 5px" v-for="(item,index) in dimOwner" :key="index" size="mini">{{item.name}}</el-tag>
                        <el-button @click="dimOwnerSearch" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="维度日期" size="mini">
                        <el-date-picker
                          v-if="!!params.dim"
                          value-format="timestamp"
                          v-model="dimDate"
                          size="mini"
                          unlink-panels
                          style="width: 280px;"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                        <el-date-picker
                          v-else
                          value-format="timestamp"
                          v-model="dimDate"
                          disabled=""
                          size="mini"
                          unlink-panels
                          style="width: 280px;"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row style="margin-bottom:22px;float:right;">
                    <el-button type="primary" size="mini" @click="initData">高级查询</el-button>
                    <el-button type="primary" size="mini" @click="clearSearch">清空所有条件</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-col>

        <ReuseTable
          slot="content"
          :tableHead="tableHead"
          :tableData="tableData"
          :twoTableHead="twoTableHead"
          @initData="initData(pageNum = 1)"
          type="all"
          :isCheck="false">
        </ReuseTable>
        <!-- 分页 -->
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
      <!--查询商场弹窗-->
      <el-dialog
        :visible.sync="isShowSearchStore"
        append-to-body
        :title="getstoreByid ? '查询门店':'查询商场'"
        width="40%"
        top="3.4%"
        center
        :close-on-click-modal="false"
        class="SearchStore">
        <SearchStore
          key="getstoreByid1"
          :getstoreByid="getstoreByid"
          :checkMaketArr="checkMaketArr"
          :checkStoreArr="checkStoreArr"
          @chooseStore="chooseStore"
          :isShow="isShowSearchStore">
        </SearchStore>
      </el-dialog>

      <!--维度责任人选择弹窗-->
      <el-dialog
        class="deliveryAndSetter"
        :title="choose?'':'维度责任人选择'"
        :visible.sync="isShowDeliveryMan"
        width="52%"
        height="45%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <DeliveryAndSetter
          :type="type"
          :choose="choose"
          @choseDeliveryInstallStaff="chose"
          :multipleValues="[]"
          :changeState="isShowDeliveryMan">
        </DeliveryAndSetter>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import axios from 'axios'
import CURRENT_ENV_PATH from '@/services/baseUrl.js'
import ReuseTable from './components/ReuseTable'
import SearchStore from '../OrderDispatchList/components/SearchStore'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import Card from '@/components/Card'
const moduleFullDose = namespace('delivery-installation/fullInfoTable')

  @Component({
    components: { ReuseTable, Card, SearchStore, DeliveryAndSetter }
  })
export default class FullInfoTable extends Vue {
    loading = false
    seniorSearchFlag = false // 显示隐藏高级搜索
    IMGURL = process.env.OSS_PATH
    small = '?x-oss-process=style/small'
    isShowSearchStore = false // 选择商场弹窗
    type = null
    choose = false
    isShowDeliveryMan = false
    dimOwner = []
    checkList = []
    nDays = [] // 几天内到期
    serviceNoComplete = [] // 客户是否齐套
    isComplete = [] // 订单是否齐套
    deliveryInstallModel = [] // 是否送装一体
    isPass = [] // 验收是否通过
    checkMaketArr = [] // 已选择的商场
    checkStoreArr = [] // 已选择的门店
    getstoreByid = false
    exportParams = {}
    ordinaryParams = {
      searchKeyword: '',
      // localStore: false, // 本商场
      serviceNoComplete: false, // 客户是否齐套
      isComplete: false, // 订单是否齐套
      servicenoIsComplete: false, // 服务单是否齐套
      isExpired: false, // 是否超期
      nDays: '', // 几天内
      pageNum: 1,
      pageSize: 10
    }
    params = {
      // localStore: '', // 本商场
      serviceNoComplete: '', // 客户是否齐套
      isComplete: '', // 订单是否齐套
      isExpired: '', // 是否超期
      searchKeyword: '', // 搜索字段
      nDays: '', // 几天内
      brand: '', // 品牌
      category: '', // 品类
      contentment: '', // 满意度
      // deliveryInstallModel: '', // 是否送装一体
      dispatch: '', // 送货员
      expectDateStart: '', // 合同交期 开始日期
      expectDatEnd: '', // 合同交期 结束日期
      factoryExpDateStart: '', // 工厂交期 开始日期
      factoryExpDatEnd: '', // 工厂交期 结束日期
      plannedTimeStart: '', // 预约时间 开始时间
      plannedTimeEnd: '', // 预约时间 结束时间
      // orderTimeStart: '', // 下单日期开始日期
      // orderTimEnd: '', // 下单时间 结束日期
      // plannedTimeStart: '', // 计划时间 开始时间
      // plannedTimeEnd: '', // 计划时间 结束时间
      isPass: false, // 验收是否通过
      marketName: '', // 商场名称
      marketNo: '', // 商场编号
      owner: '', // 责任人
      srvCompleteTimeStart: null, // 齐套时间 开始时间
      srvCompleteTimeEnd: null, // 齐套时间 结束时间
      status: '', // 订单状态
      store: '', // 门店
      dim: '', // 查询维度
      dimOwner: '', // 维度责任人
      dimTimeStart: null, // 查询维度开始时间
      dimTimeEnd: null, // 查询维度结束时间
      pageNum: 1,
      pageSize: 10
    }
    expectDate = [] // 合同交期时间
    // orderData = [] // 订单下单时间
    factoryExpDat = [] // 工厂计划交期
    srvCompleteDate = [] // 收货齐套时间
    dimDate = [] // 维度时间
    total = 0
    tableData = [] // 列表数据
    tableHead = [
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'mobilePhone', isRowspan: true },
      { name: '客户地址', value: 'address', isRowspan: true },
      { name: '服务号是否齐套', value: 'serviceNoComplete', isRowspan: true },
      { name: '查看详情', value: 'A111' },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '服务单是否齐套', value: 'servicenoIsComplete' },
      { name: '服务单单号', value: 'serviceNo' },
      { name: '客户跟踪', value: 'customerTracking' },
      { name: '订单内容', value: 'orderContent' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '订单是否齐套', value: 'isComplete' },
      { name: '收货齐套时间', value: 'srvCompleteTime' },
      { name: '库存数量', value: 'stockQuantity' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '工厂计划交期', value: 'expectDate' },
      { name: '合同交期', value: 'contractDeliverDt' },
      { name: '预约送货时间', value: 'plannedDeliveryTime' },
      { name: '预约安装时间', value: 'plannedInstallationTime' },
      { name: '是否过期', value: 'isExpired' },
      { name: '状态', value: 'status' },
      { name: '实际送货时间', value: 'deliveryTime' },
      { name: '送货责任人', value: 'deliveryOwner' },
      { name: '实际安装时间', value: 'installTime' },
      { name: '安装责任人', value: 'installationOwner' },
      { name: '送货协助人', value: 'deliveryFacilitator' },
      { name: '安装协助人', value: 'installationFacilitator' },
      { name: '验收时间', value: 'acceptanceTime' },
      { name: '验收人', value: 'acceptanceOwner' },
      { name: '验收结果', value: 'isPass' },
      // { name: '客户评价结果', value: 'custContentment' },
      // { name: '评价时间', value: 'custAppraisalTime' },
      { name: '订单下单时间', value: 'payDate' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编号', value: 'marketCode' },
      { name: '门店', value: 'store' },
      { name: '设计师', value: 'designer' },
      { name: '导购', value: 'shoppingGuide' },
      { name: '是否遗留单', value: 'leavelFlag' },
      { name: '服务单合同总金额', value: 'contractTotalAmount' },
      { name: '服务单已收款', value: 'contractPayedAmount' },
      { name: '服务单待收款', value: 'contractPayingAmount' },
      { name: '是否产生遗留', value: 'isLeftBehind' },
      { name: '是否验收', value: 'isAcceptance' },
      { name: '是否评价', value: 'isEvaluated' },
      { name: '送货次数', value: 'deliveryTimes' },
      { name: '安装次数', value: 'installationTimes' }
    ]
    twoTableHead = [
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '收货是否齐套', value: 'isComplete' },
      { name: '收货齐套时间', value: 'srvCompleteTime' },
      { name: '库存数量', value: 'stockQuantity' },
      { name: '存放库位', value: 'stockPosition' },
      // { name: '工厂计划交期', value: 'expectDate' },
      // { name: '合同交期', value: 'contractDeliverDt' },
      { name: '预约送货时间', value: 'bookDeliveryDate' },
      { name: '预约安装时间', value: 'bookInstallDate' },
      // { name: '是否过期', value: 'isExpired' },
      { name: '状态', value: 'status' },
      { name: '实际送货时间', value: 'deliveryTime' },
      { name: '送货责任人', value: 'deliveryOwner' },
      { name: '实际安装时间', value: 'installTime' },
      { name: '安装责任人', value: 'installationOwner' },
      { name: '送货协助人', value: 'deliveryFacilitator' },
      { name: '安装协助人', value: 'installationFacilitator' }
      // { name: '验收时间', value: 'acceptanceTime' },
      // { name: '验收人', value: 'acceptanceOwner' },
      // { name: '验收结果', value: 'isPass' },
      // { name: '客户评价结果', value: 'custContentment' },
      // { name: '评价时间', value: 'custAppraisalTime' },
      // { name: '商场名称', value: 'marketName' },
      // { name: '商场编号', value: 'marketNo' },
      // { name: '门店', value: 'store' }
    ]
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
      ],
      // 查询维度
      dim: [
        { value: '', label: '全部' },
        { value: '0', label: '出库' },
        { value: '1', label: '送货' },
        { value: '2', label: '安装' },
        { value: '3', label: '验收' }
      ]
    }

    @moduleFullDose.Action getInfoList
    @moduleFullDose.Action bathFullInfoExport

    initData (pageNum = 1) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      if (!this.seniorSearchFlag) {
        let params = JSON.parse(JSON.stringify(this.ordinaryParams))
        if (this.nDays.join('') * 1) {
          params.nDays = this.nDays.join('') * 1
        } else {
          params.nDays = ''
        }
        params.pageNum = this.params.pageNum
        params.serviceNoComplete = params.serviceNoComplete === true ? params.serviceNoComplete * 2 : null
        params.isComplete = params.isComplete === true ? params.isComplete * 2 : null
        // params.localStore = params.localStore === true ? params.localStore * 1 : null
        params.isExpired = params.isExpired === true ? params.isExpired * 1 : null
        params.servicenoIsComplete = params.servicenoIsComplete === true ? params.servicenoIsComplete * 2 : null
        params.isPass = this.isPass.length ? this.isPass[0] * 1 : null
        params.searchKeyword = this.params.searchKeyword
        this.getAllList(params)
        this.exportParams = params
        return
      }

      // 合同交期时间
      if (this.expectDate && this.expectDate.length) {
        this.params.expectDateStart = this.expectDate[0]
        this.params.expectDatEnd = this.expectDate[1]
      } else {
        this.params.expectDateStart = null
        this.params.expectDatEnd = null
      }

      // 工厂计划交期
      if (this.factoryExpDat && this.factoryExpDat.length) {
        this.params.factoryExpDateStart = this.factoryExpDat[0]
        this.params.factoryExpDatEnd = this.factoryExpDat[1]
      } else {
        this.params.factoryExpDateStart = null
        this.params.factoryExpDatEnd = null
      }

      // 收货齐套时间
      if (this.srvCompleteDate && this.srvCompleteDate.length) {
        this.params.srvCompleteTimeStart = this.srvCompleteDate[0]
        this.params.srvCompleteTimeEnd = this.srvCompleteDate[1]
      } else {
        this.params.srvCompleteTimeStart = null
        this.params.srvCompleteTimeEnd = null
      }

      // 查询维度时间
      if (this.dimDate && this.dimDate.length) {
        this.params.dimTimeStart = this.dimDate[0]
        this.params.dimTimeEnd = this.dimDate[1]
      } else {
        this.params.dimTimeStart = null
        this.params.dimTimeEnd = null
      }
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.serviceNoComplete.length) {
        params.serviceNoComplete = this.serviceNoComplete[0] * 1
      } else {
        params.serviceNoComplete = params.serviceNoComplete === true ? params.serviceNoComplete * 1 : null
      }
      if (this.isComplete.length) {
        params.isComplete = this.isComplete[0] * 1
      } else {
        params.isComplete = params.isComplete === true ? params.isComplete * 1 : null
      }
      params.isPass = this.isPass.length ? this.isPass[0] * 1 : null
      // params.localStore = params.localStore === true ? params.localStore * 1 : null
      params.isExpired = params.isExpired === true ? params.isExpired * 1 : null
      if (this.dimOwner.length) {
        params.dimOwner = this.dimOwner[0].id
      } else {
        params.dimOwner = null
      }
      this.getAllList(params)
      this.exportParams = params
    }

    // 数据初始化
    getAllList (params) {
      this.loading = true
      this.getInfoList(params).then(res => {
        // console.log('获取订单信息全量表res', res)
        this.loading = false
        if (res.status && res.code === '200') {
          if (res.data.list.length) {
            this.tableData = JSON.parse(JSON.stringify(res.data.list))
            this.total = res.data.total
          } else {
            this.tableData = []
            this.total = 0
          }
        }
      }).catch(error => {
        this.total = 0
        console.log('获取订单信息全量表error', error)
        this.loading = false
      })
    }
    // 维度选择改变
    dimChange (data) {
      if (data === '') {
        this.dimDate = []
        this.dimOwner = []
      }
    }
    // 维度责任人移除
    closeTag (data) {
      if (data.isTrusted) {
        this.dimOwner = []
      }
    }
    // 维度责任人选择
    dimOwnerSearch () {
      if (this.params.dim === '') {
        this.$message.warning('选择查询维度为全部不能选取责任人~')
        return
      } else {
        this.type = null
      }
      this.isShowDeliveryMan = true
    }

    // 选择责任人关闭
    chose (data) {
      this.dimOwner = []
      this.dimOwner.push(data)
      this.isShowDeliveryMan = false
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
    // 是否送装一体
    // chooseDeliveryInstallModel (data) {
    //   let arr = [...data]
    //   if (arr.length > 1) {
    //     this.deliveryInstallModel = []
    //     this.deliveryInstallModel.push(arr[1])
    //   }
    // }
    // 验收是否通过
    chooseIsPass (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.isPass = []
        this.isPass.push(arr[1])
      }
    }

    // 查询商场弹窗
    showSearchStore () {
      this.getstoreByid = false
      this.isShowSearchStore = true
    }
    // 根据商场id查询门店信息
    showSearchStoreById () {
      if (this.checkMaketArr.length) {
        this.getstoreByid = true
        this.isShowSearchStore = true
      } else {
        this.$message.warning('您要选取门店信息须先选择对应商场~')
      }
    }

    // 商场查询反写
    chooseStore (data) {
      // console.log('商场查询反写', data)
      if (this.getstoreByid) {
        this.checkStoreArr = data
      } else {
        this.checkMaketArr = data
      }
      if (!this.getstoreByid) {
        this.params.marketName = ''
        this.params.marketNo = ''
        this.params.marketId = ''
        let marketName = []
        let marketNo = []
        let marketId = []
        if (this.checkMaketArr.length) {
          this.checkMaketArr.forEach((e, i) => {
            marketName.push(e.mainMarketName)
            marketNo.push(e.mainMarketCode)
            marketId.push(e.id)
          })
          this.params.marketName = marketName.length === 1 ? marketName[0] : marketName.join(',')
          this.params.marketNo = marketNo.length === 1 ? marketNo[0] : marketNo.join(',')
          this.params.marketId = marketId.length === 1 ? marketId[0] : marketId.join(',')
        }
      } else {
        this.params.store = ''
        let store = []
        if (this.checkStoreArr.length) {
          this.checkStoreArr.forEach((e, i) => {
            store.push(e.shopId)
          })
          this.params.store = store.length === 1 ? store[0] : store.join(',')
        }
      }
      this.isShowSearchStore = false
    }
    // 清空搜索条件
    clearSearch () {
      this.params.marketId = ''
      this.params.store = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.params.searchKeyword = ''
      this.dimOwner = []
      this.expectDate = [] // 合同交期时间
      this.factoryExpDat = [] // 工厂计划交期
      this.srvCompleteDate = [] // 收货齐套时间
      this.dimDate = [] // 维度时间
      this.nDays = [] // 几天内到期
      this.serviceNoComplete = [] // 客户是否齐套
      this.isComplete = [] // 订单是否齐套
      this.isPass = [] // 验收是否通过
      this.checkMaketArr = [] // 已选择的商场
      this.checkStoreArr = [] // 已选择的门店
      this.params.brand = ''
      this.params.category = ''
      this.params.status = ''
      this.params.dim = ''
      this.params.dimOwner = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.params.marketId = ''
      // this.params.localStore = false
      this.params.serviceNoComplete = false
      this.params.isComplete = false
      this.params.isExpired = false
    }
    // 换页控制
    changeCurrentPage (val) {
      this.initData(val)
    }
    // 单页数量控制
    handleSizeChange (val) {
      this.params.pageSize = val
      this.initData()
    }
    // 全量表导出
    fullScaleDerivation () {
      this.loading = true
      axios({
        method: 'post',
        baseURL: CURRENT_ENV_PATH.baseUrl,
        url: '/mtdssales-delivery/delivery/full_info_api/bathFullInfoExport',
        data: this.exportParams,
        responseType: 'blob'
      }).then(res => {
        // console.log('全量表导出res', res)
        this.loading = false
        let blob = res.data
        let anchor = document.createElement('a')
        anchor.download = '全量表导出数据.xlsx'
        anchor.href = URL.createObjectURL(blob)
        document.body.appendChild(anchor)
        anchor.click()
        this.$message.success('导出成功')
      }).catch((error) => {
        this.loading = false
        this.$message.error('导出失败,系统出现异常')
        console.log('全量表列表导出error', error)
      })
    }
    // 重置搜索参数
    paramsReset () {
      this.dimOwner = []
      this.params = {
        brand: '', // 品牌
        category: '', // 品类
        contentment: '', // 满意度
        deliveryInstallModel: '', // 是否送装一体
        dispatch: '', // 送货员
        expectDateStart: null, // 合同交期 开始日期
        expectDatEnd: null, // 合同交期 结束日期
        factoryExpDateStart: null, // 工厂交期 开始日期
        factoryExpDatEnd: null, // 工厂交期 结束日期
        plannedTimeStart: null, // 预约时间 开始时间
        plannedTimeEnd: null, // 预约时间 结束时间
        nDays: null, // 几天内
        isComplete: null, // 订单是否齐套
        isExpired: null, // 是否超期
        isPass: null, // 验收是否通过
        // localStore: '', // 本商场
        marketName: '', // 商场名称
        marketNo: '', // 商场编号
        owner: '', // 责任人
        serviceNoComplete: '', // 服务号是否齐套
        srvCompleteTimeEnd: null, // 齐套时间
        srvCompleteTimeStart: null, // 齐套时间
        status: '', // 订单状态
        store: '', // 门店
        dim: '', // 查询维度
        pageNum: 1,
        pageSize: 10
      }
    }
    created () {
      this.initData()
    }
  }
</script>

<style scoped src="./style.scss" lang="scss"></style>
