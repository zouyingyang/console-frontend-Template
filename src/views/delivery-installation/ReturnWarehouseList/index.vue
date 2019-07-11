<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-loading="loading" :max-height="tableHeight">
      <el-tab-pane label="可返库列表" name="can">
        <Card>
          <el-col :span="24" slot="head">
            <el-row>
              <el-col :span="12">
                <el-button type="primary" @click="returnBunker" size="mini">批量返仓</el-button>
                <!--<el-button type="primary" size="mini" icon="el-icon-download">导出清单</el-button>-->
              </el-col>
              <el-col :span="12">
                <el-form :model="canParams" :inline="true" style="float: right;" @submit.native.prevent>
                  <el-form-item label="">
                    <el-tooltip class="item" effect="dark" content="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址" placement="top">
                      <el-input
                        class='www'
                        clearable
                        size="mini"
                        v-model="canParams.searchKeyword"
                        maxlength="100"
                        placeholder="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址"
                        @keyup.enter.native="submitSearch">
                      </el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item class="no-margin-right">
                    <el-button v-if="!isShowCanSearchFlag" size="mini" type="primary" @click="submitSearch">查询</el-button>
                    <el-button type="primary" size="mini" @click="isShowCanSearchFlag = !isShowCanSearchFlag">
                      {{isShowCanSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row :span="24" class="return-warehouse-list" v-show="isShowCanSearchFlag">
              <el-form :inline="true" class="demo-form-inline  returnList" @submit.native.prevent>
                <el-row class="crow1">
                  <el-col :span="8">
                    <el-form-item label="品牌" size="mini">
                      <el-select placeholder="选择品牌" size="mini" v-model="canParams.brand">
                        <el-option :key="item.value" :label="item.label" :value="item.value"
                                   v-for="item in options.brand"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品类" size="mini">
                      <el-select v-model="canParams.category" placeholder="请选择">
                        <el-option v-for="item in options.category" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出库人" size="mini">
                      <el-tag v-if="!canOutOwner.length" class="checkTag" size="mini">暂未选择出库人</el-tag>
                      <el-tag v-else closable @close="canOutOwnercloseTag" style="margin-right: 5px" v-for="(item,index) in canOutOwner" :key="index" size="mini">{{item.name}}</el-tag>
                      <el-button @click="canOutOwnerSearch" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="车辆" size="mini">
                      <!-- <el-input size="mini" v-model="canParams.plateNum" placeholder="请输入送货车辆"></el-input> -->
                      <el-autocomplete
                        clearable
                        class="auto_input"
                        :maxlength="20"
                        value-key="plateNum"
                        v-model="canParams.plateNum"
                        :fetch-suggestions="getAllPlateSelect"
                        @blur="blurSave('plateNum',canParams.plateNum)"
                        @select="autocompleteSelect('plateNum',arguments)"
                        placeholder="请输入送货车辆"
                       ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="司机" size="mini">
                      <!-- <el-input maxlength="20" size="mini" v-model="canParams.driver" placeholder="请输入司机"></el-input> -->
                      <el-autocomplete
                       class="auto_input"
                       clearable
                       :maxlength="20"
                       value-key="driver"
                       v-model="canParams.driver"
                       :fetch-suggestions="getAllDriverSelect"
                       @blur="blurSave('driver',canParams.driver)"
                       @select="autocompleteSelect('driver',arguments)"
                       placeholder="请输入司机"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="送货人" size="mini">
                      <el-tag v-if="!deliveryOwner.length" class="checkTag" size="mini">暂未选择送货人</el-tag>
                      <el-tag v-else closable @close="deliveryOwnercloseTag" style="margin-right: 5px" v-for="(item,index) in deliveryOwner" :key="index" size="mini">{{item.name}}</el-tag>
                      <el-button @click="deliveryOwnerSearch" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                      <el-form-item label="出库日期" size="mini">
                        <el-date-picker v-model="canOutTime"
                                        style="width:300px"
                                        size="mini"
                                        value-format="timestamp"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="预约送货日期" size="mini">
                        <div class="block">
                          <el-date-picker v-model="plannedDeliveryTime"
                                          style="width:300px"
                                          size="mini"
                                          value-format="timestamp"
                                          type="daterange"
                                          range-separator="至"
                                          start-placeholder="开始日期"
                                          end-placeholder="结束日期"
                                          :default-time="['00:00:00', '23:59:59']">
                          </el-date-picker>
                        </div>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="checkMaketTag">
                  <el-col :span="8">
                    <el-form-item label="商场名称" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场名称</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketName}}
                      </el-tag>
                      <el-button @click="showSearchStore" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商场编号" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketCode}}
                      </el-tag>
                      <el-button @click="showSearchStore" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="门店名称" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkStoreArr.length" class="checkTag" size="mini">暂未选择门店</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkStoreArr" :key="index" size="mini">{{item.shopName}}</el-tag>
                      <el-button @click="showSearchStoreById" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-row style="margin-bottom:22px;float:right;">
                      <el-button type="primary" size="mini" @click="advancedSearch">高级查询</el-button>
                      <el-button type="primary" size="mini" @click="emptySearch">清空所有条件</el-button>
                    </el-row>
                  </el-col>
                </el-row>

              </el-form>
            </el-row>
          </el-col>
          <ReuseTable
            slot="content"
            type="reportableLibrary"
            ref="reuseTableRef"
            @initData="initData"
            :tableHead="canTableHead"
            :tableData="tableData"
            :isCheck="true"
            :twoTableHead="twoTableHead"
          ></ReuseTable>

          <!--分页-->
          <el-pagination
            slot="foot"
            class="busPagin"
            @current-change="changeCurrentPage"
            @size-change="handleSizeChange"
            :current-page="params.pageNo"
            :page-size="params.pageSize"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </Card>

        <!--批量返仓-->
        <el-dialog title="确认返库"
                   class="returnedWindows"
                   v-loading="twoLoading"
                   :visible.sync="isShowReturnBunker"
                   :close-on-click-modal="false"
                   center>
          <el-form :model="returnWarehouseParams" class="return">
            <p>请确认是否返库<span class="red">{{totol}}件</span></p>
            <el-form-item label="返货原因" :rules="rules.bunkerReason">
              <el-select v-model="returnWarehouseParams.reason" size="mini" placeholder="请选择">
                <el-option v-for="item in options.returnBunkerReason" :key="item.value" :label="item.label"
                           :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="备注">
              <el-input maxlength="100" type="textarea" v-model="returnWarehouseParams.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isShowReturnBunker = false">取 消</el-button>
            <el-button v-if="returnWarehouseParams.reason" type="primary" @click="submitReturnBunker">确 定</el-button>
            <el-button v-else disabled type="primary">确 定</el-button>
          </div>
        </el-dialog>
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
          <SearchStore key="getstoreByid2"
                       :getstoreByid="getstoreByid"
                       :checkMaketArr="checkMaketArr"
                       :checkStoreArr="checkStoreArr"
                       @chooseStore="chooseStore"
                       :isShow="isShowSearchStore"></SearchStore>
        </el-dialog>
        <!--责任人选择弹窗-->
        <el-dialog
          class="deliveryAndSetter"
          :title="choose?'':'人员选择'"
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
      </el-tab-pane>
      <el-tab-pane label="已返库列表" name="did">
        <Card>
          <el-col :span="24" slot="head">
            <el-row>
              <!--<el-col :span="12">-->
                <!--<el-button type="primary" size="mini" icon="el-icon-download">导出清单</el-button>-->
              <!--</el-col>-->
              <el-col :span="24">
                <el-form :model="params" :inline="true" style="float: right;" @submit.native.prevent>
                  <el-form-item label="">
                    <el-tooltip class="item" effect="dark" content="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址" placement="top">
                      <el-input
                        maxlength="50"
                        class='www'
                        clearable
                        size="mini"
                        v-model="didParams.searchKeyword"
                        placeholder="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址"
                        @keyup.enter.native="submitSearch">
                      </el-input>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item>
                    <el-button v-if="!isShowDidSearchFlag" size="mini" type="primary" @click="submitSearch">查询</el-button>
                    <el-button type="primary" size="mini" @click="isShowDidSearchFlag = !isShowDidSearchFlag">
                      {{isShowDidSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row :span="24" class="return-warehouse-list" v-show="isShowDidSearchFlag">
              <el-form :inline="true" class="demo-form-inline  returnList" @submit.native.prevent>
                <el-row class="crow1">
                  <el-col :span="8">
                    <el-form-item label="品牌" size="mini">
                      <el-select placeholder="选择品牌" size="mini" v-model="didParams.brand">
                        <el-option :key="item.value" :label="item.label" :value="item.value"
                                   v-for="item in options.brand"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品类" size="mini">
                      <el-select v-model="didParams.category" placeholder="请选择">
                        <el-option v-for="item in options.category" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="出库人" size="mini">
                      <el-tag v-if="!didOutOwner.length" class="checkTag" size="mini">暂未选择出库人</el-tag>
                      <el-tag v-else closable @close="didOutOwnercloseTag" style="margin-right: 5px" v-for="(item,index) in didOutOwner" :key="index" size="mini">{{item.name}}</el-tag>
                      <el-button @click="didOutOwnerSearch" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="车辆" size="mini">
                      <!-- <el-input maxlength="20" size="mini" v-model="didParams.plateNum" placeholder="请输入送货车辆"></el-input> -->
                      <el-autocomplete
                        clearable
                        class="auto_input"
                        :maxlength="20"
                        value-key="plateNum"
                        v-model="didParams.plateNum"
                        :fetch-suggestions="getAllPlateSelect"
                        @blur="blurSave('plateNum',didParams.plateNum)"
                        @select="autocompleteSelect('plateNum',arguments)"
                        placeholder="请输入送货车辆"
                       ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="司机" size="mini">
                      <!-- <el-input maxlength="20" size="mini" v-model="didParams.driver" placeholder="请输入司机"></el-input> -->
                      <el-autocomplete
                       class="auto_input"
                       clearable
                       :maxlength="20"
                       value-key="driver"
                       v-model="didParams.driver"
                       :fetch-suggestions="getAllDriverSelect"
                       @blur="blurSave('driver',didParams.driver)"
                       @select="autocompleteSelect('driver',arguments)"
                       placeholder="请输入司机"
                      ></el-autocomplete>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="返库人" size="mini">
                      <el-tag v-if="!returnOwner.length" class="checkTag" size="mini">暂未选择出库人</el-tag>
                      <el-tag v-else closable @close="returnOwnercloseTag" style="margin-right: 5px" v-for="(item,index) in returnOwner" :key="index" size="mini">{{item.name}}</el-tag>
                      <el-button @click="returnOwnerSearch" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="出库日期" size="mini">
                      <el-date-picker style="width:300px"
                        size="mini"
                        value-format="timestamp"
                        v-model="didOutTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="返库时间" size="mini">
                      <div class="block">
                        <el-date-picker v-model="returnTime"
                          style="width:300px"
                          size="mini"
                          value-format="timestamp"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="checkMaketTag">
                  <el-col :span="8">
                    <el-form-item label="商场名称" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场名称</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketName}}
                      </el-tag>
                      <el-button @click="showSearchStore" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商场编号" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketCode}}
                      </el-tag>
                      <el-button @click="showSearchStore" type="text">选择</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="门店名称" size="mini">
                      <el-tag style="margin-right: 5px" v-if="!checkStoreArr.length" class="checkTag" size="mini">暂未选择门店</el-tag>
                      <el-tag style="margin-right: 5px" v-else  v-for="(item,index) in checkStoreArr" :key="index" size="mini">{{item.shopName}}</el-tag>
                    </el-form-item>
                    <el-button @click="showSearchStoreById" type="text">选择</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-row style="margin-bottom:22px;float:right;">
                      <el-button type="primary" size="mini" @click="advancedSearch ">高级查询</el-button>
                      <el-button type="primary" size="mini" @click="emptySearch">清空所有条件</el-button>
                    </el-row>
                  </el-col>
                </el-row>

              </el-form>
            </el-row>
          </el-col>

          <ReuseTable
            slot="content"
            :tableHead="didTableHead"
            type="antiLibrary"
            :tableData="tableData"
            :twoTableHead="twoTableHead"
          ></ReuseTable>
          <!--分页-->
          <el-pagination
            slot="foot"
            class="busPagin"
            @current-change="changeCurrentPage"
            @size-change="handleSizeChange"
            :current-page="params.pageNo"
            :page-size="params.pageSize"
            layout="total, prev, pager, next"
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
            key="getstoreByid2"
            :getstoreByid="getstoreByid"
            :checkMaketArr="checkMaketArr"
            :checkStoreArr="checkStoreArr"
            @chooseStore="chooseStore"
            :isShow="isShowSearchStore">
          </SearchStore>
        </el-dialog>
        <!--责任人选择弹窗-->
        <el-dialog
          class="deliveryAndSetter"
          :title="choose?'':'责任人选择'"
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { Component, Watch, Vue } from 'vue-property-decorator'
import ReuseTable from '../FullInfoTable/components/ReuseTable.vue'
import Card from '@/components/Card'
import SearchStore from '../OrderDispatchList/components/SearchStore'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import { namespace } from 'vuex-class'

const deliveryInstallationList = namespace('delivery-installation/deliveryInstallationList')
const returnWarehouseList = namespace('delivery-installation/returnWarehouseList')

  @Component({
    components: { ReuseTable, Card, SearchStore, DeliveryAndSetter }
  })
export default class ReceiveList extends Vue {
    tableHeight = 0
    loading = false
    total = 0
    idsArr = []
    checkOwnerType = null // 选择的责任人类型
    canOutOwner = [] // 已选出库人
    didOutOwner = [] // 已选出库人
    returnOwner = [] // 返库人
    activeName = 'can' // tabs默认选中
    isShowCanSearchFlag = false // 是否展示高级搜索
    isShowDidSearchFlag = false // 是否展示高级搜索
    twoLoading = false // 二级弹窗
    isShowReturnBunker = false // 是否弹窗批量返仓
    totol = 0// 返库总数
    isShowDeliveryMan = false // 送货安装工弹窗
    deliveryOwner = '' // 送货责任人
    choose = false // 送货安装工责任人--false 协助人--true
    type = 1// 安装责任人弹窗请求数据类型 1-送货员 2-安装工
    canOutTime = [] // 可返库出库时间
    didOutTime = [] // 已返库出库时间
    returnTime = [] // 返库时间
    plannedDeliveryTime = [] // 计划送货时间
    isShowSearchStore = false // 查询商场弹窗
    getstoreByid = false // 是否通过
    checkMaketArr = [] // 选择的商场数组
    didCheckMaketArr = [] // 已返库选择的商场数组
    canCheckMaketArr = [] // 可返库选择的商场数组
    checkStoreArr = [] // 选择的商场数组
    didCheckStoreArr = [] // 已返库选择的商场数组
    canCheckStoreArr = [] // 可返库选择的商场数组
    returnWarehouseParams = {// 批量返仓参数
      ids: '',
      remark: '',
      reason: ''
    }
    params = {}
    canParams = {
      searchKeyword: '', // 搜索内容
      brand: '', // 品牌
      category: '', // 品类
      outOwner: '', // 出库责任人
      plateNum: '', // 车辆
      driver: '', // 司机
      deliveryOwner: '', // 送货责任人
      returnTimeStart: '', // 返库开始时间
      returnTimeEnd: '', // 返库结束时间
      plannedDeliveryTimeBegin: '', // 预约送货开始时间
      plannedDeliveryTimeEnd: '', // 预约送货结束时间
      agentName: '', // 商场名称
      agentNo: '', // 商场编码
      store: '', // 门店
      pageNum: 1,
      pageSize: 10,
      status: '70'
    }
    didParams = {
      searchKeyword: '', // 搜索内容
      brand: '', // 品牌
      category: '', // 品类
      outOwner: '', // 出库责任人
      plateNum: '', // 车辆
      driver: '', // 司机
      returnOwner: '', // 返库责任人
      returnTimeStart: '', // 返库开始时间
      returnTimeEnd: '', // 返库结束时间
      outTimeStart: '', // 出库开始时间
      outTimeEnd: '', // 出库结束时间
      agentName: '', // 商场名称
      agentNo: '', // 商场编码
      store: '', // 门店
      pageNum: 1,
      pageSize: 10,
      status: '2'
    }
    rules = { // 批量返货原因
      bunkerReason: {
        required: true,
        message: '请填写批量返货原因说明',
        trigger: 'blur'
      }
    }
    options = {
      brand: [
        { value: '', label: '全部' },
        { value: 'brand_oppein', label: '欧派' },
        { value: 'brand_oboli', label: '欧铂丽' },
        { value: 'brand_oboni', label: '欧铂尼' }],
      category: [
        { value: '', label: '全部' },
        { value: 'category_chugui', label: '橱柜' },
        { value: 'category_yigui', label: '集成家居' },
        { value: 'category_mumen', label: '木门' },
        { value: 'category_weiyu', label: '卫浴' },
        { value: 'category_qiangshi', label: '软装' },
        { value: 'category_jinshumenchuang', label: '金属门窗' }
      ],
      returnBunkerReason: [
        { // 批量返货原因选项
          value: '1',
          label: '客户不在家'
        }, {
          value: '2',
          label: '堵车或其他路况'
        }, {
          value: '3',
          label: '客户改时间'
        }, {
          value: '4',
          label: '其他原因'
        }]
    }
    tableData = []// 列表数据
    canTableHead=[ // 可返库一级表头
      { name: '送货安装单号', value: 'installNo', isRowspan: true },
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'mobilePhone', isRowspan: true },
      { name: '客户地址', value: 'address', isRowspan: true },
      { name: '送货车辆', value: 'plateNum', isRowspan: true },
      { name: '司机', value: 'driver', isRowspan: true },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '状态', value: 'status' },
      { name: '是否送装分离', value: 'deliveryInstallModel' },
      { name: '出库时间', value: 'stockOutTime' },
      { name: '出库人', value: 'stockOutBy' },
      { name: '送货责任人', value: 'deliveryOwnerName' },
      { name: '送货协助人', value: 'deliveryFacilitatorName' },
      { name: '安装责任人', value: 'installationOwnerName' },
      { name: '安装协助人', value: 'installationFacilitatorName' },
      { name: '预约送货时间', value: 'plannedDeliveryTime' },
      { name: '预约安装时间', value: 'plannedInstallationTime' },
      { name: '送货备注', value: 'deliveryRemark' },
      { name: '安装备注', value: 'installRemark' },
      { name: '送货完成备注', value: 'deliveryCompleteRemark' },
      { name: '安装完成备注', value: 'installCompleteRemark' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编号', value: 'marketCode' },
      { name: '门店', value: 'shopName' }
    ]
    didTableHead=[ // 已返库一级表头（返库数量没有字段）
      { name: '送货安装单号', value: 'installNo', isRowspan: true },
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'customerTel', isRowspan: true },
      { name: '客户地址', value: 'customerAddress', isRowspan: true },
      { name: '送货车辆', value: 'plateNum', isRowspan: true },
      { name: '司机', value: 'driver', isRowspan: true },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '返库数量', value: 'stockQuantity' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '状态', value: 'status' },
      { name: '出库时间', value: 'stockOutTime' },
      { name: '出库人', value: 'stockOutBy' },
      { name: '返库时间', value: 'returnTime' },
      { name: '返库人', value: 'returnByName' },
      { name: '返库原因', value: 'reason' },
      { name: '返库备注', value: 'returnRemark' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编号', value: 'marketCode' },
      { name: '门店', value: 'shopName' }
    ]

    twoTableHead = [
      { name: '品类', value: 'category' },
      { name: '出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'clsleve2StockPosition' },
      { name: '状态', value: 'status' },
      { name: '是否送装分离', value: 'deliveryInstallModel' },
      { name: '出库时间', value: 'dispatchTime' },
      { name: '出库人', value: 'dispatchUserName' }
    ]

    // 查询送货安装单列表接口
    @deliveryInstallationList.Action deliveryDispatch
    // 批量返仓
    @returnWarehouseList.Action mulReturnStock
    // 获取司机列表
    @deliveryInstallationList.Action driverList
    // 获取车辆列表
    @deliveryInstallationList.Action plateNumList
    // 保存司机和送货车辆信息
    @deliveryInstallationList.Action saveDriverAndPlateNum

    // 初始化数据
    initData (pageNum = 1, searchKeyword) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      let params = {}
      if (searchKeyword) {
        params.searchKeyword = this.params.searchKeyword
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
      } else {
        params = JSON.parse(JSON.stringify(this.params))
        // 出库时间
        if (this.canOutTime && this.activeName === 'can') {
          params.outTimeStart = this.canOutTime[0]
          params.outTimeEnd = this.canOutTime[1]
        } else if (this.didOutTime && this.activeName === 'did') {
          params.outTimeStart = this.didOutTime[0]
          params.outTimeEnd = this.didOutTime[1]
        } else {
          params.outTimeStart = null
          params.outTimeEnd = null
        }
        if (this.params.hasOwnProperty('plannedDeliveryTimeBegin') && params.plannedDeliveryTime && this.activeName === 'can') {
          params.plannedDeliveryTimeBegin = this.plannedDeliveryTime[0]
          params.plannedDeliveryTimeEnd = this.plannedDeliveryTime[1]
        } else {
          params.plannedDeliveryTimeBegin = null
          params.plannedDeliveryTimeEnd = null
        }
        if (this.returnTime && this.params.hasOwnProperty('returnTimeStart') && this.activeName === 'did') {
          params.returnTimeStart = this.returnTime[0]
          params.returnTimeEnd = this.returnTime[1]
        } else {
          params.returnTimeStart = null
          params.returnTimeEnd = null
        }
        if (this.activeName === 'can') {
          params.outOwner = this.canOutOwner.length ? this.canOutOwner[0].id : ''
          params.deliveryOwner = this.deliveryOwner.length ? this.deliveryOwner[0].id : ''
        } else {
          params.outOwner = this.didOutOwner.length ? this.didOutOwner[0].id : ''
          params.returnOwner = this.returnOwner.length ? this.returnOwner[0].id : ''
        }
      }
      this.loading = true
      this.deliveryDispatch({ ...params }).then(res => {
        console.log('获取返库列表res', res)
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
        console.log('获取返库列表error', error)
        this.loading = false
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
    // 出库责任人选择
    canOutOwnerSearch () {
      this.checkOwnerType = 'canOutOwner'
      this.isShowDeliveryMan = true
    }
    // 出库责任人选择
    didOutOwnerSearch () {
      this.checkOwnerType = 'didOutOwner'
      this.isShowDeliveryMan = true
    }
    // 送货责任人选择
    deliveryOwnerSearch () {
      this.checkOwnerType = 'deliveryOwner'
      this.isShowDeliveryMan = true
    }
    // 返库责任人选择
    returnOwnerSearch () {
      this.checkOwnerType = 'returnOwner'
      this.isShowDeliveryMan = true
    }

    submitSearch () {
      this.initData(false, true)
    }

    // 责任人移除
    canOutOwnercloseTag (data) {
      this.canOutOwner = []
    }
    didOutOwnercloseTag (data) {
      this.didOutOwner = []
    }
    deliveryOwnercloseTag (data) {
      this.deliveryOwner = []
    }
    returnOwnercloseTag (data) {
      this.returnOwner = []
    }
    // 选择责任人关闭
    chose (data) {
      if (this.checkOwnerType === 'canOutOwner') {
        this.canOutOwner = []
        this.canOutOwner.push(data)
      } else if (this.checkOwnerType === 'deliveryOwner') {
        this.deliveryOwner = []
        this.deliveryOwner.push(data)
      } else if (this.checkOwnerType === 'didOutOwner') {
        this.didOutOwner = []
        this.didOutOwner.push(data)
      } else if (this.checkOwnerType === 'returnOwner') {
        this.returnOwner = []
        this.returnOwner.push(data)
      }
      this.isShowDeliveryMan = false
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
      console.log('商场查询反写', data)
      if (this.getstoreByid) {
        if (this.activeName === 'can') {
          this.canCheckStoreArr = data
          this.checkStoreArr = data
        } else {
          this.didCheckStoreArr = data
          this.checkStoreArr = data
        }
      } else {
        if (this.activeName === 'can') {
          this.canCheckMaketArr = data
          this.checkMaketArr = data
        } else {
          this.didCheckMaketArr = data
          this.checkMaketArr = data
        }
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
      console.log(this.checkMaketArr, this.checkStoreArr)
    }
    // 高级搜索
    advancedSearch () {
      this.initData()
    }
    handleClick (tab, event) {
      this.activeName === 'can' ? this.checkMaketArr = this.canCheckMaketArr : this.checkMaketArr = this.didCheckMaketArr
      this.activeName === 'can' ? this.checkStoreArr = this.canCheckStoreArr : this.checkStoreArr = this.didCheckStoreArr
      this.activeName === 'can' ? this.params = this.canParams : this.params = this.didParams
      this.initData()
    }
    // 清空查询
    emptySearch () {
      this.params.marketId = ''
      this.params.store = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.params.searchKeyword = ''
      this.checkMaketArr = []
      this.checkStoreArr = []
      if (this.activeName === 'can') {
        this.canOutOwner = []
        this.deliveryOwner = []
        this.canOutTime = []
        this.plannedDeliveryTime = []
        this.canParams.brand = ''
        this.canParams.category = ''
        this.canParams.outOwner = ''
        this.canParams.plateNum = ''
        this.canParams.driver = ''
        this.canParams.deliveryOwner = ''
      } else {
        this.didOutOwner = []
        this.returnOwner = []
        this.returnTime = []
        this.didOutTime = []
        this.didParams.brand = ''
        this.didParams.category = ''
        this.didParams.outOwner = ''
        this.didParams.plateNum = ''
        this.didParams.driver = ''
        this.didParams.deliveryOwner = ''
      }
    }

    // 弹窗批量返仓
    returnBunker () {
      this.getReuseTableData()
      if (this.idsArr.length) {
        this.isShowReturnBunker = true
        this.returnWarehouseParams.remark = ''
        this.returnWarehouseParams.reason = ''
      }
    }
    // 重置返仓弹窗参数
    clearReturnWarehouseParams () {
      this.returnWarehouseParams.remark = ''
      this.returnWarehouseParams.reason = ''
    }
    // 确定批量返仓
    submitReturnBunker () {
      this.twoLoading = true
      this.returnWarehouseParams.ids = this.idsArr.join(',')
      this.mulReturnStock({ ...this.returnWarehouseParams }).then(res => {
        this.twoLoading = false
        if (res.status && res.code === '200') {
          this.$message.success('批量返仓成功')
          this.isShowReturnBunker = false
          this.initData()
        }
      }).catch(error => {
        this.twoLoading = false
        // this.$message.warning('批量返仓失败error')
        console.log('批量返仓失败error', error)
        this.isShowReturnBunker = false
      })
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

    // 获取列表选择数据
    getReuseTableData () {
      this.idsArr = []
      this.$refs.reuseTableRef.getCheckedData().forEach(list => {
        if (list.userChecked) {
          this.idsArr.push(list.id)
        }
        if (list.userChecked && list.checked) {
          this.totol += list.stockOut * 1
        }
      })
      if (!this.idsArr.length) {
        this.$message.warning('您还没有选择订单')
        return false
      }
      return this.idsArr
    }
    @Watch('isShowReturnBunker')
    isShowReturnBunkerChange (isShowReturnBunker) {
      if (isShowReturnBunker) {
        this.clearReturnWarehouseParams()
      }
    }

    created () {
      this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
      this.activeName = 'can'
      this.checkMaketArr = this.canCheckMaketArr
      this.checkStoreArr = this.canCheckStoreArr
      this.params = this.canParams
      this.initData()
    }
  }

</script>

<style src="./style.scss"  lang="scss">
  .auto_input{
    .el-input {
      width: 80%;
    }
  }
</style>
