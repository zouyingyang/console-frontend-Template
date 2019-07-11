<template>
  <div>
    <div v-loading="loading" class="my-delivery-installation-print" v-show="!$route.meta.hidden">
      <Card>
        <el-col :span="24" slot="head">
          <el-col :span="24">
            <el-form :model="params" :inline="true" class="searchBox el-right" @submit.native.prevent>
              <el-form-item label="" style="float: left;">
                <el-button
                  @click="toAddPage"
                  size="mini"
                  v-if="checkPermission('AddToOrderBtn')"
                  type="primary">
                  新增送货安装单
                </el-button>
                <el-button
                  @click="outStorage"
                  size="mini" type="primary"
                  v-if="checkPermission('BatchOutOfStockBtn')">
                  批量完成出库
                </el-button>
                <el-button
                  @click="deliveryPlan"
                  size="mini" type="primary"
                  v-if="checkPermission('BatchModificationOfDeliveryPlanBtn')">
                  批量修改送货计划
                </el-button>
                <el-button
                  @click="InstallPlan"
                  size="mini"
                  type="primary"
                  v-if="checkPermission('BatchModificationOfInstallationPlanBtn')">
                  批量修改安装计划
                </el-button>
                <el-button
                  @click="cancellation"
                  size="mini"
                  type="primary"
                  v-if="checkPermission('BatchInvalidationBtn')">
                  批量作废
                </el-button>
                <el-button
                  @click="onDeclareResidual"
                  size="mini"
                  type="primary"
                  v-if="checkPermission('AddToResidual')">
                  遗留申报
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  style="margin-left: 50px"
                  v-if="checkPermission('PrintToOderBtn')"
                  @click="print">
                  打印送货安装单
                </el-button>
                <!--<el-button size="mini" type="primary">导出清单</el-button>-->
              </el-form-item>

              <el-form-item class="op-right topRight">
                <el-tooltip class="item" effect="dark" content="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址" placement="top">
                  <el-input
                    maxlength="50"
                    size="mini"
                    clearable
                    placeholder="送货安装单号、工厂合同自编号、客户名称、客户手机号、客户地址"
                    v-model="params.searchKeyword"
                    @keyup.enter.native="submitSearch">
                  </el-input>
                </el-tooltip>
                <el-button
                  size="mini"
                  type="primary"
                  @click="submitSearch"
                  v-show="!seniorSearchFlag">
                  查询
                </el-button>
                <el-button type="primary" size="mini" @click="seniorSearchFlag = !seniorSearchFlag">
                  {{seniorSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" v-show="seniorSearchFlag">
            <el-form :model="params" :inline="true">
              <el-row>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="车辆" size="mini">
                      <!-- <el-input
                        clearable
                        maxlength="20"
                        size="mini"
                        placeholder="请输入车辆"
                        v-model="params.plateNum">
                      </el-input> -->
                      <el-autocomplete
                       clearable
                       class="auto_input"
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
                      <!-- <el-input
                        clearable
                        maxlength="20"
                        size="mini"
                        placeholder="请输入司机"
                        v-model="params.driver">
                      </el-input> -->
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
                  <el-col :span="8">
                    <el-form-item label="单据状态" size="mini">
                      <el-select placeholder="单据状态" size="mini" v-model="params.status">
                        <el-option
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          v-for="item in options.status">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="品牌" size="mini">
                      <el-select placeholder="选择品牌" size="mini" v-model="params.brand">
                        <el-option
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          v-for="item in options.brand">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品类" size="mini">
                      <el-select placeholder="选择品类" size="mini" v-model="params.category">
                        <el-option
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          v-for="item in options.category">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="订单状态" size="mini">
                      <el-select placeholder="选择选择订单状态" size="mini" v-model="params.orderStatus">
                        <el-option
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          v-for="item in options.orderStatus">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="预约送货日期" size="mini">
                      <el-date-picker
                        value-format="timestamp"
                        size="mini"
                        v-model="plannedDeliveryTime"
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
                    <el-form-item label="预约安装日期" size="mini">
                      <el-date-picker
                        value-format="timestamp"
                        size="mini"
                        v-model="plannedInstallationTime"
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
                    <el-form-item label="合同交期" size="mini">
                      <el-date-picker
                        value-format="timestamp"
                        size="mini"
                        v-model="contractDeliverDt"
                        style="width: 260px;"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
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
                          style="width: 280px;"
                          type="datetimerange"
                          :default-time="['10:00:00']"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8">
                    <el-form-item label="是否送装一体" size="mini">
                      <el-checkbox-group v-model="deliveryInstallModel" @change="deliveryInstallModelChange">
                        <el-checkbox name="deliveryInstallModel" label="1" >是</el-checkbox>
                        <el-checkbox name="deliveryInstallModel" label="0" >否</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-row style="margin-bottom:22px;float:right;">
                    <el-button type="primary" size="mini" @click="advancedSearch">高级查询</el-button>
                    <el-button type="primary" size="mini" @click="paramsReset">清空所有条件</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-col>

        <ReuseTable
          slot="content"
          ref="reuseTableRef"
          type="deliveryInstallationList"
          :tableHead="tableHead"
          :tableData="tableData"
          @initData="initData(pageNum = 1)"
          :twoTableHead="twoTableHead"
          :isCheck="true">
        </ReuseTable>

        <!-- 分页 -->
        <el-pagination
          slot="foot"
          class="busPagin"
          @current-change="changeCurrentPage"
          @size-change="handleSizeChange"
          :current-page="params.pageNum"
          :page-size="params.pageSize"
          :page-sizes="[20, 50, 100]"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </Card>

      <!--批量完成出库弹窗-->
      <el-dialog
        class="delivery-installation-dialog"
        title="确认出库"
        :visible.sync="isShowOutStorage"
        :close-on-click-modal="false"
        v-loading="twoLoading"
        width="30%"
        center>
        <h3>温馨提示</h3>
        <p>请确认是否出库<span class="red">{{outStockParams.pieces}}件</span></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowOutStorage = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitOutStorage" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!--批量修改送货计划弹窗-->
      <el-dialog
        class="delivery-installation-dialog"
        title="送货计划"
        :visible.sync="isShowDeliveryPlan"
        :close-on-click-modal="false"
        v-loading="twoLoading"
        width="56%"
        center>
        <div class="plan">
          <el-row>
            <el-form>
              <el-row>
                <el-col :span="12">
                  <el-form-item label=" " :rules="rules.radio1">
                    <el-radio-group v-model="mulModifyDeliverPlan.deliveryInstallModel">
                      <el-radio :label="0">送装分离</el-radio>
                      <el-radio :label="1">送装一体</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="送货车辆" size="mini">
                    <!-- <el-input
                      clearable
                      maxlength="20"
                      size="mini"
                      v-model="mulModifyDeliverPlan.plateNum"
                      placeholder="请输入送货车辆">
                    </el-input> -->
                    <el-autocomplete
                     clearable
                     class="auto_input"
                     :maxlength="20"
                     value-key="plateNum"
                     v-model="mulModifyDeliverPlan.plateNum"
                     :fetch-suggestions="getAllPlateSelect"
                     @blur="blurSave('plateNum',mulModifyDeliverPlan.plateNum)"
                     @select="autocompleteSelect('plateNum',arguments)"
                     placeholder="请输入送货车辆"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="司机" size="mini">
                    <!-- <el-input
                      clearable
                      maxlength="20"
                      size="mini"
                      v-model="mulModifyDeliverPlan.driver"
                      placeholder="请输入司机">
                    </el-input> -->
                    <el-autocomplete
                     class="auto_input"
                     clearable
                     :maxlength="20"
                     value-key="driver"
                     v-model="mulModifyDeliverPlan.driver"
                     :fetch-suggestions="getAllDriverSelect"
                     @blur="blurSave('driver',mulModifyDeliverPlan.driver)"
                     @select="autocompleteSelect('driver',arguments)"
                     placeholder="请输入司机"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预约送货时间" size="mini" :rules="rules.planTime">
                    <el-date-picker
                      v-model="mulModifyDeliverPlan.plannedDeliveryTime"
                      type="datetime"
                      default-time="9:00:00"
                      value-format="timestamp"
                      placeholder="选择时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="送货责任人" size="mini" value="1" :rules="rules.deliverPersonValue">
                    <el-tag v-if="deliveryOwner" size="mini">{{deliveryOwner}}</el-tag>
                    <el-tag v-else class="checkTag" size="mini">{{'暂未选择'}}</el-tag>
                    <el-button type="text" @click="choiceDeliveryOwner">选择</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
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
                <el-col>
                  <el-form-item
                    label="备注"
                    :label-width="formLabelWidth">
                    <el-input
                      clearable
                      maxlength="100"
                      style="width:93%"
                      type="textarea"
                      v-model="mulModifyDeliverPlan.deliveryRemark">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowDeliveryPlan = false" size="mini">取 消</el-button>
          <el-button
            v-if="mulModifyDeliverPlan.deliveryInstallModel===null ||
            !mulModifyDeliverPlan.plannedDeliveryTime ||
            !mulModifyDeliverPlan.deliveryOwner"
            type="primary" disabled size="mini">确 定</el-button>
          <el-button v-else type="primary" @click="submitDeliveryPlan" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!--批量修改安装计划弹窗-->
      <el-dialog
        class="delivery-installation-dialog"
        title="安装计划"
        :visible.sync="isShowInstallPlan"
        :close-on-click-modal="false"
        v-loading="twoLoading"
        width="56%"
        center>
        <div class="plan">
          <el-row>
            <el-form>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="预约安装时间" size="mini" :rules="rules.planTime">
                    <el-date-picker
                      value-format="timestamp"
                      v-model="mulModifyInstallPlan.plannedInstallationTime"
                      type="datetime"
                      default-time="9:00:00"
                      placeholder="选择时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="安装责任人" size="mini" value="1" :rules="rules.deliverPersonValue">
                    <el-tag v-if="installationOwner" size="mini">{{installationOwner}}</el-tag>
                    <el-tag v-else class="checkTag" size="mini">{{'暂未选择'}}</el-tag>
                    <el-button type="text" @click="choiceDeliveryMan">选择</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="安装协助人" size="mini" value="1" class="mulCheck">
                    <el-tag class="checkTag" v-if="installationFacilitator.length===0" size="mini">暂未选择</el-tag>
                    <el-tag v-else v-for="(item,index) in installationFacilitator" :key="index"
                            size="mini">{{item.name}}
                    </el-tag>
                    <el-button type="text" @click="mulChoiceDeliveryMan">选择</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item
                    label="备注"
                    :label-width="formLabelWidth">
                    <el-input style="width:93%" type="textarea"
                              clearable
                              maxlength="100"
                              v-model="mulModifyInstallPlan.installRemark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowInstallPlan = false" size="mini">取 消</el-button>
          <el-button
            v-if="!mulModifyInstallPlan.plannedInstallationTime||!mulModifyInstallPlan.installationOwner"
            type="primary" disabled size="mini">确 定</el-button>
          <el-button v-else type="primary" @click="submitInstallPlan" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!--批量作废弹窗-->
      <el-dialog
        class="delivery-installation-dialog"
        title="确认作废"
        :visible.sync="isShowCancellation"
        :close-on-click-modal="false"
        v-loading="twoLoading"
        width="30%"
        center>
        <h3>温馨提示</h3>
        <p>请确认是否作废选中的出库单</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowCancellation = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitCancellation" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!--安装责任人/协助人弹窗选择-->
      <el-dialog
        class="delivery-installation-dialog"
        :title="choose?'协助人选择':'责任人选择'"
        :visible.sync="isShowDeliveryMan"
        :close-on-click-modal="false"
        width="52%"
        center>
        <DeliveryAndSetter
          :type="type" :choose="choose"
          :dutyPreson="type===1?mulModifyDeliverPlan.deliveryOwner:mulModifyInstallPlan.installationOwner"
          :multipleValues="type===1?deliveryFacilitator:installationFacilitator"
          @choseDeliveryInstallStaff="chose"
          :changeState="isShowDeliveryMan"
          @multipleChoseDeliveryInstallStaff="multiplChose"></DeliveryAndSetter>
      </el-dialog>

      <!--查询商场弹窗-->
      <el-dialog
        class="delivery-installation-dialog SearchStore"
        :visible.sync="isShowSearchStore"
        append-to-body
        :title="getstoreByid ? '查询门店':'查询商场'"
        width="40%"
        top="3.4%"
        center
        :close-on-click-modal="false">
        <SearchStore
          key="getstoreByid1"
          :getstoreByid="getstoreByid"
          :checkMaketArr="checkMaketArr"
          :checkStoreArr="checkStoreArr"
          @chooseStore="chooseStore"
          :isShow="isShowSearchStore">
        </SearchStore>
      </el-dialog>

      <!--打印送货安装单-->
      <el-dialog
        class="delivery-installation-dialog"
        title="打印送货安装单"
        :visible.sync="isShowPrint"
        :close-on-click-modal="false"
        v-loading="twoLoading"
        width="30%"
        center>
        <h3>温馨提示</h3>
        <p>请确认是否打印</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowPrint = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitPrint" size="mini">确 定</el-button>
        </span>
      </el-dialog>
      <!--维度责任人选择弹窗-->
      <el-dialog
        class="deliveryAndSetter delivery-installation-dialog"
        :title="choose?'':'维度责任人选择'"
        :visible.sync="isShowDim"
        width="52%"
        height="45%"
        :close-on-click-modal="false"
        center
        append-to-body>
        <DeliveryAndSetter
          :type="type"
          :choose="choose"
          @choseDeliveryInstallStaff="choseDim"
          :multipleValues="[]"
          :changeState="isShowDim">
        </DeliveryAndSetter>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import ReuseTable from '../../delivery-installation/FullInfoTable/components/ReuseTable'
import DeliveryAndSetter from './components/DeliveryAndSetter'
import Card from '@/components/Card'
import SearchStore from '../OrderDispatchList/components/SearchStore'
import { format } from '@/utils/filter'

const deliveryInstallationList = namespace('delivery-installation/deliveryInstallationList')
const moduleUser = namespace('user')

  @Component({
    components: { ReuseTable, DeliveryAndSetter, Card, SearchStore },
    filters: { format }
  })
export default class DeliveryInstallation extends Vue {
    isShowDim = false
    dimOwner = []
    chooseUserArr = [] // 选择的用户单号
    loading = false
    twoLoading = false // 二级弹窗loading
    seniorSearchFlag = false // 显示隐藏高级搜索
    isShowOutStorage = false// 显示批量出库弹窗
    isShowDeliveryPlan = false// 显示批量修改送货计划
    isShowInstallPlan = false// 显示批量修改安装计划
    isShowCancellation = false// 显示批量作废
    isShowDeliveryMan = false// 显示安装责任人弹窗选择
    isShowPrint = false// 显示打印弹窗选择
    type = 2// 安装责任人弹窗请求数据类型 1-送货员 2-安装工
    choose = false// 责任人弹窗是否多选
    isShowSearchStore = false // 查询商场弹窗
    getstoreByid = false // 是否根据id查询门店
    installationOwner = ''// 安装责任人弹窗的安装责任人
    installationFacilitator = []// 安装协助人弹窗的安装协助人
    deliveryOwner = ''// 送货责任人弹窗的送货责任人
    deliveryFacilitator = []// 送货协助人弹窗的送货协助人
    plannedDeliveryTime = [] // 预约送货时间
    plannedInstallationTime = [] // 预约安装时间
    contractDeliverDt = [] // 合同交期
    deliveryInstallModel = [] // 送装一体
    checkMaketArr = [] // 选择的商场数组
    checkStoreArr = [] // 选择的门店数组
    dimDate = [] // 维度时间
    mulModifyDeliverPlan = { // 批量修改送货计划
      ids: '', // 送货安装单id
      deliveryFacilitator: [], // 送货协助人
      deliveryInstallModel: 0, // 0-送装分离 1-送装一体
      deliveryOwner: '', // 送货责任人
      deliveryRemark: '', // 送货备注
      driver: '', // 司机
      plannedDeliveryTime: null, // 计划送货时间
      plateNum: ''// 送货车辆（车辆车牌号
    }
    // 批量完成出库参数
    outStockParams = {
      ids: '',
      pieces: 0
    }
    // 打印送货安装单
    printParams = {
      ids: '',
      pieces: 0
    }
    mulModifyInstallPlan = { // 批量修改 安装 计划传参
      data: {}, // 要修改的数据
      installRemark: '', // 安装备注
      installationFacilitator: [], // 安装协助人
      installationOwner: '', // 安装负责人
      plannedInstallationTime: null// 计划安装时间
    }
    rules = {
      radio1: { required: true, message: '', trigger: 'blur' },
      planTime: { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
      deliverPersonValue: { required: true, message: '请输入预约送货责任人', trigger: 'change' }
    }
    formLabelWidth = '60px'
    small = '?x-oss-process=style/small'

    params = {
      marketName: '', // 商场名称
      marketNo: '', // 商场编码
      store: '',
      brand: '', // 品牌
      category: '', // 品类
      deliveryInstallModel: '', // 是否送装一体
      driver: '', // 司机
      orderStatus: '', // 订单状态
      plannedDeliveryTimeBegin: '', // 预约送货时间（始）
      plannedDeliveryTimeEnd: '', // 预约送货时间（止）
      plannedInstallationTimeBegin: '', // 预约安装时间（始
      plannedInstallationTimeEnd: '', // 预约安装时间（止)
      plateNum: '', // 车辆
      dim: '', // 查询维度
      dimOwner: '', // 维度责任人
      dimTimeStart: '', // 查询维度开始时间
      dimTimeEnd: '', // 查询维度结束时间
      searchKeyword: '', // 普通搜索
      status: '', // 单据状态
      pageNum: 1, // 第几页
      pageSize: 10// 每页显示多少条
    }
    total = 80
    tableData = [] // 列表数据
    tableHead = [
      { name: '送货安装单号', value: 'installNo', isRowspan: true },
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'customerTel', isRowspan: true },
      { name: '客户地址', value: 'customerAddress', isRowspan: true },
      { name: '车牌号', value: 'plateNum', isRowspan: true },
      { name: '司机', value: 'driver', isRowspan: true },
      { name: '生成时间', value: 'createTime', isRowspan: true },
      { name: '生成人', value: 'dispatchUserName', isRowspan: true },
      { name: '单据状态', value: 'status', isRowspan: true },
      { name: '查看详情', value: 'A111' },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '客户跟踪', value: 'customerTracking' },
      { name: '订单内容', value: 'orderContent' },
      { name: '合同交期', value: 'contractDeliverDt' },
      { name: '品牌', value: 'brand' },
      { name: '品类', value: 'category' },
      { name: '是否遗留单', value: 'leavelFlag' },
      { name: '已出库数量', value: 'stockOut' },
      { name: '待出库数量', value: 'stockQuantity' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '订单状态', value: 'orderStatus' },
      { name: '是否送装分离', value: 'deliveryInstallModel' },
      { name: '预约送货时间', value: 'plannedDeliveryTime' },
      { name: '送货责任人', value: 'deliveryOwnerName' },
      { name: '送货协助人', value: 'deliveryFacilitatorName' },
      { name: '预约安装时间', value: 'plannedInstallationTime' },
      { name: '安装责任人', value: 'installationOwnerName' },
      { name: '安装协助人', value: 'installationFacilitatorName' },
      { name: '实际送货时间', value: 'realDeliveryTime' },
      { name: '实际安装时间', value: 'realInstallTime' },
      { name: '送货备注', value: 'deliveryRemark' },
      { name: '安装备注', value: 'installRemark' },
      { name: '送货完成备注', value: 'deliveryCompleteRemark' },
      { name: '安装完成备注', value: 'installCompleteRemark' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编号', value: 'marketCode' },
      { name: '门店', value: 'shopName' }
      // { name: '是否遗留单', value: 'leavelFlag' }
    ]
    twoTableHead = [
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '是否送装分离', value: 'deliveryInstallModel' },
      { name: '预约送货时间', value: 'plannedDeliveryTime' },
      { name: '送货责任人', value: 'deliveryOwnerName' },
      { name: '预约安装时间', value: 'plannedInstallationTime' },
      { name: '安装责任人', value: 'installationOwnerName' },
      { name: '实际送货时间', value: 'realDeliveryTime' },
      { name: '实际安装时间', value: 'realInstallTime' },
      { name: '安装协助人', value: 'installationFacilitatorName' }
      // { name: '备注', value: 'remark' },
      // { name: '商场名称', value: 'marketName' },
      // { name: '商场编号', value: 'marketCode' },
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
      // 送货安装状态
      status: [
        { value: '', label: '全部' },
        { value: '40', label: '待出库' },
        { value: '70', label: '待送货' },
        { value: '90', label: '待安装' },
        { value: '100', label: '部分安装' },
        { value: '110', label: '已安装' },
        { value: '120', label: '已验收' }
      ],
      // 订单状态
      orderStatus: [
        { value: '', label: '全部' },
        { value: '40', label: '待出库' },
        { value: '70', label: '待送货' },
        { value: '90', label: '待安装' },
        { value: '100', label: '部分安装' },
        { value: '110', label: '已安装' }
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

    // 权限控制
    @moduleUser.Getter permission
    // 查询送货安装单列表接口
    @deliveryInstallationList.Action deliveryDispatch
    // 批量修改送货计划接口
    @deliveryInstallationList.Action mulModifyDeliverPlanPort
    // 批量修改安装计划接口
    @deliveryInstallationList.Action mulModifyInstallPlanPort
    // 批量完成出库
    @deliveryInstallationList.Action mulStockOut
    // 批量作废
    @deliveryInstallationList.Action mulCancel
    // 获取司机列表
    @deliveryInstallationList.Action driverList
    // 获取车辆列表
    @deliveryInstallationList.Action plateNumList
    // 保存司机和送货车辆信息
    @deliveryInstallationList.Action saveDriverAndPlateNum

    // 数据初始化
    initData (pageNum = 1, searchKeyword) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      this.loading = true
      let params = {}
      if (searchKeyword) {
        params.searchKeyword = this.params.searchKeyword
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
      } else {
        params = JSON.parse(JSON.stringify(this.params))
        params.deliveryInstallModel = this.deliveryInstallModel.length ? this.deliveryInstallModel[0] * 1 : null
        if (this.plannedDeliveryTime && this.plannedDeliveryTime.length) {
          params.plannedDeliveryTimeBegin = this.plannedDeliveryTime[0]
          params.plannedDeliveryTimeEnd = this.plannedDeliveryTime[1]
        } else {
          params.plannedDeliveryTimeBegin = null
          params.plannedDeliveryTimeEnd = null
        }
        if (this.plannedInstallationTime && this.plannedInstallationTime.length) {
          params.plannedInstallationTimeBegin = this.plannedInstallationTime[0]
          params.plannedInstallationTimeEnd = this.plannedInstallationTime[1]
        } else {
          params.plannedInstallationTimeBegin = null
          params.plannedInstallationTimeEnd = null
        }
        if (this.contractDeliverDt && this.contractDeliverDt.length) {
          params.contractDeliverDtBegin = this.contractDeliverDt[0]
          params.contractDeliverDtEnd = this.contractDeliverDt[1]
        } else {
          params.contractDeliverDtBegin = null
          params.contractDeliverDtEnd = null
        }
        if (this.dimDate && this.dimDate.length) {
          params.dimTimeStart = this.dimDate[0]
          params.dimTimeEnd = this.dimDate[1]
        } else {
          params.dimTimeStart = null
          params.dimTimeEnd = null
        }
        if (this.dimOwner && this.dimOwner.length) {
          params.dimOwner = this.dimOwner[0].id
        } else {
          params.dimOwner = null
        }
      }
      this.deliveryDispatch(params).then(res => {
        console.log('获取送货安装单列表res', res)
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
        // this.$message.error('获取送货安装单error')
        this.loading = false
        console.log('送货安装单error', error)
      })
    }

    // 普通搜索
    submitSearch () {
      this.initData(false, true)
    }
    deliveryInstallModelChange (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.deliveryInstallModel = []
        this.deliveryInstallModel.push(arr[1])
      }
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
        this.choose = false
      }
      this.isShowDim = true
    }
    // 选择责任人关闭
    choseDim (data) {
      this.dimOwner = []
      this.dimOwner.push(data)
      this.isShowDim = false
    }

    // 商场查询反写
    chooseStore (data) {
      console.log('商场查询反写', data)
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

    // 选择安装责任人确认
    chose (data) {
      if (this.type === 2) {
        this.mulModifyInstallPlan.installationOwner = data.id
        this.installationOwner = data.name
      } else if (this.type === 1) {
        this.mulModifyDeliverPlan.deliveryOwner = data.id
        this.deliveryOwner = data.name
      }
      this.isShowDeliveryMan = false
    }

    // 选择协助人确认
    multiplChose (data) {
      if (this.type === 2) { // 安装协助人
        this.mulModifyInstallPlan.installationFacilitator = []
        this.installationFacilitator = []
        if (data.length) {
          data.forEach((item, index) => {
            this.installationFacilitator.push(item)
            this.mulModifyInstallPlan.installationFacilitator.push(item.id)
          })
        }
      } else if (this.type === 1) { // 送货协助人
        this.mulModifyDeliverPlan.deliveryFacilitator = []
        this.deliveryFacilitator = []
        if (data.length) {
          data.forEach((item, index) => {
            this.mulModifyDeliverPlan.deliveryFacilitator.push(item.id)
            this.deliveryFacilitator.push(item)
          })
        }
      }

      this.isShowDeliveryMan = false
    }
    // 重置批量修改送货计划参数
    clearMulModifyDeliverPlan () {
      this.mulModifyDeliverPlan.deliveryFacilitator = []
      this.mulModifyDeliverPlan.deliveryInstallModel = 0
      this.mulModifyDeliverPlan.deliveryOwner = ''
      this.mulModifyDeliverPlan.deliveryRemark = ''
      this.mulModifyDeliverPlan.driver = ''
      this.mulModifyDeliverPlan.plannedDeliveryTime = null
      this.mulModifyDeliverPlan.plateNum = ''
    }

    // 重置批量修改安装计划参数
    clearMulModifyInstallPlan () {
      this.installationFacilitator = []
      this.installationOwner = ''
      this.mulModifyInstallPlan.installRemark = ''
      this.mulModifyInstallPlan.plannedInstallationTime = null
    }
    // 批量修改安装计划
    InstallPlan () {
      let chooseArr = this.getCheckTableData()
      if (this.chooseUserArr.length === 1) {
        this.installationFacilitator = []
        this.mulModifyInstallPlan.installationFacilitator = []
        if (!!chooseArr[0].installationFacilitatorName && chooseArr[0].installationFacilitatorName.indexOf(',')) {
          chooseArr[0].installationFacilitatorName.split(',').forEach((item, index) => {
            let obj = {}
            obj.name = item
            obj.id = chooseArr[0].installationFacilitator.split(',')[index]
            this.installationFacilitator.push(obj)
            this.mulModifyInstallPlan.installationFacilitator.push(obj.id)
          })
        } else if (chooseArr[0].installationFacilitatorName && !chooseArr[0].installationFacilitatorName.indexOf(',')) {
          let obj = {}
          obj.name = chooseArr[0].installationFacilitatorName
          obj.id = chooseArr[0].installationFacilitator
          this.installationFacilitator.push(obj)
          this.mulModifyInstallPlan.installationFacilitator.push(obj.id)
        }
        this.installationOwner = chooseArr[0].installationOwnerName
        this.mulModifyInstallPlan.installationOwner = chooseArr[0].installationOwner
        this.mulModifyInstallPlan.installRemark = chooseArr[0].installRemark
        this.mulModifyInstallPlan.plannedInstallationTime = chooseArr[0].plannedInstallationTime
      } else {
        this.mulModifyInstallPlan.installationFacilitator = []
        this.installationFacilitator = []
        this.installationOwner = ''
        this.mulModifyInstallPlan.installationOwner = ''
        this.mulModifyInstallPlan.installRemark = ''
        this.mulModifyInstallPlan.plannedInstallationTime = null
      }
      if (this.getCheckTableData() && this.getCheckTableData().length) {
        let isInstall = true
        this.getCheckTableData().forEach(list => {
          if (list.status >= 120) {
            isInstall = false
          }
        })
        if (!isInstall) {
          this.$message.error('当前选择记录存在已完成安装数据，不能重复安装！')
          return
        }
        this.mulModifyInstallPlan.data = this.getReuseTableData().map(list => {
          return {
            custId: list.id,
            orders: [
              {
                leve2: list.clsleve2 ? list.clsleve2.filter(i => {
                  return i.checked
                }).map(j => {
                  return { id: j.id }
                }) : '',
                orderId: list.orderId
              }
            ]
          }
        })
        this.isShowInstallPlan = true
      }
    }

    // 批量修改安装计划确认
    submitInstallPlan () {
      let params = JSON.parse(JSON.stringify(this.mulModifyInstallPlan))
      params.installationFacilitator = params.installationFacilitator.join(',')
      // console.log('修改安装计划确认数据',params)
      this.twoLoading = true
      this.mulModifyInstallPlanPort(params).then(res => {
        this.twoLoading = false
        this.isShowInstallPlan = false
        if (res.status) {
          this.$message.success('批量修改安装计划成功')
          this.initData()
        }
      }).catch(error => {
        this.twoLoading = false
        this.isShowInstallPlan = false
        console.log('批量修改安装error', error)
      })
    }

    // 批量修改送货计划
    deliveryPlan () {
      let chooseArr = this.getReuseTableData()
      if (this.chooseUserArr.length === 1) {
        this.deliveryFacilitator = []
        this.mulModifyDeliverPlan.deliveryFacilitator = []
        if (!!chooseArr[0].deliveryFacilitatorName && chooseArr[0].deliveryFacilitatorName.indexOf(',')) {
          chooseArr[0].deliveryFacilitatorName.split(',').forEach((item, index) => {
            let obj = {}
            obj.name = item
            obj.id = chooseArr[0].deliveryFacilitator.split(',')[index]
            this.deliveryFacilitator.push(obj)
            this.mulModifyDeliverPlan.deliveryFacilitator.push(obj.id)
          })
        } else if (chooseArr[0].deliveryFacilitatorName && !chooseArr[0].deliveryFacilitatorName.indexOf(',')) {
          let obj = {}
          obj.name = chooseArr[0].deliveryFacilitatorName
          obj.id = chooseArr[0].deliveryFacilitator
          this.deliveryFacilitator.push(obj)
          this.mulModifyDeliverPlan.deliveryFacilitator.push(obj.id)
        }
        this.mulModifyDeliverPlan.deliveryInstallModel = chooseArr[0].deliveryInstallModel * 1
        this.deliveryOwner = chooseArr[0].deliveryOwnerName
        this.mulModifyDeliverPlan.deliveryOwner = chooseArr[0].deliveryOwner
        this.mulModifyDeliverPlan.deliveryRemark = chooseArr[0].deliveryRemark
        this.mulModifyDeliverPlan.driver = chooseArr[0].driver
        this.mulModifyDeliverPlan.plannedDeliveryTime = chooseArr[0].plannedDeliveryTime
        this.mulModifyDeliverPlan.plateNum = chooseArr[0].plateNum
      } else {
        this.mulModifyDeliverPlan.deliveryFacilitator = []
        this.deliveryFacilitator = []
        this.mulModifyDeliverPlan.deliveryInstallModel = 0
        this.deliveryOwner = ''
        this.mulModifyDeliverPlan.deliveryOwner = ''
        this.mulModifyDeliverPlan.deliveryRemark = ''
        this.mulModifyDeliverPlan.driver = ''
        this.mulModifyDeliverPlan.plannedDeliveryTime = null
        this.mulModifyDeliverPlan.plateNum = ''
      }
      if (this.getReuseTableData() && this.getReuseTableData().length) {
        let idsArr = []
        let isDelivery = true
        this.getReuseTableData().forEach(list => {
          if (list.status >= 110) {
            isDelivery = false
          }
          idsArr.push(list.id)
        })
        if (!isDelivery) {
          this.$message.error('当前选择记录存在已完成安装数据，不能重复安装！')
          return
        }
        idsArr = Array.from(new Set(idsArr))
        this.mulModifyDeliverPlan.ids = idsArr.join(',')
        this.isShowDeliveryPlan = true
      }
    }

    // 批量修改送货计划确认
    submitDeliveryPlan () {
      let params = JSON.parse(JSON.stringify(this.mulModifyDeliverPlan))
      params.deliveryFacilitator = params.deliveryFacilitator.join(',')
      this.twoLoading = true
      // console.log('修改送货计划确认数据',JSON.stringify(params))
      this.mulModifyDeliverPlanPort(params).then(res => {
        this.twoLoading = false
        this.isShowDeliveryPlan = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status) {
          this.initData()
          this.$message.success('批量修改送货计划成功')
        }
      }).catch(error => {
        this.twoLoading = false
        this.isShowDeliveryPlan = false
        // this.$message.error('批量修改送货计划失败')
        console.log('修改送货计划error', error)
      })
    }

    // 批量作废
    cancellation () {
      let idsArr = []
      if (this.getReuseTableData() && this.getReuseTableData().length) {
        let isCancellation = true
        this.getReuseTableData().forEach(list => {
          if (list.status !== '40') {
            isCancellation = false
          }
          idsArr.push(list.id)
        })
        if (!isCancellation) {
          this.$message.error('当前所选记录状态不能作废，请检查选择项！')
          return
        }
        idsArr = Array.from(new Set(idsArr))
        this.outStockParams.ids = idsArr.join(',')
        this.isShowCancellation = true
      }
    }

    // 遗留申报
    onDeclareResidual () {
      let idsArr = []
      if (this.getCheckTableData('DeclareResidual') && this.getCheckTableData('DeclareResidual').length) {
        this.getCheckTableData('DeclareResidual').forEach(list => {
          idsArr.push(list)
        })
        // idsArr = Array.from(new Set(idsArr))
        this.$router.push({
          path: '/delivery-installation/delivery-installation-list/add-to-residual',
          query: {
            id: idsArr[0].orderId, // 遗留申报只能选一条订单，所以数组只有一条数据
            orderNo: idsArr[0].orderNo,
            factoryContractNo: idsArr[0].factoryContractNo // 工厂合同自编号
          }
        })
      }
    }

    // 批量作废确认
    submitCancellation () {
      this.twoLoading = true
      this.mulCancel({ ids: this.outStockParams.ids }).then(res => {
        this.isShowCancellation = false
        this.twoLoading = false
        this.$message.success('批量作废成功')
        this.initData()
      }).catch(error => {
        this.isShowCancellation = false
        this.loading = false
        this.$message.error('批量作废失败')
        console.log('批量出库确认error', error)
      })
    }
    advancedSearch () { // 高级搜索
      this.initData()
    }
    // 跳转到打印页面
    print () {
      let idsArr = []
      if (this.getReuseTableData() && this.getReuseTableData().length) {
        this.getReuseTableData().forEach(list => {
          idsArr.push(list.deliveryInstallId)
        })
        idsArr = Array.from(new Set(idsArr))
        this.printParams.ids = idsArr.join(',')
        this.isShowPrint = true
      }
    }

    submitPrint () {
      this.isShowPrint = false
      this.$router.push({
        name: 'print-page',
        query: {
          ids: this.printParams.ids
        }
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

    // 重置搜索参数
    paramsReset () {
      this.params.marketId = ''
      this.params.store = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.params.searchKeyword = ''
      this.dimOwner = []
      this.params.plateNum = ''
      this.params.driver = ''
      this.params.status = ''
      this.params.brand = ''
      this.params.category = ''
      this.params.orderStatus = ''
      this.params.dim = ''
      this.params.dimOwner = ''
      this.plannedDeliveryTime = []
      this.plannedInstallationTime = []
      this.contractDeliverDt = []
      this.deliveryInstallModel = []
      this.dimDate = []
      this.checkMaketArr = []
      this.checkStoreArr = []
    }

    // 跳转到送货安装单页面
    toAddPage () {
      this.$router.push({
        name: 'add-to-order'
      })
    }

    // 批量完成出库
    outStorage () {
      let idsArr = []
      this.outStockParams.pieces = 0
      if (this.getReuseTableData() && this.getReuseTableData().length) {
        let isOutStorage = true
        this.getReuseTableData().forEach(list => {
          if (list.status !== '40') {
            isOutStorage = false
          }
          idsArr.push(list.id)
          this.outStockParams.pieces += list.stockQuantity - 0
        })
        if (!isOutStorage) {
          this.$message.error('当前选择记录存在已出库数据，不能重复出库！')
          return
        }
        idsArr = Array.from(new Set(idsArr))
        this.outStockParams.ids = idsArr.join(',')
        this.isShowOutStorage = true
      }
    }

    // 批量出库确认
    submitOutStorage () {
      this.twoLoading = true
      this.mulStockOut({ ids: this.outStockParams.ids }).then(res => {
        this.isShowOutStorage = false
        this.twoLoading = false
        this.$message.success('批量出库成功')
        this.initData()
        // console.log('批量出库确认res', res)
      }).catch(() => {
        this.isShowOutStorage = false
        this.loading = false
      })
    }

    // 获取列表选择数据
    getReuseTableData () {
      this.outStockParams.pieces = 0
      let idsArr = []
      this.chooseUserArr = []
      this.$refs.reuseTableRef.getCheckedData().forEach(list => {
        if (list.userChecked) {
          if (this.chooseUserArr.indexOf(list.id) !== -1) {
            this.chooseUserArr.splice(this.chooseUserArr.indexOf(list.id), 1)
          }
          this.chooseUserArr.push(list.id)
          idsArr.push(list)
        }
      })

      if (!idsArr.length) {
        this.$message.warning('您还没有选择订单')
        return false
      }
      return idsArr
    }

    // 获取列表选择数据
    getCheckTableData (key) {
      this.outStockParams.pieces = 0
      let idsArr = []
      this.chooseUserArr = []
      this.$refs.reuseTableRef.getCheckedData().forEach(list => {
        if (list.userChecked && list.checked) {
          if (this.chooseUserArr.indexOf(list.id) !== -1) {
            this.chooseUserArr.splice(this.chooseUserArr.indexOf(list.id), 1)
          }
          this.chooseUserArr.push(list.id)
          idsArr.push(list)
        }
      })
      if (key === 'DeclareResidual' && idsArr.length !== 1) {
        this.$message.warning('请选择一条订单申报遗留内容')
        return false
      }
      if (!idsArr.length) {
        this.$message.warning('您还没有选择订单')
        return false
      }
      return idsArr
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
      this.initData()
    }
  }
</script>

<style src="./style.scss" lang="scss">
 .auto_input{
    .el-input {
      width: 80%;
    }
  }
</style>
