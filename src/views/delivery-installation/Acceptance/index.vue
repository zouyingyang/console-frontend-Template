<template>
  <div>
    <div class="my-delivery-installation-acceptance" v-show="!$route.meta.hidden">
      <Card>
        <div slot="head">
          <div class="toolbar">
            <!--<el-button type="primary" size="mini">导出清单</el-button>-->
            <!--//todo 验收有验收记录需要回写 暂不支持批量 dev1.1.2-->
            <!--<el-button type="primary" size="mini" @click="openDialog">批量验收</el-button>-->
            <div class="search-form">
              <el-tooltip class="item" effect="dark" content="工厂合同自编号、客户名称、客户手机号、客户地址" placement="top">
                <el-input
                  maxlength="50"
                  size="mini"
                  placeholder="工厂合同自编号、客户名称、客户手机号、客户地址"
                  @clear="getData"
                  @keyup.enter.native="getData"
                  clearable
                  inline
                  v-model="params.searchKeyword"
                  class="ele-input">
                </el-input>
              </el-tooltip>
              <el-button v-if="!seniorSearchFlag" type="primary" size="mini" @click="getData(false,true)">搜索</el-button>
              <el-button type="primary" size="mini" @click="seniorSearch">
                {{seniorSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
              </el-button>
            </div>
          </div>
          <el-col :span="24" v-show="seniorSearchFlag" class="seniorSearch">
            <el-form :model="params" :inline="true" class="acceptance-list">
              <el-row>
                <el-col :span="24">
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
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="是否送装一体" size="mini">
                        <el-checkbox-group size="mini" @change="chooseDeliveryInstallModel" class="op-right" v-model="deliveryInstallModel" >
                          <el-checkbox  label="1" name="deliveryInstallModel">是</el-checkbox>
                          <el-checkbox  label="0" name="deliveryInstallModel">否</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="验收结果" size="mini">
                        <el-checkbox-group size="mini" @change="chooseIsPass" class="op-right" v-model="isPass" >
                          <el-checkbox  label="1" name="isPass">通过</el-checkbox>
                          <el-checkbox  label="0" name="isPass">不通过</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="评价结果" size="mini">
                        <el-select placeholder="选择选择评价结果" size="mini" v-model="params.contentment">
                          <el-option :key="item.value" :label="item.label" :value="item.value"
                                     v-for="item in options.contentment"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row class="checkMaketTag">
                    <el-col :span="8">
                      <el-form-item label="商场名称" size="mini">
                        <el-tag style="margin-right: 5px;" v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                        <el-tag style="margin-right: 5px;" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketName}}
                        </el-tag>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="商场编号" size="mini">
                        <el-tag style="margin-right: 5px;"  v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场</el-tag>
                        <el-tag style="margin-right: 5px;" v-else  v-for="(item,index) in checkMaketArr" :key="index" size="mini">{{item.mainMarketCode}}
                        </el-tag>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="门店名称" size="mini">
                        <el-tag style="margin-right: 5px;" v-if="!checkStoreArr.length" class="checkTag" size="mini">暂未选择门店</el-tag>
                        <el-tag style="margin-right: 5px;" v-else  v-for="(item,index) in checkStoreArr" :key="index" size="mini">{{item.shopName}}</el-tag>
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
                        <el-tag closable @close="closeTag" style="margin-right: 5px" v-else v-for="(item,index) in dimOwner" :key="index" size="mini">{{item.name}}</el-tag>
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
                          unlink-panels
                          size="mini"
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
                    <el-button type="primary" size="mini" @click="getData">高级查询</el-button>
                    <el-button type="primary" size="mini" @click="clearAll">清空所有条件</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </div>
        <div class="acceptance-table" slot="content">
          <el-table
            cell-class-name="reuse-table-cell"
            :max-height="tableHeight"
            v-loading="loading"
            :data="acceptanceTable"
            :span-method="arraySpanMethod"
            ref="userOrderTable"
            @selection-change="userSelectionChange"
            @select="userCheckChange"
            @select-all="selectAll"
            size="mini"
            border>
            <!--//todo 验收有验收记录需要回写 暂不支持批量 dev1.1.2-->
            <!--<el-table-column align="center" type="selection" ></el-table-column>-->
            <el-table-column align="center" prop="customerName" label="客户姓名"></el-table-column>
            <el-table-column align="center" prop="mobilePhone" label="客户手机号" width="150"></el-table-column>
            <el-table-column align="center" prop="address" label="客户地址" width="200">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.address" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.address}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              label="验收">
              <template slot-scope="scope">
                <!--//todo 验收有验收记录需要回写 暂不支持批量 dev1.1.2-->
                <!--<el-checkbox-->
                  <!--@change="orderChange(arguments[0],scope.row)"-->
                  <!--v-model="orderCheckBox[scope.row.id]" style="margin-right:10px;">-->
                <!--</el-checkbox>-->
                <el-button @click="checkOrder(scope.row)" type="text" size="mini">验收</el-button>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="seeDetail(scope.row)" size="mini">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="factoryContractNo" label="工厂合同自编号" width="200">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.factoryContractNo" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.factoryContractNo}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="品牌">
              <template slot-scope="props">
                {{props.row.brand|brandFilter}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="品类">
              <template slot-scope="props">
                {{props.row.category|categoryFilter}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="stockOut" label="出库数量" width="70"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                <span>{{ changeStatus(scope.row.status) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="deliveryInstallModel" label="是否送装分离" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.deliveryInstallModel=='0'?'送装分离':'送装一体'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="送货时间" width="150">
              <template slot-scope="scope">
                <span>{{ format(scope.row.plannedDeliveryTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="deliveryOwner" label="送货员" width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.deliveryOwner" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.deliveryOwner}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="安装时间" width="150">
              <template slot-scope="scope">
                <span>{{ format(scope.row.installTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="installationOwner" label="安装工" width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.installationOwner" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.installationOwner}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="custContentment" align="center" label="客户评价结果" width="200">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.custContentment" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.custContentment}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="客户评价时间" width="150">
              <template slot-scope="scope">
                <span>{{ format(scope.row.custAppraisalTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="验收时间" width="135">
              <template slot-scope="scope">
                <span>{{ format(scope.row.acceptanceTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="acceptanceOwner" label="验收人" ></el-table-column>
            <el-table-column
              align="center"
              label="验收结果">
              <template slot-scope="scope">
                <span v-if="scope.row.isPass === '1'">通过</span>
                <span v-if="scope.row.isPass === '0'">不通过</span>
                <span v-if="scope.row.isPass === null"></span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="acceptanceRemark" label="验收备注"></el-table-column>
            <el-table-column align="center" prop="marketName" label="商场名称" width="100">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.marketName" placement="top">
                  <p class="op-nowrap op-pointer">{{scope.row.marketName}}</p>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="marketCode" label="商场编号" ></el-table-column>
            <el-table-column align="center" prop="designer" label="设计师" ></el-table-column>
            <el-table-column align="center" prop="shoppingGuide" label="导购" ></el-table-column>
            <el-table-column align="center" prop="leavelFlag" label="是否遗留单" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.leavelFlag === '1'">是</span>
                <span v-if="scope.row.leavelFlag === '0'">否</span>
                <span v-if="scope.row.leavelFlag === null"></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="params.pageNum"
            :page-sizes="[10]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </Card>
      <el-dialog
        title="批量验收"
        :visible.sync="dialogFormVisible"
        width="55%"
        @close="closeDialog"
        :close-on-click-modal="false">
        <el-form :model="dialogform">
          <div class="form-info1">
            <el-form-item size='mini' label-width="100px" label="验收时间：" :rules="[{ required: true,}]">
              <el-date-picker
                type="datetime"
                default-time="9:00:00"
                v-model="dialogform.checkTime"
                value-format="timestamp"
                placeholder="选择日期时间">
              </el-date-picker>
              <span style="margin-left:20px;">验收结果：</span>
              <el-radio v-model="dialogform.radio" label="1">通过</el-radio>
              <el-radio v-model="dialogform.radio" label="0">不通过</el-radio>
            </el-form-item>
            <el-form-item label="上传附件：" size='mini' label-width="100px">
              <div class="upload-item">
                <upload class="fix-upload" ref="upload" @onUploadChange="handleUpload" :on-remove='onRemoveHandle'>
                  <template slot="content">
                    <i class="el-icon-plus avatar-uploader-icon" style="font-size:20px;"></i>
                  </template>
                </upload>
              </div>
            </el-form-item>
            <el-form-item label-width="100px" label="验收备注：">
              <el-input maxlength="100" type="textarea" v-model="dialogform.desc" style="width:300px;" :autosize="{ minRows: 2, maxRows: 4}" size="mini"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog" size="mini">取 消</el-button>
          <el-button type="primary" @click="acceptance" size="mini" :disabled="isDisable">确 定</el-button>
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
        <SearchStore
          key="getstoreByid1"
          :getstoreByid="getstoreByid"
          :checkMaketArr="checkMaketArr"
          :checkStoreArr="checkStoreArr"
          @chooseStore="chooseStore"
          :isShow="isShowSearchStore"/>
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
          :changeState="isShowDeliveryMan"/>
      </el-dialog>
    </div>
    <AcceptanceDialog
      :acceptanceData="acceptanceTableData"
      @initData="getData"
      ref="acceptanceRef">
    </AcceptanceDialog>
    <router-view></router-view>
  </div>
</template>

<script>
import Upload from '@/components/UploadImg/index'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import SearchStore from '../OrderDispatchList/components/SearchStore'
import { Component, Vue, Watch } from 'vue-property-decorator'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import AcceptanceDialog from './components/AcceptanceDialog'
import { format, brandFilter, categoryFilter } from '@/utils/filter'
import CURRENT_ENV_PATH from '../../../services/baseUrl'

const acceptanceModule = namespace('delivery-installation/acceptance')

  @Component({
    components: { Card, Upload, SearchStore, DeliveryAndSetter, AcceptanceDialog },
    filters: { format, brandFilter, categoryFilter }

  })
export default class Acceptance extends Vue {
    tableHeight = 0
    loading = false
    isDisable = false
    name = 'acceptance'
    isShowSearchStore = false // 查询商场弹窗
    getstoreByid = false // 是否根据id查询门店
    type = null
    choose = false
    isShowDeliveryMan = false
    dimOwner = []
    checkMaketArr = [] // 选择的商场数组
    checkStoreArr = [] // 选择的门店数组
    deliveryInstallModel = [] // 送装一体
    isPass = [] // 验收是否通过
    ossPath = CURRENT_ENV_PATH.ossPath
    dialogform = {
      checkTime: '',
      radio: '1',
      upLoadFileList: [],
      desc: ''
    }
    seniorSearchFlag = false
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
        { value: '110', label: '已安装' },
        { value: '120', label: '已验收' }
      ],
      // 查询维度
      dim: [
        { value: '', label: '全部' },
        { value: '1', label: '送货' },
        { value: '2', label: '安装' },
        { value: '3', label: '验收' },
        { value: '4', label: '评价' }
      ],
      // 评价结果
      contentment: [
        { value: '', label: '全部' },
        { value: '5', label: '5星' },
        { value: '4', label: '4星' },
        { value: '3', label: '3星' },
        { value: '2', label: '2星' },
        { value: '1', label: '1星' }
      ]
    }
    expectDate = '' // 合同交期时间
    orderData = '' // 订单下单时间
    srvCompleteDate = '' // 收货齐套时间
    dimDate = '' // 维度时间
    nDays = [] // 几天到期
    params = {
      searchKeyword: '', // 搜索字段
      brand: '', // 品牌
      category: '', // 品类
      status: '', // 订单状态
      deliveryInstallModel: '', // 是否送装一体
      isPass: '', // 验收是否通过
      contentment: '', // 满意度
      marketName: '', // 商场名称
      marketNo: '', // 商场编号
      store: '', // 门店
      dim: '', // 查询维度
      isAcceptance: '1', // 查询验收列表
      dimOwner: '', // 维度责任人
      dimTimeStart: '', // 查询维度开始时间
      dimTimeEnd: '', // 查询维度结束时间
      pageNum: 1,
      pageSize: 10
    }
    total = 1
    dialogFormVisible = false
    acceptanceTable = []
    checkList = []
    listAmountArr = [] // 每个用户的订单数量数组
    operateIndex = []
    listAmount = 0 // 列表订单个数
    userCheckBoxItem = {}
    orderCheckBox = {}
    multipleSelection = [] // 复选的订单
    uploadImgList = []
    acceptanceTableData = {} // 验收详情

    created () {
      this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
      this.getData()
    }

    onRemoveHandle (file, fileList) {
      this.uploadImgList = fileList
    }

    handleUpload (file, fileList) {
      this.uploadImgList = fileList
    }

    closeDialog () {
      this.dialogform = {
        checkTime: '',
        radio: '1',
        upLoadFileList: [],
        desc: ''
      }
      this.dialogFormVisible = false
    }

    openDialog () {
      const orderCheckBox = this.orderCheckBox
      const checked = []
      for (let i in orderCheckBox) {
        if (orderCheckBox[i]) {
          checked.push(i)
        }
      }
      if (!checked.length) {
        this.$message({
          title: '警告',
          showClose: true,
          message: '请选择验收订单',
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.dialogform.checkTime = Date.now()
      this.dialogFormVisible = true
    }
    // 维度责任人移除
    closeTag (data) {
      // console.log(data)
      if (data.isTrusted) {
        this.dimOwner = []
      }
    }
    // 维度选择改变
    dimChange (data) {
      if (data === '') {
        this.dimDate = []
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
    // 选择送装是否一体
    chooseDeliveryInstallModel (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.deliveryInstallModel = []
        this.deliveryInstallModel.push(arr[1])
      }
    }
    // 选择验收是否通过
    chooseIsPass (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.isPass = []
        this.isPass.push(arr[1])
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

    // 批量验收
    async acceptance () {
      const dialogform = this.dialogform
      const orderCheckBox = this.orderCheckBox
      const acceptanceTable = this.acceptanceTable
      if (!dialogform.checkTime) {
        this.$message({
          title: '警告',
          showClose: true,
          message: '验收时间不能为空',
          type: 'warning',
          duration: 2000
        })
        return
      }
      const checked = []
      acceptanceTable.forEach((item) => {
        for (let i in orderCheckBox) {
          if (orderCheckBox[i] && item.id === i && item.status === '110') {
            checked.push(i)
          }
        }
      })
      const imgList = this.uploadImgList.map((item) => {
        return { name: item.name, path: item.url }
      })
      this.isDisable = true
      await this.mulAcceptance({
        creatTime: dialogform.checkTime,
        isPass: Number(dialogform.radio),
        remark: dialogform.desc,
        orderIds: checked.toString(),
        attachments: imgList
      }).then((result) => {
        if (result.code === '200') {
          this.$message({
            title: '成功',
            showClose: true,
            message: result.message,
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.getData()
        }
      }).catch((err) => {
        this.$message({
          title: '错误',
          showClose: true,
          message: err.message,
          type: 'error',
          duration: 2000
        })
      })
      this.isDisable = false
    }

    // 格式化时间
    format (timestamp, fmt) {
      return format(timestamp, 'yyyy-M-d HH:mm:s')
    }

    @Watch('orderCheckBox')
    orderCheckBoxHandle

    orderCheckBoxHandle (newVal, oldVal) {
      // console.log('oldVal:', oldVal)
      // console.log('newVal>>>>>>>>>:', newVal)
    }

    computed = {}
    @acceptanceModule.Action orderList
    @acceptanceModule.Action mulAcceptance

    seeDetail (item) {
      this.$router.push({
        name: 'acceptance-details',
        query: {
          serveNum: item.userId,
          orderNum: item.id,
          type: 'search'
        }
      })
    }

    checkOrder (row) {
      this.$refs.acceptanceRef.acceptanceVisible = true
      this.acceptanceTableData = null
      this.$nextTick(() => {
        this.acceptanceTableData = row
      })
      // this.$router.push({
      //   name: 'acceptance-details',
      //   query: {
      //     serveNum: item.userId,
      //     orderNum: item.id,
      //     type: 'check'
      //   }
      // })
    }

    changeStatus (status) {
      let statusString = ''
      switch (status) {
        case '110':
          statusString = '已安装'
          break
        case '120':
          statusString = '已验收'
          break
        default:
          statusString = ''
          break
      }
      return statusString
    }

    userCheckChange (val, row) {
      // console.log('用户按钮数组', val)
      // console.log('点击的单项row', row)
      const acceptanceTable = this.acceptanceTable
      const userCheckBoxItem = this.userCheckBoxItem
      const bool = val.some((val) => val.id === row.id)
      // console.log('是否选中bool', bool)
      if (bool) {
        this.userCheckBoxItem[row.userId].hadCheckedLength = this.userCheckBoxItem[row.userId].ordersLength
        acceptanceTable.forEach((item) => {
          if (item.userId === row.userId) {
            this.$set(this.orderCheckBox, item.id, true)
            // this.orderCheckBox[item.id] = true
          }
        })
      } else {
        this.userCheckBoxItem[row.userId].hadCheckedLength = 0
        acceptanceTable.forEach((item) => {
          if (item.userId === row.userId) {
            this.$set(this.orderCheckBox, item.id, false)
            // this.orderCheckBox[item.id] = false
          }
        })
      }
      const keys = Object.keys(userCheckBoxItem)
      const isAllChecked = keys.every(item => userCheckBoxItem[item]['hadCheckedLength'] === userCheckBoxItem[item]['ordersLength'])
      if (bool && isAllChecked) {
        acceptanceTable.forEach(item => {
          this.$refs.userOrderTable.toggleRowSelection(item, true)
        })
      }
      const cancelAll = Object.keys(this.userCheckBoxItem).every(item => {
        return this.userCheckBoxItem[item].hadCheckedLength === 0
      })
      if (cancelAll) {
        acceptanceTable.forEach(item => {
          this.$refs.userOrderTable.toggleRowSelection(item, false)
        })
      }
    }

    selectAll (selection) {
      const acceptanceTable = this.acceptanceTable
      const userCheckBoxItem = this.userCheckBoxItem
      if (selection.length) {
        acceptanceTable.forEach((item) => {
          this.$set(this.orderCheckBox, item.id, true)
          // this.orderCheckBox[item.id] = true
        })
        for (let i in userCheckBoxItem) {
          userCheckBoxItem[i].hadCheckedLength = userCheckBoxItem[i].ordersLength
        }
        // console.log('全选')
      } else {
        acceptanceTable.forEach((item) => {
          // this.orderCheckBox[item.id] = false
          this.$set(this.orderCheckBox, item.id, false)
        })
        for (let i in userCheckBoxItem) {
          userCheckBoxItem[i].hadCheckedLength = 0
        }
        // console.log('全取消')
      }
    }
    // nDay选择 5/3只能选一个
    chooseNDay (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.nDays = []
        this.nDays.push(arr[1])
      }
    }

    userSelectionChange (val) {
      // this.multipleSelection = val
    }

    orderChange (bool, val) {
      // console.log('订单按钮：', bool, val)
      const acceptanceTable = this.acceptanceTable
      const allCheck = []
      const notAllCheck = []
      const userCheckBoxItem = this.userCheckBoxItem
      const orderCheckBox = this.orderCheckBox
      const checkLength = {}

      // 手动修改订单状态
      if (bool) {
        acceptanceTable.forEach((item) => {
          if (item.userId === val.userId && item.status !== '110') {
            // console.log('已验收了')
            orderCheckBox[item.id] = true
          }
        })

        Object.keys(orderCheckBox).forEach((key) => {
          acceptanceTable.forEach((item) => {
            if (item.id === key && orderCheckBox[key]) {
              if (checkLength[item.userId]) {
                checkLength[item.userId] += 1
              } else {
                checkLength[item.userId] = 1
              }
            }
          })
        })

        // console.log('这个用户有多少个订单被选中 checkLength', checkLength)
        for (let i in checkLength) {
          userCheckBoxItem[i]['hadCheckedLength'] = checkLength[i]
        }
      } else {
        if (userCheckBoxItem[val.userId]['hadCheckedLength'] > 0) {
          userCheckBoxItem[val.userId]['hadCheckedLength'] -= 1
        }
      }
      // console.log('用户订单', orderCheckBox)
      for (let i in userCheckBoxItem) {
        if (userCheckBoxItem[i].hadCheckedLength === userCheckBoxItem[i].ordersLength) {
          allCheck.push(i)
        } else {
          notAllCheck.push(i)
        }
      }
      acceptanceTable.forEach(val => {
        // this.$refs.userOrderTable.toggleRowSelection(val, false)
        allCheck.forEach(item => {
          if (item === val.userId) {
            this.$refs.userOrderTable.toggleRowSelection(val, true)
          }
        })
        notAllCheck.forEach(item => {
          if (item === val.userId) {
            this.$refs.userOrderTable.toggleRowSelection(val, false)
          }
        })
      })
    }

    seniorSearch () {
      this.seniorSearchFlag = !this.seniorSearchFlag
      if (!this.seniorSearchFlag) {
        this.clearAll()
      }
    }
    // 清空高级选项
    clearAll () {
      this.params.searchKeyword = ''
      this.params.marketId = ''
      this.params.store = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.dimOwner = []
      const params = this.params
      Object.keys(params).forEach((item) => {
        if (item !== 'pageNum' && item !== 'pageSize' && item !== 'dim') {
          params[item] = ''
        }
      })
      this.deliveryInstallModel = []
      this.isPass = []
      this.checkMaketArr = []
      this.checkStoreArr = []
      this.dimDate = []
      this.params.brand = ''
      this.params.category = ''
      this.params.status = ''
      this.params.contentment = null
      this.params.dim = ''
      this.params.dimOwner = ''
      this.params.isAcceptance = '1'
    }
    async getData (pageNum = 1, searchKeyword) {
      // 查询维度时间
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      if (this.dimDate) {
        this.params.dimTimeStart = this.dimDate[0]
        this.params.dimTimeEnd = this.dimDate[1]
      } else {
        this.params.dimTimeStart = ''
        this.params.dimTimeEnd = ''
      }
      this.loading = true
      let params = {}
      if (searchKeyword) {
        params.searchKeyword = this.params.searchKeyword
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
        params.isAcceptance = this.params.isAcceptance
      } else {
        params = JSON.parse(JSON.stringify(this.params))
        if (this.deliveryInstallModel.length) {
          params.deliveryInstallModel = this.deliveryInstallModel[0] * 1
        } else {
          params.deliveryInstallModel = null
        }
        if (this.isPass.length) {
          params.isPass = this.isPass[0] * 1
        } else {
          params.isPass = null
        }
        if (this.dimOwner.length) {
          params.dimOwner = this.dimOwner[0].id
        } else {
          params.dimOwner = null
        }
      }
      await this.orderList(params).then((result) => {
        if (result.code === '200') {
          this.checkList = result.data.list
          this.total = result.data.total
        }
      }).catch((err) => {
        console.log('error:', err)
      })
      const tableArray = []
      this.listAmountArr = []
      this.checkList.forEach((item, index) => {
        const ordersId = []

        this.listAmountArr.push(item.orders.length)
        item.orders.forEach((value, idx) => {
          ordersId.push(value.id)
          const tableItem = {}
          tableItem.address = item.address
          tableItem.customerName = item.customerName
          tableItem.userId = item.id
          tableItem.mobilePhone = item.mobilePhone
          tableItem.orders = item.orders
          Object.assign(tableItem, value)
          tableArray.push(tableItem)
        })

        // 保存一份用户订单数据
        this.userCheckBoxItem[item.id] = {}
        Object.assign(this.userCheckBoxItem[item.id], {
          ordersLength: item.orders.length,
          ordersId: ordersId,
          hadCheckedLength: 0
        })
      })
      this.acceptanceTable = tableArray
      this.listAmount = tableArray.length
      this.operateIndex = this.listAmountArr.map((value, index, arr) => {
        const arrItem = arr.slice(0, index + 1)
        return arrItem.reduce((preNum, num) => {
          return preNum + num
        })
      })
      // tableArray.forEach(item => {
      //   this.orderCheckBox[item.id] = false
      // })
      this.loading = false
    }

    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      // row: 行
      // column: 列
      // const result = null
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
        const operateIndex = this.operateIndex
        for (let index = 0; index < operateIndex.length; index++) {
          if (rowIndex === 0) {
            return {
              rowspan: operateIndex[0],
              colspan: 1
            }
          } else if (index < operateIndex.length - 1) {
            if (rowIndex === operateIndex[index]) {
              return {
                rowspan: operateIndex[index + 1] - operateIndex[index],
                colspan: 1
              }
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
    handleCurrentChange (val) {
      this.orderCheckBox = {}
      this.userCheckBoxItem = {}
      this.getData(val)
    }
  }
</script>

<style src="./style.scss" lang="scss" scoped></style>
