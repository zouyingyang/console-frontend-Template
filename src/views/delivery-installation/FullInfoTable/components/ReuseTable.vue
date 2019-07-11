<template>
  <div class="reuseTable">
    <el-table
      v-loading.fullscreen.lock="loading"
      ref="caseTable"
      cell-class-name="reuse-table-cell"
      :data="planeData"
      :min-height="tableMinHeight"
      :max-height="tableMaxHeight"
      border
      style="width: 100%;"
      :span-method="arraySpanMethod"
      size="mini">
      <div v-for="(list,lIndex) in headData" :key="lIndex">
        <template v-if="isCheck&&list.name==='check'">
          <el-table-column align="center" label="选择" width="50">
            <template slot-scope="scope">
              <!--<template v-if="type === 'undispatched' || type === 'addToOrder'">-->
                <!--<el-checkbox-->
                  <!--label=""-->
                  <!--name="type"-->
                  <!--v-if="isCheck && scope.row.isDispatchUser === '0' && scope.row.isCompleteOrder === '2'"-->
                  <!--v-model="scope.row.userChecked"-->
                  <!--@change="handleCheckUser(scope.row)">-->
                <!--</el-checkbox>-->
                <!--<span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
              <!--</template>-->
              <template>
                <el-checkbox
                  label=""
                  name="type"
                  v-if="isCheck"
                  v-model="scope.row.userChecked"
                  @change="handleCheckUser(scope.row)">
                </el-checkbox>
              </template>
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='客户手机号'
          || list.name==='返库人'
          || list.name==='验收人'
          || list.name==='车牌号'
          || list.name==='司机'
          || list.name==='已出库数量'
          || list.name==='待出库数量'
          || list.name==='待出库数量'
          || list.name==='服务单合同总金额'
          || list.name==='服务单已收款'
          || list.name==='服务单待收款'
          || list.name==='送货安装单号'">
          <el-table-column :label="list.name" align="center" width="150">
            <template slot-scope="scope">
              {{scope.row[list.value]}}
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='工厂合同自编号'
          || list.name==='商场名称'
          ||list.name==='服务单单号'">
          <el-table-column :label="list.name" align="center" width="250">
            <template slot-scope="scope">
              {{scope.row[list.value]}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name==='安装协助人'
          || list.name==='送货协助人'
          || list.name==='安装责任人'
          || list.name==='出库人'
          || list.name==='送货责任人'
          || list.name==='客户姓名'
          || list.name==='设计师'
          || list.name==='导购'">
          <el-table-column :label="list.name" align="center" width="110">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row[list.value]" placement="top">
                <p class="op-nowrap op-pointer">{{scope.row[list.value]}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='客户地址'
          || list.name==='门店'
          || list.name==='返库原因'
          || list.name==='返库备注'
          || list.name==='客户评价结果'
          || list.name==='送货完成备注'
          || list.name==='安装完成备注'">
          <el-table-column :label="list.name" align="center" width="200">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row[list.value]" placement="top">
                <p class="op-nowrap op-pointer">{{scope.row[list.value]}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name==='状态' || list.name==='单据状态' || list.name==='订单状态'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="scope">
              {{scope.row[list.value]| statusFilter}}
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='是否过期'
          || list.name==='是否返仓'
          || list.name==='是否遗留单'
          || list.name==='是否产生遗留'
          || list.name==='是否验收'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="props">
              {{props.row[list.value] | whetherFilter}}
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='是否加入待调度列表'">
          <el-table-column :label="list.name" align="center" width="150">
            <template slot-scope="props">
              {{props.row[list.value] | whetherFilter}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name==='是否送装分离'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="props">
              {{props.row[list.value] | deliverySeparationFilter}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name==='服务号是否齐套' || list.name==='服务单是否齐套' || list.name==='订单是否齐套'">
          <el-table-column :label="list.name" align="center" width="150">
            <template slot-scope="props">
              {{props.row[list.value] | completeFilter}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name==='验收结果'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="scope" prop="status">
              {{scope.row.isPass | acceptanceResultFilter}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name ==='查看详情'">
          <el-table-column align="center" :label="list.name" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="toDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name ==='操作'">
          <el-table-column align="center" :label="list.name" width="80">
            <template slot-scope="scope">
              <!--<template v-if="type === 'undispatched' || type === 'addToOrder'">-->
                <!--<el-checkbox-->
                  <!--label=""-->
                  <!--name="type"-->
                  <!--v-if="isCheck && scope.row.isDispatchUser ==='0' && scope.row.isCompleteOrder === '2'"-->
                  <!--v-model="scope.row.checked"-->
                  <!--@change="handleCheckOrder(scope.row)">-->
                <!--</el-checkbox>-->
                <!--<span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>-->
              <!--</template>-->
              <template>
                <el-checkbox
                  label=""
                  name="type"
                  v-if="isCheck"
                  v-model="scope.row.checked"
                  @change="handleCheckOrder(scope.row)">
                </el-checkbox>
              </template>
              <el-popover
                width="800"
                trigger="click">
                <el-table
                  v-loading="clsleve2Loading"
                  :data="scope.row.clsleve2"
                  border
                  max-height="500"
                  @expand-change="getInstallClsleve3"
                  size="mini"
                >
                  <div v-for="(twoList,tIndex) in twoHeadData" :key="tIndex">
                    <template v-if="isCheck&&twoList.name==='check'">
                      <el-table-column label="选择" width="50">
                        <template slot-scope="scope2">
                          <el-checkbox
                            label=""
                            name="type"
                            v-if="isCheck"
                            @change="handleCheckClsleve2(scope2.row,scope.row)"
                            v-model="scope2.row.checked">
                          </el-checkbox>
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='包详情'">
                      <el-table-column :label="twoList.name" type="expand" width="80">
                        <template slot-scope="props3">
                          <el-table :data="props3.row.clsleve3" size="mini" border style="max-width: 800px;" v-loading="clsleve3Loading">
                            <el-table-column align="center" property="clsleve3Name" label="三级品类"></el-table-column>
                            <el-table-column align="center" property="barCode" label="包条码"></el-table-column>
                            <el-table-column align="center"  label="例放">
                              <template slot-scope="props">
                                {{props.row.caseFlag | exampleReleaseFilter}}
                              </template>
                            </el-table-column>
                            <el-table-column align="center" property="packageNo" label="包序号"></el-table-column>
                            <el-table-column align="center" property="status" label="状态">
                              <template slot-scope="props">
                                {{props.row.status | statusFilter}}
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name === '存放库位'">
                    <el-table-column align="center" :label="twoList.name" width="150">
                      <template slot-scope="scope">
                        <el-autocomplete
                          v-loading="libraryPositionLoading"
                          v-if="(isCheck && type==='reportableLibrary') || type==='antiLibrary'"
                          placeholder="请输入存放库位"
                          size="mini"
                          :fetch-suggestions="querySearch"
                          :max-height="50"
                          @select="modifyTheLibraryBit(scope.row)"
                          v-model="scope.row.leve2stockPosition"
                          @blur="modifyTheLibraryBit(scope.row)">
                        </el-autocomplete>
                        <span
                          v-else
                          v-text="scope.row.leve2stockPosition">
                          </span>
                      </template>
                    </el-table-column>
                  </template>
                    <template
                      v-else-if="twoList.name==='预约送货时间'
                      || twoList.name==='订单下单时间'
                      || twoList.name==='收货齐套时间'
                      || twoList.name==='预约送货时间'
                      || twoList.name==='预约安装时间'
                      || twoList.name==='实际送货时间'
                      || twoList.name==='实际安装时间'
                      || twoList.name==='出库时间'
                      || twoList.name==='预约安装时间'">
                      <el-table-column :label="twoList.name" align="center" width="150">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | format("yyyy-MM-dd HH:mm:ss")}}
                        </template>
                      </el-table-column>
                    </template>
                    <template
                      v-else-if="twoList.name==='期望交期'
                      || twoList.name==='合同交期'
                      || twoList.name==='工厂计划交期'">
                      <el-table-column :label="twoList.name" align="center" width="120">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | format}}
                        </template>
                      </el-table-column>
                    </template>
                    <template
                      v-else-if="twoList.name==='已出库数量'
                      || twoList.name==='安装责任人'
                      || twoList.name==='出库人'
                      || twoList.name==='送货责任人'">
                      <el-table-column :label="twoList.name" align="center" width="100">
                        <template slot-scope="props">
                          {{props.row[twoList.value]}}
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='门店'">
                      <el-table-column :label="twoList.name" align="center" width="150">
                        <template slot-scope="props">
                          <el-tooltip class="item" effect="dark" :content="props.row[twoList.value]" placement="top">
                            <p class="op-nowrap op-pointer">{{props.row[twoList.value]}}</p>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='送货协助人' || twoList.name==='安装协助人'">
                      <el-table-column :label="twoList.name" align="center" width="100">
                        <template slot-scope="props">
                          <span class="op-nowrap">{{props.row[twoList.value]}}</span>
                        </template>
                      </el-table-column>
                    </template>
                    <template
                      v-else-if="twoList.name==='客户评价结果'">
                      <el-table-column :label="twoList.name" align="center" width="150">
                        <template slot-scope="props">
                          {{props.row[twoList.value]}}
                        </template>
                      </el-table-column>
                    </template>
                    <template
                      v-else-if="twoList.name==='商场名称'">
                      <el-table-column :label="twoList.name" align="center" width="200">
                        <template slot-scope="props">
                          {{props.row[twoList.value]}}
                        </template>
                      </el-table-column>
                    </template>
                    <template
                      v-else-if="twoList.name==='订单是否齐套'
                      || twoList.name==='收货是否齐套'">
                      <el-table-column :label="twoList.name" align="center" width="110">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | completeFilter}}
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='是否过期' || twoList.name==='是否加入待调度列表'">
                      <el-table-column :label="twoList.name" align="center" width="150">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | whetherFilter}}
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='品类'">
                      <el-table-column :label="twoList.name" align="center">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | categoryFilter}}
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='状态' || twoList.name==='送货安装单状态'">
                      <el-table-column :label="twoList.name" align="center" width="150">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | statusFilter}}
                        </template>
                      </el-table-column>
                    </template>
                    <template v-else-if="twoList.name==='是否送装分离'">
                      <el-table-column :label="twoList.name" align="center" width="100">
                        <template slot-scope="props">
                          {{props.row[twoList.value] | deliverySeparationFilter}}
                        </template>
                      </el-table-column>
                    </template>
                    <el-table-column
                      :prop="twoList.value"
                      align="center"
                      :label="twoList.name"
                      v-else-if="twoList.name!=='check'">
                    </el-table-column>
                  </div>
                </el-table>
                <a class="bagDetailBtn" slot="reference" @click="getTwoData(scope.row,scope.$index)">&nbsp;
                  <i class="el-icon-plus" style="font-size: 14px;font-weight: bold"></i>
                </a>
              </el-popover>
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
        <template v-else-if="list.name==='生成人'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="props">
              {{props.row[list.value]}}
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name ==='存放库位'">
          <el-table-column align="center" :label="list.name" width="150">
            <template slot-scope="scope">
              <span
                v-if="!isCheck
                || type==='undispatched'
                || type==='reportableLibrary'
                || type==='addToOrder'
                || type==='deliveryInstallationList'
                || type==='all'
                || type === 'schedulingable'"
                v-text="scope.row.orderStockPosition">
              </span>
              <el-autocomplete
                v-else placeholder="请输入存放库位"
                v-loading="libraryPositionLoading"
                size="mini"
                :fetch-suggestions="querySearch"
                :max-height="50"
                @select="modifyTheLibraryBit(scope.row)"
                v-model="scope.row.orderStockPosition"
                @blur="modifyTheLibraryBit(scope.row)">
              </el-autocomplete>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name === '客户跟踪'">
          <el-table-column align="center" :label="list.name" width="150">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                v-if="(isCheck && type==='deliveryInstallationList') || type==='scheduling'|| type==='undispatched' || type==='all'"
                :content="scope.row.tracks ? scope.row.tracks : '暂无数据，点击可维护跟踪记录'"
                placement="top">
                <p
                  class="op-nowrap op-pointer font-default-color"
                  @click="showCustomerTrackingRecords(scope.row, scope.$index)">
                  {{scope.row.tracks ? scope.row.tracks : '暂无数据，点击可维护跟踪记录'}}
                </p>
              </el-tooltip>
              <span
                v-else
                v-text="scope.row.selfCustomerTracking">
              </span>
              <!--<el-input-->
                <!--v-loading="customerTrackingLoading"-->
                <!--v-if="(isCheck && type==='deliveryInstallationList') || type==='scheduling'|| type==='undispatched' || type==='all'"-->
                <!--placeholder="请输入客户跟踪"-->
                <!--size="mini"-->
                <!--:fetch-suggestions="querySearch"-->
                <!--:max-height="50"-->
                <!--v-model="scope.row.selfCustomerTracking"-->
                <!--@blur="modifyCustomerTracking(scope.row,'customer')">-->
              <!--</el-input>-->
            </template>
          </el-table-column>
        </template>
        <template v-else-if="list.name === '订单内容'">
          <el-table-column align="center" :label="list.name" width="150">
            <template slot-scope="scope">
              <el-input
                v-loading="orderContentLoading"
                v-if="type==='all'"
                placeholder="请输入订单内容"
                size="mini"
                :fetch-suggestions="querySearch"
                :max-height="50"
                v-model="scope.row.selfOrderContent"
                @blur="modifyCustomerTracking(scope.row,'order')">
              </el-input>
              <span
                v-else
                v-text="scope.row.selfOrderContent">
              </span>
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='预约送货时间'
          || list.name==='预约安装时间'
          || list.name==='收货齐套时间'
          || list.name==='验收时间'
          || list.name==='评价时间'
          || list.name==='实际送货时间'
          || list.name==='实际安装时间'
          || list.name==='生成时间'
          || list.name==='出库时间'
          || list.name==='返库时间'
          || list.name==='评价时间'
          || list.name==='订单下单时间'">
          <el-table-column :label="list.name" align="center" width="150">
            <template slot-scope="props">
              {{props.row[list.value] | format("yyyy-MM-dd HH:mm:ss")}}
            </template>
          </el-table-column>
        </template>
        <template
          v-else-if="list.name==='期望交期'
          || list.name==='合同交期'
          || list.name==='工厂计划交期'
          || list.name==='工厂计划交期'">
          <el-table-column :label="list.name" align="center" width="100">
            <template slot-scope="props">
              {{props.row[list.value] | format}}
            </template>
          </el-table-column>
        </template>
        <el-table-column
          :prop="list.value"
          align="center"
          :label="list.name"
          v-else-if="list.name!=='check'"
        />
      </div>
    </el-table>
    <el-dialog
      title="客户跟踪记录"
      :visible.sync="customerTrackingRecordsVisible"
      width="50%"
      :close="handleClose">
      <div v-for="(list, index) in tracksList" :key="index + 'tracks'">
        第{{++index | toChinesNum}}次跟踪：
        <p class="width80 numeric-alphabet-line-feed" v-text="list.remark"></p>
      </div>
      <div v-if="tracksList.length < 20">
        第{{tracksList.length ? tracksList.length + 1 : 1 | toChinesNum}}次跟踪：
        <el-input class="width80 customerInput" placeholder="请输入跟踪记录" v-model="remark" maxlength="200"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button v-if="tracksList.length < 20" type="primary" @click="saveCustomerTrackingRecords">确 定</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
/**
 tableData 表格数据
 type:Array
 说明:目前接受树结构以及平面结构数据

 tableHead 表头数据
 type Array
 说明:组件会根据传入的表头生成表格数据。不区分顺序

 type 表类型
 type Boolean
 说明: 区分是信息全量表还是送货安装表

 twoHeadData 二级表头数据
 type Array
 说明:组件会根据传入的表头生成表格数据。不区分顺序

 isCheck
 type: Boolean
 说明:是否可选择
 *
 * */

import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import storage from '@/utils/storage'
import { exampleReleaseFilter, statusFilter, brandFilter, categoryFilter, completeFilter, deliverySeparationFilter, acceptanceResultFilter, format, whetherFilter, toChinesNum } from '@/utils/filter'

const moduleFullDose = namespace('delivery-installation/fullInfoTable')
const receiveListPort = namespace('delivery-installation/receiveListPort')

@Component({
  filters: { exampleReleaseFilter, statusFilter, brandFilter, categoryFilter, completeFilter, deliverySeparationFilter, acceptanceResultFilter, format, whetherFilter, toChinesNum }
})
export default class ReuseTable extends Vue {
  // 列表数据
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  }) tableData
  // 列表类型
  @Prop({ type: String, default: 'all' }) type
  // 列表表头
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  }) tableHead
  // 二级列表表头
  @Prop({
    type: Array,
    default: function () {
      return []
    }
  }) twoTableHead
  // 是否可选择
  @Prop({ type: Boolean, default: false }) isCheck
  loading = false
  tableMinHeight = 450
  tableMaxHeight = 450
  clsleve2Loading = false
  clsleve3Loading = false
  libraryPositionLoading = false // 库位loading
  customerTrackingLoading = false // 客户跟踪loading
  orderContentLoading = false // 订单内容loading
  headData = [] // 头部数据
  planeData = [] // 平铺数据
  isRowspanData = {} // 是否跨行
  customerTrackingRecordsVisible = false // 客户跟踪记录弹窗 客户跟踪
  tracksList = [] // 客户跟踪记录List
  remark = '' // 客户跟踪记录
  tracksRrderId = '' // 订单id

  // 获取全量信息表二级品类
  @moduleFullDose.Action getAllLeve2list

  // 获取送货安装单二级品类
  @moduleFullDose.Action getInstallPlantClsleve2

  // 获取三级品类
  @moduleFullDose.Action getInstallPlantClsleve3

  // 修改库位
  @receiveListPort.Action updateStockPosition

  // 送货安装列表增加客户跟踪、订单内容字段 接口
  @moduleFullDose.Action updateTrackingContent

  // 客户跟踪 new
  @moduleFullDose.Action updateTracks

  // 获取二级品类数据
  getTwoData (row, index) {
    if (this.planeData[index].clsleve2.length) {
      return false
    }
    // 获取二级品类有两个接口  返回数据格式是一样的 type用来区别全量表和送货安装表
    this.planeData[index].clsleve2 = []
    if (this.type !== 'deliveryInstallationList') {
      let isDispatch = null
      if (this.type === 'undispatched') {
        isDispatch = '0'
      } else if (this.type === 'scheduling') {
        isDispatch = '1'
      }
      this.clsleve2Loading = true
      this.getAllLeve2list({ 'orderId': row.orderId, 'isDispatch': isDispatch }).then(res => {
        this.clsleve2Loading = false
        // console.log('全量信息表二级品类res', res)
        if (res.status && res.code === '200') {
          if (res.data.length) {
            res.data.forEach((list, index) => {
              list.leve2listOrderIndex = index
              list.leve2stockPosition = list.stockPosition
              list.checked = row.checked
            })
            this.planeData[index].clsleve2 = res.data
          } else {
            this.planeData[index].clsleve2 = []
          }
        }
      }).catch(error => {
        this.clsleve2Loading = false
        console.log('全量信息表二级品类error', error)
      })
    } else if (this.type === 'deliveryInstallationList') {
      this.clsleve2Loading = true
      this.getInstallPlantClsleve2({ 'orderId': row.orderId, deliveryInstallId: row.deliveryInstallId }).then(res => {
        this.clsleve2Loading = false
        // console.log('送货安装单二级品类res', res)
        if (res.status && res.code === '200') {
          if (res.data.length) {
            res.data.forEach((list, index) => {
              list.leve2listOrderIndex = index
              list.leve2stockPosition = list.stockPosition
              list.selfOrderContent = list.orderContent || ''
              list.selfCustomerTracking = list.customerTracking || ''
              list.checked = row.checked
            })
            this.planeData[index].clsleve2 = res.data
          } else {
            this.planeData[index].clsleve2 = []
          }
        }
      }).catch(error => {
        this.clsleve2Loading = false
        console.log('送货安装单二级品类error', error)
      })
    }
  }

  // 获取三级品类
  getInstallClsleve3 (row, expandedRows) {
    if (row.clsleve3 && row.clsleve3.length) return
    if (expandedRows.length > 1) {
      expandedRows.shift()
    }
    let clsleve2Id = row.clsleve2Id ? row.clsleve2Id : row.id
    this.clsleve3Loading = true
    this.getInstallPlantClsleve3({ 'clsleve2Id': clsleve2Id }).then(res => {
      this.clsleve3Loading = false
      // console.log('三级品类res', res)
      if (res.status && res.code === '200') {
        if (res.data.length) {
          res.data.forEach(list => {
            list.checked = row.checked
          })
          row.clsleve3 = res.data
        } else {
          row.clsleve3 = []
        }
      }
    }).catch(error => {
      this.clsleve3Loading = false
      console.log('三级品类error', error)
    })
  }

  // 处理跨行跨列
  arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
    let name = column.label
    if (!this.isRowspanData[name] && column.label !== '选择') {
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

  // 处理表头数据
  handleHead (headArr, arr) {
    headArr.forEach((list, index) => {
      this.isRowspanData[list.name] = list.isRowspan
      if (index === headArr.length - 1) {
        arr.unshift(list)
      } else {
        arr.push(list)
      }
    })
    return arr
  }

  // 展开数据结构
  unfoldData (arrData) {
    let data = []
    arrData.forEach((list, lindex) => {
      if (list.orders && list.orders.length) {
        let isDispatchUser = null
        list.orders.forEach((item, index) => {
          // 未调度列表
          // if (this.type === 'undispatched' || this.type === 'addToOrder') {
          //   // isDispatchUser  是否加入待调度列表  0:否 1:是
          //   // isCompleteOrder  订单是否齐套  2:以齐套
          //   isDispatchUser = '0'
          //   if (item.isDispatch !== '0') {
          //     isDispatchUser = '1'
          //   }
          // }
          let tracks = (item.tracks && item.tracks.length) ? item.tracks[item.tracks.length - 1].remark : ''
          data.push({
            ...item,
            ...list,
            isCompleteOrder: item.isComplete,
            orderIndex: lindex,
            orderStockPosition: item.stockPosition,
            selfOrderContent: item.orderContent || '',
            selfCustomerTracking: item.customerTracking || '',
            isDispatchUser: isDispatchUser,
            deliveryInstallId: list.id,
            orderId: item.id,
            userChecked: false,
            checked: false,
            clsleve2: [],
            clsleve3: [],
            rowspan: list.orders.length,
            colspan: 1,
            rowIndex: index + 1,
            tracks: tracks,
            tracksList: item.tracks && item.tracks.length ? item.tracks : []
          })
        })
      }
    })
    return data
  }

  // 选择或取消用户
  handleCheckUser (row) {
    this.planeData.forEach(list => {
      if (list.id === row.id) {
        // 改变订单选择项
        list.checked = row.userChecked
        list.userChecked = row.userChecked
        if (list.clsleve2.length) {
          list.clsleve2.forEach(item => {
            // 改变二级品类选择项
            // if (this.type === 'undispatched' || this.type === 'addToOrder') {
            //   if (item.isDispatchUser !== '0' || item.isCompleteOrder !== '2') {
            //     item.checked = false
            //   } else {
            //     item.checked = row.userChecked
            //   }
            // } else {
            item.checked = row.userChecked
            // }
          })
        }
      }
    })
  }

  // 选择或取消订单
  handleCheckOrder (row) {
    if (row.clsleve2.length) {
      row.clsleve2.forEach(item => {
        // 改变二级品类选择项
        // if (this.type === 'undispatched' || this.type === 'addToOrder') {
        //   if (item.isDispatchUser !== '0' || item.isCompleteOrder !== '2') {
        //     item.checked = false
        //   } else {
        //     item.checked = row.userChecked
        //   }
        // } else {
        item.checked = row.checked
        // }
      })
    }
    let orderArr = this.planeData.filter(list => {
      return list.id === row.id
    })
    let userChecked = orderArr.some(item => {
      return item.checked === true
    })
    orderArr.forEach(list => {
      list.userChecked = userChecked
    })
  }

  // 选择或取消二级品类
  handleCheckClsleve2 (row, order) {
    order.checked = order.clsleve2.some(list => {
      return list.checked === true
    })
    let orderArr = this.planeData.filter(list => {
      return list.id === order.id
    })
    let userChecked = orderArr.some(item => {
      return item.checked === true
    })
    orderArr.forEach(list => {
      list.userChecked = userChecked
    })
  }

  // 跳转到订单详情页面
  toDetail (row) {
    let currentRouteName = this.$route.name
    let detailsRouteNames = {
      'full-order-info': 'order-info-details', // 订单信息全量表 - 订单详情
      'order-dispatch-list': 'order-dispatch-details', // 订单调度列表 - 订单详情
      'delivery-installation-list': 'delivery-installation-details', // 送货安装列表 - 订单详情
      'acceptance-list': 'acceptance-details' // 验收列表 - 订单详情
    }
    this.$router.push({
      name: detailsRouteNames[currentRouteName],
      query: {
        serveNum: row.customerId || row.id, // 服务id
        orderNum: row.orderId, // 订单id
        orderNo: row.orderNo, // 订单no
        type: 'search' // 跳转的目的 search 查询   check 验收
      }
    })
  }

  // 返回列表数据 带有checked标记
  getCheckedData () {
    return JSON.parse(JSON.stringify(this.planeData))
  }

  // 页面搜索缓存库位
  querySearch (queryString, cb) {
    if ((!!queryString) && (queryString.indexOf(',') || queryString.indexOf('，'))) {
      queryString = queryString.split(',') || queryString.split('，')
      queryString = queryString.splice(-1, 1).join('')
    }
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

  // 修改库位
  modifyTheLibraryBit (row) {
    if (row.stockPosition === row.leve2stockPosition) {
      return
    }
    let params = {
      stockPosition: row.leve2stockPosition
    }
    params.id = row.id
    this.libraryPositionLoading = true
    this.updateStockPosition(params).then(res => {
      this.libraryPositionLoading = false
      // console.log('修改库位res', res)
      if (res.status && res.code === '200') {
        this.$message.success('修改库位成功')
        this.$emit('initData', '')
      }
    }).catch(error => {
      this.libraryPositionLoading = false
      console.log('修改库位error', error)
    })
  }

  // 修改客户跟踪、订单内容
  modifyCustomerTracking (row, type) {
    let params = {}
    if (type === 'order' && row.orderContent !== row.selfOrderContent) {
      params = {
        customerTracking: row.selfCustomerTracking || '',
        orderContent: row.selfOrderContent || '',
        orderId: row.orderId
      }
    } else if (type === 'customer' && row.customerTracking !== row.selfCustomerTracking) {
      params = {
        customerTracking: row.selfCustomerTracking || '',
        orderContent: row.selfOrderContent || '',
        orderId: row.orderId
      }
    } else {
      return
    }
    type === 'order' ? this.orderContentLoading = true : this.customerTrackingLoading = true
    this.updateTrackingContent(params).then(res => {
      type === 'order' ? this.orderContentLoading = false : this.customerTrackingLoading = false
      // console.log(type === 'order' ? '修改订单内容成功' : '修改客户跟踪成功', res)
      if (res.status && res.code === '200') {
        this.$message.success(type === 'order' ? '修改订单内容成功' : '修改客户跟踪成功')
        this.$emit('initData', '')
      }
    }).catch(error => {
      type === 'order' ? this.orderContentLoading = false : this.customerTrackingLoading = false
      console.log(type === 'order' ? '修改订单error' : '修改客户跟踪error', error)
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

  @Watch('tableData')
  watchTableData (newVal, oldVal) {
    this.planeData = this.unfoldData(newVal)
  }

  /*
  * 打开客户跟踪弹窗
  * */
  showCustomerTrackingRecords (row) {
    this.tracksList = row.tracksList
    this.tracksRrderId = row.orderId
    this.customerTrackingRecordsVisible = true
  }

  /*
  * 客户跟踪记录弹窗关闭 客户跟踪
  * */
  handleClose () {
    this.remark = ''
    this.tracksRrderId = ''
    this.customerTrackingRecordsVisible = false
  }

  /*
  * 保存客户跟踪记录
  * */
  saveCustomerTrackingRecords () {
    if (!this.remark) {
      this.$message.error('跟踪记录不能为空')
      return
    }
    let params = {
      remark: this.remark,
      orderId: this.tracksRrderId
    }
    this.loading = true
    this.updateTracks(params).then(res => {
      this.loading = false
      if (res.status) {
        this.$emit('initData')
        this.$message.success('保存成功')
        this.handleClose()
      }
    }).catch(() => {
      this.loading = false
    })
  }

  created () {
    // 处理表头数据
    this.headData = this.handleHead(this.tableHead, [{ name: 'check', value: '' }])
    this.twoHeadData = this.handleHead(this.twoTableHead, [{ name: 'check', value: '' }, { name: '包详情', value: '' }])
    // 处理数据
    this.planeData = this.unfoldData(this.tableData)
  }
}
</script>

<style lang="scss">
  .reuseTable{
    .bagDetailBtn {
      color: #F08519;
    }

    .bagDetailBtn:hover {
      cursor: pointer;
      opacity: 0.5;
    }

    .el-table__expanded-cell[class*=cell]{
      padding: 10px 10px !important;
    }
    .width80{
      width: 80%;
      display: inline-block;
    }
    .numeric-alphabet-line-feed{
      word-break:break-all;
      word-wrap:break-word;
    }
  }
</style>
