<template>
  <div>
    <div class="op-return-list" v-show="!$route.meta.hidden">
      <Card v-loading="loading">
        <el-col :span="24" slot="head">
          <el-col :span="24" class="searchBox">
            <el-form :inline="true" class="op-text-right" @submit.native.prevent>
              <el-form-item class="op-left">
                <!--<el-button size="mini" type="primary">导出</el-button>-->
              </el-form-item>
              <el-form-item>
                <el-tooltip class="item" effect="dark" content="输入客户姓名、客户电话、客户地址、服务单号查询" placement="top">
                  <el-input
                    style="width:200px"
                    @keyup.enter.native="receiptTicketSearch"
                    v-model="params.searchKeyword"
                    class='receiptSearch'
                    maxlength="100"
                    size="mini"
                    placeholder="输入客户姓名、客户电话、客户地址、服务单号查询">
                  </el-input>
                </el-tooltip>
              </el-form-item>

              <el-form-item class="no-margin-right">
                <el-button
                  v-show="!isShowReceiptSearch"
                  @click="receiptTicketSearch"
                  size="mini"
                  type="primary">
                  查询
                </el-button>
                <el-button type="primary" size="mini" @click="isShowReceiptSearch = !isShowReceiptSearch">
                  {{isShowReceiptSearch ? '收起高级搜索' : '展开高级搜索'}}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" v-show="isShowReceiptSearch">
            <el-form :inline="true" class="demo-form-inline  returnList" @submit.native.prevent>
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
              <el-row class="crow1">
                <el-col :span="8">
                  <el-form-item label="品牌" size="mini">
                    <el-select placeholder="选择品牌" size="mini" v-model="params.brand">
                      <el-option
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        v-for="item in options.brand"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="品类" size="mini">
                    <el-select v-model="params.category" placeholder="请选择">
                      <el-option
                        v-for="item in options.category"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="安装完成时间" size="mini">
                    <el-date-picker
                      v-model="completeInstallationTime"
                      style="width:350px"
                      size="mini"
                      value-format="timestamp"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="评价岗位" size="mini">
                    <el-select v-model="params.post" placeholder="请选择">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="送货员" value="1"></el-option>
                      <el-option label="安装工" value="2"></el-option>
                      <el-option label="调度员" value="3"></el-option>
                      <el-option label="监理" value="4"></el-option>
                      <el-option label="仓库管理员" value="5"></el-option>
                      <el-option label="导购" value="6"></el-option>
                      <el-option label="设计师" value="7"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="评价得分" size="mini">
                    <el-select v-model="params.results" placeholder="请选择">
                      <el-option label="不评价" value=""></el-option>
                      <el-option label="1分" value="1"></el-option>
                      <el-option label="2分" value="2"></el-option>
                      <el-option label="3分" value="3"></el-option>
                      <el-option label="4分" value="4"></el-option>
                      <el-option label="5分" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="评价方式" size="mini">
                    <el-select v-model="params.evaluationMethod" placeholder="请选择">
                      <el-option label="客服回访" value="0"></el-option>
                      <el-option label="客户微信评价" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="评价时间" size="mini">
                    <el-date-picker
                      v-model="evaluateTime"
                      style="width:350px"
                      size="mini"
                      value-format="timestamp"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="24">
                <el-row style="margin-bottom:22px;float:right;">
                  <el-button type="primary" size="mini" @click="advancedSearch">高级查询</el-button>
                  <el-button type="primary" size="mini" @click="emptySearch">清空所有条件</el-button>
                </el-row>
              </el-col>
            </el-row>
            </el-form>
          </el-col>
        </el-col>

        <!--:span-method="arraySpanMethod"-->
        <el-table
          slot="content"
          cell-class-name="receive-list-cell"
          size="mini"
          :data="tableData"
          border
          :span-method="arraySpanMethod"
          :min-height="tableMinHeight"
          :max-height="tableMaxHeight"
          style="width: 100%">
          <div v-for="(list,lIndex) in tableHead" :key="lIndex">
            <template v-if="list.name==='选择'">
              <el-table-column fixed :label="list.name" align="center" width="50">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.choose"></el-checkbox>
                </template>
              </el-table-column>
            </template>
            <template v-if="list.name==='操作'">
              <el-table-column fixed :label="list.name" align="center" width="100">
                <template slot-scope="scope">
                  <!--<el-button type="text" size="mini" @click="toDetail(scope.row)">查看</el-button>-->
                  <el-button type="text" size="mini" @click="returnVisit(scope.row)">回访</el-button>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='品牌'">
              <el-table-column :label="list.name" align="center">
                <template slot-scope="props">
                  {{props.row[list.value] | brandFilter}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='品类'">
              <el-table-column :label="list.name" align="center">
                <template slot-scope="props">
                  {{props.row[list.value] | categoryFilter}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='被评价岗位'">
              <el-table-column :label="list.name" align="center">
                <template slot-scope="props">
                  {{props.row[list.value] | postTypeFilter}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='是否评价'">
              <el-table-column :label="list.name" align="center">
                <template slot-scope="props">
                  {{props.row[list.value] | whetherFilter}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name ==='送货完成时间' || list.name ==='安装完成时间' || list.name ==='评价时间'">
              <el-table-column align="center" :label="list.name" min-width="200">
                <template slot-scope="scope">
                  {{scope.row[list.value]| format("yyyy-MM-dd HH:mm:ss")}}
                </template>
              </el-table-column>
            </template>
            <template v-else-if="list.name==='客户地址' || list.name==='表扬或建议' || list.name==='服务单号'">
              <el-table-column :label="list.name" align="center" min-width="200">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row[list.value]" placement="top">
                    <p class="op-nowrap op-pointer">{{scope.row[list.value]}}</p>
                  </el-tooltip>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column :prop="list.value" :label="list.name" align="center" min-width="120"></el-table-column>
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
    </div>
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

    <ReturnVisitDialig
      :scoringData="scoringTableData"
      @initData="initData"
      ref="ReturnVisitRef">
    </ReturnVisitDialig>

    <router-view></router-view>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { statusFilter, format, brandFilter, categoryFilter, postTypeFilter, whetherFilter } from '@/utils/filter'
import Card from '@/components/Card'
import ReturnVisitDialig from './components/returnVisitDialig'
import SearchStore from '../OrderDispatchList/components/SearchStore'
const returnListPort = namespace('delivery-installation/returnList')
const moduleUser = namespace('user')

  @Component({
    components: { Card, SearchStore, ReturnVisitDialig },
    filters: { statusFilter, format, brandFilter, categoryFilter, postTypeFilter, whetherFilter }
  })
export default class ReceiveList extends Vue {
    tableHeight = 0
    total = 0
    type = null
    filename = '' // 文件导出名字
    loading = false
    // 是否展开高级搜索
    isShowReceiptSearch = false
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
    rules = {// 返货原因说明
      reason: [{
        required: true,
        message: '请填写返货原因说明',
        trigger: 'blur'
      }]
    }
    tableMinHeight = 450
    tableMaxHeight = 450
    params = {
      searchKeyword: '', // 搜索内容
      brand: '', // 品牌
      category: '', // 品类
      deliveryTime: '', // 送货完成时间
      evaluationMethod: '', // 评价方式
      evaluationTime: '', // 评价时间
      installTime: '', // 安装完成时间
      isAcceptance: '', // 是否验收
      isEvaluate: '', // 是否评价
      markeName: '', // 商场名称
      markeNum: '', // 商场编码
      post: '', // 评价岗位
      results: '', // 评价得分
      shop: '', // 门店
      pageNum: 1,
      pageSize: 10
    }
    tableData = []
    tableHead = [ // 表头数据
      { name: '表扬或建议', value: 'remark' },
      { name: '操作', value: '' },
      { name: '客户姓名', value: 'customerName' },
      { name: '客户手机号', value: 'customerTel' },
      { name: '客户地址', value: 'customerAddress' },
      { name: '服务单号', value: 'no' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '送货完成时间', value: 'realDeliveryTime' },
      { name: '安装完成时间', value: 'realInstallTime' },
      { name: '被评价岗位', value: 'postType' },
      { name: '被评价人', value: 'commentedName' },
      { name: '评价得分', value: 'commentScore' },
      { name: '是否评价', value: 'isEvaluate' },
      { name: '评价方式', value: 'commentType' },
      { name: '评价时间', value: 'commentDate' },
      { name: '商场名称', value: 'markeName' },
      { name: '商场编号', value: 'markeNum' },
      { name: '门店', value: 'shop' }
    ]
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
      ]
    }
    isShowSearchStore = false // 查询商场弹窗
    getstoreByid = false // 是否通过
    isShowDeliveryMan = false
    checkMaketArr = [] // 选择的商场数组
    checkStoreArr = [] // 选择的商场数组
    completeInstallationTime = [] // 安装完成时间
    evaluateTime = [] // 评价时间
    scoringTableData = {}

    // 权限控制
    @moduleUser.Getter permission
    // 回访列表
    @returnListPort.Action getReturnVisitList

    /*
    * 数据初始化
    * */
    initData (pageNum = 1, searchKeyword) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = +pageNum
      this.loading = true
      let params = {}
      if (searchKeyword) {
        params.searchKeyword = this.params.searchKeyword
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
      } else {
        params = Object.assign(params, this.params)
      }
      this.getReturnVisitList({ ...params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status) {
          this.total = res.data.total
          this.tableData = this.unfoldData(res.data.list)
        }
      }).catch(() => {
        this.loading = false
        this.total = 0
        this.tableData = []
      })
    }

    /*
    * 跳转到订单详情页面
    * */
    toDetail (row) {
      this.$router.push({
        name: 'return-details',
        query: {
          serveNum: row.id, // 服务id
          orderNum: row.orderId, // 订单id
          orderNo: row.orderNo, // 订单no
          type: 'search' // 跳转的目的 search 查询   check 验收
        }
      })
    }

    /*
    * 打开回访弹窗
    * */
    returnVisit (row) {
      this.$refs.ReturnVisitRef.returnVisitVisible = true
      this.scoringTableData = null
      this.$nextTick(() => {
        this.scoringTableData = row
      })
    }

    /*
    * 查询商场弹窗
    * */
    showSearchStore () {
      this.getstoreByid = false
      this.isShowSearchStore = true
    }

    /*
    * 根据商场id查询门店信息
    * */
    showSearchStoreById () {
      if (this.checkMaketArr.length) {
        this.getstoreByid = true
        this.isShowSearchStore = true
      } else {
        this.$message.warning('您要选取门店信息须先选择对应商场~')
      }
    }

    /*
    * 商场查询反写
    * */
    chooseStore (data) {
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
        this.params.markeNum = ''
        this.params.marketId = ''
        let marketName = []
        let markeNum = []
        let marketId = []
        if (this.checkMaketArr.length) {
          this.checkMaketArr.forEach((e, i) => {
            marketName.push(e.mainMarketName)
            markeNum.push(e.mainMarketCode)
            marketId.push(e.id)
          })
          this.params.marketName = marketName.length === 1 ? marketName[0] : marketName.join(',')
          this.params.markeNum = markeNum.length === 1 ? markeNum[0] : markeNum.join(',')
          this.params.marketId = marketId.length === 1 ? marketId[0] : marketId.join(',')
        }
      } else {
        this.params.shop = ''
        let shop = []
        if (this.checkStoreArr.length) {
          this.checkStoreArr.forEach((e, i) => {
            shop.push(e.shopId)
          })
          this.params.shop = shop.length === 1 ? shop[0] : shop.join(',')
        }
      }
      this.isShowSearchStore = false
    }

    // 查询
    receiptTicketSearch () {
      this.initData(false, true)
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

    /*
    * 高级查询
    * */
    advancedSearch () {
      this.initData()
    }

    // 清空查询信息
    emptySearch () {
      this.params.searchKeyword = ''
      this.params.carnum = ''
      this.sendTime = []
    }

    /*
    * 处理跨行跨列w
    * */
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let isRowspanData = ['操作', '客户姓名', '客户手机号', '客户地址', '服务单号', '品牌', '品类', '送货完成时间', '安装完成时间']
      if (isRowspanData.join('').indexOf(column.label) === -1) {
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

    // 展开数据结构
    unfoldData (arrData = []) {
      let data = []
      arrData.forEach((list, lindex) => {
        if (list.feedbacks && list.feedbacks.length) {
          list.feedbacks.forEach((item, index) => {
            data.push({
              ...list,
              postType: item.postType, // 被评价岗位
              commentedName: item.commentedName, // 被评价人
              commentScore: item.commentScore, // 评价得分
              isEvaluate: item.isEvaluate, // 是否评价
              commentType: item.commentType, // 评价方式
              commentDate: item.commentDate, // 评价时间
              markeName: item.markeName, // 商场名称
              markeNum: item.markeNum, // 商场编号
              remark: item.remark, // 表扬或建议
              shop: item.shop, // 门店
              rowspan: list.feedbacks.length,
              colspan: 1,
              rowIndex: index + 1
            })
          })
        }
      })
      return data
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
