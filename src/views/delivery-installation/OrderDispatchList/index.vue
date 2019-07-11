<template>
  <div>
    <div class="order-dispatch-list" v-show="!$route.meta.hidden">
      <el-tabs v-model="activeName" @tab-click="handleClick" v-loading="loading">
        <el-tab-pane label="未调度列表" name="never">
          <Card>
            <el-col :span="24" slot="head">
              <el-col :span="24">
                <el-form :inline="true" class="searchBox el-right" @submit.native.prevent>
                  <el-row>
                    <el-col :span="24">
                      <!--<el-col :span="12">-->
                        <!--<el-form-item class="op-left">-->
                          <!--<el-button type="primary" size="mini" icon="el-icon-upload2">导出</el-button>-->
                          <!--<el-button type="primary" size="mini" icon="el-icon-plus">导入</el-button>-->
                          <!--<el-button type="text" size="mini" icon="el-icon-download">下载导入摸板</el-button>-->
                        <!--</el-form-item>-->
                      <!--</el-col>-->
                      <el-col :span="24">
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
                    <el-col>
                      <el-form-item class="op-left">
                        <el-button @click="batchJoin" type="primary" size="mini">批量加入送货安装列表</el-button>
                      </el-form-item>
                      <el-form-item class="op-left" v-show="!isShowNeverSearch">
                        <!-- <el-checkbox v-model="ordinaryParams.localStore" label=true @change="initData">本商场</el-checkbox> -->
                        <el-checkbox v-model="ordinaryParams.serviceNoComplete" label="2" @change="initData">客户齐套</el-checkbox>
                        <el-checkbox v-model="ordinaryParams.isComplete" label=true @change="initData">订单齐套</el-checkbox>
                        <el-checkbox v-model="ordinaryParams.servicenoIsComplete" label=true @change="initData">服务单是否齐套</el-checkbox>
                        <el-checkbox-group @change="chooseNDay" class="op-right" v-model="nDays" >
                          <el-checkbox class="margin-right" label="5" >5天内到期</el-checkbox>
                          <el-checkbox class="margin-right" label="3" >3天内到期</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox v-model="ordinaryParams.isExpired" label=true @change="initData">过期</el-checkbox>
                        <el-checkbox v-model="ordinaryParams.isBack" label=true @change="initData">是否返仓</el-checkbox>
                      </el-form-item>
                      <el-form-item class="op-right no-margin-right">
                        <el-tooltip class="item" effect="dark" content="客户名称、客户手机号、客户地址、工厂合同自编号" placement="top">
                          <el-input
                            style="width:180px;margin-right: 10px"
                            @keyup.enter.native="receiptTicketSearch"
                            v-model="params.searchKeyword"
                            clearable
                            class='receiptSearch'
                            maxlength="100"
                            size="mini" placeholder="客户名称、客户手机号、客户地址、工厂合同自编号">
                          </el-input>
                        </el-tooltip>
                        <el-button v-show="!isShowNeverSearch" @click="receiptTicketSearch" size="mini" type="primary">
                          查询
                        </el-button>
                        <el-button type="primary" size="mini" @click="isShowNeverSearch = !isShowNeverSearch">
                          {{isShowNeverSearch ? '收起高级搜索' : '展开高级搜索'}}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="24" class="op-margin-top-20" v-show="isShowNeverSearch">
                <el-form :model="params" class="searchParams" :inline="true">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="客户是否齐套" size="mini">
                        <el-checkbox-group @change="chooseserviceNoComplete" class="op-right" v-model="neverServiceNoComplete" >
                          <el-checkbox  label="2" name="serviceNoComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="serviceNoComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="serviceNoComplete">未收货</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="订单是否齐套" size="mini">
                        <el-checkbox-group @change="chooseisComplete" class="op-right" v-model="neverIsComplete" >
                          <el-checkbox  label="2" name="isComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="isComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="isComplete">未收货</el-checkbox>
                        </el-checkbox-group>
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
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="合同交期" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="neverExpectDate"
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
                      <el-form-item size="mini" label="工厂计划交期">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="neverFactoryExpDate"
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
                          v-model="neverSrvCompleteDate"
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
                        <el-tag v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场名称</el-tag>
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
                    <el-col :span="24">
                      <el-row style="margin-bottom:22px;float:right;">
                        <el-button type="primary" size="mini" @click="receiptTicketSearch">高级查询</el-button>
                        <el-button type="primary" size="mini" @click="emptySearch()">清空所有条件</el-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-col>

            <ReuseTable
              slot="content"
              ref="undispatchedRef"
              type="undispatched"
              :tableHead="undispatchedTableHead"
              :tableData="tableData"
              :twoTableHead="twoTableHead"
              @initData="initData(pageNum = 1)"
              :isCheck="true">
            </ReuseTable>

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

          <!--加入送货安装列表弹窗-->
          <el-dialog
            title="加入送货安装列表-消息提示"
            :visible.sync="isShowBatchJoin"
            width="30%"
            :close-on-click-modal="false"
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
            width="90%"
            top="3.4%"
            center
            :close-on-click-modal="false"
            class="deliveryOrder">
            <ConfiguredOrder @changeDeliveryOrder="changeDeliveryOrder" @closeDeliveryOrder="close" :isShowDeliveryOrder="isShowDeliveryOrder" ></ConfiguredOrder>
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
            <SearchStore key="getstoreByid1"
                         :getstoreByid="getstoreByid"
                         :checkMaketArr="checkMaketArr"
                         :checkStoreArr="checkStoreArr"
                         @chooseStore="chooseStore"
                         :isShow="isShowSearchStore"></SearchStore>
          </el-dialog>

        </el-tab-pane>
        <el-tab-pane label="已调度列表" name="did">
          <Card>
            <el-col slot="head">
              <el-col :span="24">
                <el-form :inline="true" class="searchBox el-right"  @submit.native.prevent>
                  <el-row>
                    <!--<el-col :span="24">-->
                      <!--<el-col :span="12">-->
                        <!--<el-form-item class="op-left">-->
                          <!--<el-button type="primary" size="mini" icon="el-icon-upload2">导出</el-button>-->
                          <!--<el-button type="primary" size="mini" icon="el-icon-plus">导入</el-button>-->
                          <!--<el-button type="text" size="mini" icon="el-icon-download">下载导入摸板-->
                          <!--</el-button>-->
                        <!--</el-form-item>-->
                      <!--</el-col>-->
                    <!--</el-col>-->
                    <el-col>
                      <el-form-item class="op-left" v-show="!isShowDidSearch">
                        <!-- <el-checkbox v-model="ordinaryParams.localStore" label=true @change="initData">本商场</el-checkbox> -->
                        <el-checkbox v-model="ordinaryParams.serviceNoComplete" label="2" @change="initData">客户齐套</el-checkbox>
                        <el-checkbox v-model="ordinaryParams.isComplete" label="2" @change="initData">订单齐套</el-checkbox>
                        <el-checkbox v-model="ordinaryParams.servicenoIsComplete" label=true @change="initData">服务单是否齐套</el-checkbox>
                        <el-checkbox-group @change="chooseNDay" class="op-right" v-model="nDays">
                          <el-checkbox class="margin-right" label="5" >5天内到期</el-checkbox>
                          <el-checkbox class="margin-right" label="3" >3天内到期</el-checkbox>
                        </el-checkbox-group>
                        <el-checkbox v-model="ordinaryParams.isExpired" label="2" @change="initData">过期</el-checkbox>
                      </el-form-item>
                      <el-form-item class="op-right">
                        <el-tooltip class="item" effect="dark" content="客户名称、客户手机号、客户地址、工厂合同自编号" placement="top">
                          <el-input
                            style="width:180px;margin-right: 10px"
                            @keyup.enter.native="receiptTicketSearch"
                            v-model="params.searchKeyword"
                            clearable
                            maxlength="100"
                            class='receiptSearch'
                            size="mini" placeholder="客户名称、客户手机号、客户地址、工厂合同自编号">
                          </el-input>
                        </el-tooltip>
                        <el-button v-show="!isShowDidSearch" @click="receiptTicketSearch" size="mini" type="primary">
                          查询
                        </el-button>
                        <el-button type="primary" size="mini" @click="isShowDidSearch = !isShowDidSearch">
                          {{isShowDidSearch ? '收起高级搜索' : '展开高级搜索'}}
                        </el-button>
                      </el-form-item>

                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="24" style="margin-top: 10px" v-show="isShowDidSearch">
                <el-form :model="params" class="searchParams"  :inline="true">
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="客户是否齐套" size="mini">
                        <el-checkbox-group @change="chooseserviceNoComplete" class="op-right" v-model="didServiceNoComplete" >
                          <el-checkbox  label="2" name="serviceNoComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="serviceNoComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="serviceNoComplete">未收货</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                      <!--<el-form-item label="订单是否齐套" size="mini">-->
                        <!--<el-checkbox-group @change="chooseisComplete" class="op-right" v-model="didIsComplete" >-->
                          <!--<el-checkbox  label="2" name="isComplete">已齐套</el-checkbox>-->
                          <!--<el-checkbox  label="1" name="isComplete">部分齐套</el-checkbox>-->
                          <!--<el-checkbox  label="0" name="isComplete">未收货</el-checkbox>-->
                        <!--</el-checkbox-group>-->
                      <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="8">
                      <el-form-item label="订单状态" size="mini">
                        <el-select placeholder="选择选择订单状态" size="mini" v-model="params.status">
                          <el-option :key="item.value" :label="item.label" :value="item.value"
                                     v-for="item in options.status"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="合同交期" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="didExpectDate"
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
                    <el-col :span="10">
                      <el-form-item size="mini" label="工厂计划交期">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="didFactoryExpDate"
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
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item size="mini" label="预约送货日期">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="didPlannedDeliverDate"
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
                    <el-col :span="10">
                      <el-form-item size="mini" label="预约安装日期">
                        <el-date-picker
                          value-format="timestamp"
                          v-model="didPlannedInstallationDate"
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
                    <!--<el-col :span="8">-->
                      <!--<el-form-item size="mini" label="订单下单时间">-->
                        <!--<el-date-picker-->
                          <!--value-format="timestamp"-->
                          <!--v-model="didOrderData"-->
                          <!--size="mini"-->
                          <!--style="width: 260px;"-->
                          <!--type="datetimerange"-->
                          <!--:default-time="['10:00:00']"-->
                          <!--range-separator="至"-->
                          <!--start-placeholder="开始日期"-->
                          <!--end-placeholder="结束日期">-->
                        <!--</el-date-picker>-->
                      <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                      <!--<el-form-item label="评价结果" size="mini">-->
                      <!--<el-select v-model="stateValue" placeholder="请选择">-->
                      <!--<el-option v-for="item in params.state" :key="item.value"-->
                      <!--:label="item.label" :value="item.value">-->
                      <!--</el-option>-->
                      <!--</el-select>-->
                      <!--</el-form-item>-->
                    <!--</el-col>-->
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
                      <el-form-item label="验收结果" size="mini">
                        <el-checkbox-group @change="chooseisPass" class="op-right" v-model="isPass" >
                          <el-checkbox  label="1" name="isComplete">通过</el-checkbox>
                          <el-checkbox  label="0" name="isComplete">不通过</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="checkMaketTag">
                    <el-col :span="8">
                      <el-form-item label="商场名称" size="mini">
                        <el-tag v-if="!checkMaketArr.length" class="checkTag" size="mini">暂未选择商场名称</el-tag>
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
                          style="width: 280px;"
                          type="datetimerange"
                          :default-time="['10:00:00']"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-row style="margin-bottom:22px;float:right;">
                        <el-button type="primary" size="mini" @click="receiptTicketSearch">高级查询</el-button>
                        <el-button type="primary" size="mini" @click="emptySearch()">清空所有条件</el-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-col>

            <ReuseTable
              slot="content"
              ref="schedulingable"
              type="scheduling"
              :tableData="tableData"
              :tableHead="schedulingableHead"
              :twoTableHead="twoTableHead"
              @initData="initData(pageNum = 1)"
              :isCheck="false">
            </ReuseTable>

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
            <DeliveryAndSetter :type="type" :choose="choose"
                               @choseDeliveryInstallStaff="chose"
                               :multipleValues="[]"
                               :changeState="isShowDeliveryMan"></DeliveryAndSetter>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import { Component, Watch, Vue } from 'vue-property-decorator'
import ReuseTable from '../FullInfoTable/components/ReuseTable.vue'
import ConfiguredOrder from './components/ConfiguredOrder'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
import Card from '@/components/Card'
import SearchStore from './components/SearchStore'
import { namespace } from 'vuex-class'
const moduleFullDose = namespace('delivery-installation/fullInfoTable')
const moduleOrderDispatchList = namespace('delivery-installation/orderDispatchList')

  @Component({
    components: { ReuseTable, ConfiguredOrder, Card, SearchStore, DeliveryAndSetter }
  })
export default class OrderDispatchList extends Vue {
    loading = false
    dimOwner = [] // 维度责任人
    type = null // 责任人类型
    choose = false // false为责任人选择
    isShowDeliveryMan = false // 维度责任人弹窗
    isShowNeverSearch = false // 未调度列表展开高级搜索
    isShowDidSearch = false // 已调度列表展开高级搜索
    isShowBatchJoin = false // 是否弹窗 批量加入送货安装列表
    isShowDeliveryOrder = false // 是否弹窗 已配置的送货安装订单
    isShowSearchStore = false // 是否弹窗查询商场
    activeName = 'never' // tabs默认选中
    checkList = [] // 复选框选中内容，
    deadlineValue = '' // 未调度到期选择
    brandValue = '' // 品牌选择
    radio1 = ''
    radio2 = ''
    factoryTime = '' // 工厂交期
    stateValue = '' // 状态
    deliveryTime = '' // 收货齐套时间
    marketValue = [] // 商场选择
    shopValue = '' // 门店选择
    naverTimevalue = '' // 未调度时间选择
    total = 0
    totalNum = 0 // 已添加订单数
    dispatchUser = ''
    nDays = [] // 几天内到期
    neverServiceNoComplete = [] // 未调度客户是否齐套
    neverIsComplete = [] // 订单是否齐套
    didServiceNoComplete = [] // 已调度客户是否齐套
    didIsComplete = [] // 订单是否齐套
    isPass = [] // 验收是否通过
    checkMaketArr = [] // 选择商场数组
    neverCheckMaketArr = []
    didCheckMaketArr = []
    checkStoreArr = [] // 选择门店数组
    neverCheckStoreArr = []
    didCheckStoreArr = []
    getstoreByid = false // 是否获取商店下的门店
    ordinaryParams = {
      searchKeyword: '',
      isController: '',
      localStore: false, // 本商场
      serviceNoComplete: false, // 客户是否齐套
      isComplete: false, // 订单是否齐套
      servicenoIsComplete: false, // 服务单是否齐套
      isExpired: false, // 是否超期
      isBack: false, // 是否返货
      nDays: '', // 几天内
      pageNum: 1,
      pageSize: 10
    }
    neverParams = {
      searchKeyword: '', // 搜索字段
      isController: 0, // 是否调度 0-未调度 1-已调度 其他功能送null
      localStore: '', // 本商场
      serviceNoComplete: '', // 客户是否齐套
      isComplete: '', // 订单是否齐套
      isExpired: '', // 是否过期
      isBack: '', // 是否返货
      nDays: '', // 几天内到期
      brand: '', // 品牌
      category: '', // 品类
      contentment: '', // 满意度
      deliveryInstallModel: '', // 是否送装一体
      dispatch: '', // 送货员
      expectDateStart: '', // 合同交期 开始日期
      expectDatEnd: '', // 合同交期 结束日期
      factoryExpDateStart: '', // 工厂交期 开始日期
      factoryExpDatEnd: '', // 工厂交期 结束日期
      orderTimeStart: '', // 下单日期开始日期
      orderTimEnd: '', // 下单时间 结束日期
      plannedTimeStart: '', // 计划时间 开始时间
      plannedTimeEnd: '', // 计划时间 结束时间
      marketName: '', // 商场名称
      marketNo: '', // 商场编号
      owner: '', // 责任人
      srvCompleteTimeStart: '', // 齐套时间 开始时间
      srvCompleteTimeEnd: '', // 齐套时间 结束时间
      status: '', // 订单状态
      store: '', // 门店
      pageNum: 1,
      pageSize: 10
    }
    didParams = {
      searchKeyword: '', // 搜索字段
      isController: 0, // 是否调度 0-未调度 1-已调度 其他功能送null
      localStore: '', // 本商场
      serviceNoComplete: '', // 客户是否齐套
      isComplete: '', // 订单是否齐套
      isExpired: '', // 是否过期
      isBack: '', // 是否返货
      nDays: '', // 几天内到期
      brand: '', // 品牌
      category: '', // 品类
      contentment: '', // 满意度
      deliveryInstallModel: '', // 是否送装一体
      dispatch: '', // 送货员
      expectDateStart: '', // 合同交期 开始日期
      expectDatEnd: '', // 合同交期 结束日期
      factoryExpDateStart: '', // 工厂交期 开始日期
      factoryExpDatEnd: '', // 工厂交期 结束日期
      // orderTimeStart: '', // 下单日期开始日期
      // orderTimEnd: '', // 下单时间 结束日期
      plannedTimeStart: '', // 预约送货开始时间
      plannedTimeEnd: '', // 预约送货结束时间
      plannedInstallTimeStart: '', // 预约安装开始时间
      plannedInstallTimeEnd: '', // 预约安装结束时间
      srvCompleteTimeStart: '', // 齐套时间 开始时间
      srvCompleteTimeEnd: '', // 齐套时间 结束时间
      isPass: '', // 验收是否通过
      marketName: '', // 商场名称
      marketNo: '', // 商场编号
      owner: '', // 责任人
      status: '', // 订单状态
      store: '', // 门店
      dim: '', // 查询维度
      dimOwner: '', // 维度责任人
      dimTimeStart: '', // 查询维度开始时间
      dimTimeEnd: '', // 查询维度结束时间
      pageNum: 1,
      pageSize: 10
    }
    params = null
    neverExpectDate = [] // 合同交期时间
    neverSrvCompleteDate = [] // 收货齐套时间
    neverFactoryExpDate = [] // 工厂交期
    didExpectDate = [] // 合同交期时间
    didOrderData = [] // 订单下单时间
    didSrvCompleteDate = [] // 收货齐套时间
    didFactoryExpDate = [] // 工厂交期
    didPlannedDeliverDate = [] // 已调度列表预约送货时间
    didPlannedInstallationDate = [] // 已调度列表预约安装时
    dimDate = [] // 维度时间
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
    tableData = []
    undispatchedTableHead = [
      { name: '客户姓名', value: 'customerName', isRowspan: true },
      { name: '客户手机号', value: 'mobilePhone', isRowspan: true },
      { name: '客户地址', value: 'address', isRowspan: true },
      { name: '服务号是否齐套', value: 'serviceNoComplete', isRowspan: true },
      { name: '操作', value: 'A001' },
      { name: '工厂合同自编号', value: 'factoryContractNo' },
      { name: '服务单是否齐套', value: 'servicenoIsComplete' },
      { name: '服务单单号', value: 'serviceNo' },
      { name: '客户跟踪', value: 'customerTracking' },
      { name: '订单内容', value: 'orderContent' },
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
      { name: '是否加入待调度列表', value: 'isDispatch' },
      { name: '设计师', value: 'designer' },
      { name: '导购', value: 'shoppingGuide' },
      { name: '是否遗留单', value: 'leavelFlag' },
      { name: '服务单合同总金额', value: 'contractTotalAmount' },
      { name: '服务单已收款', value: 'contractPayedAmount' },
      { name: '服务单待收款', value: 'contractPayingAmount' }
    ]
    schedulingableHead = [
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
      { name: '库存数量', value: 'stockQuantity' },
      { name: '已出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '合同交期', value: 'contractDeliverDt' },
      { name: '预约送货时间', value: 'plannedDeliveryTime' },
      { name: '预约安装时间', value: 'plannedInstallationTime' },
      { name: '是否过期', value: 'isExpired' },
      { name: '状态', value: 'status' },
      { name: '是否送装分离', value: 'deliveryInstallModel' },
      { name: '出库时间', value: 'dispatchTime' },
      { name: '出库人', value: 'dispatchUserName' },
      { name: '实际送货时间', value: 'deliveryTime' },
      { name: '送货责任人', value: 'deliveryOwner' },
      { name: '送货车辆', value: 'plateNum' },
      { name: '司机', value: 'driver' },
      { name: '实际安装时间', value: 'installTime' },
      { name: '安装责任人', value: 'installationOwner' },
      { name: '安装协助人', value: 'installationFacilitator' },
      { name: '验收时间', value: 'acceptanceTime' },
      { name: '验收人', value: 'acceptanceOwner' },
      { name: '验收结果', value: 'isPass' },
      { name: '客户评价结果', value: 'custContentment' },
      { name: '评价时间', value: 'custAppraisalTime' },
      { name: '商场名称', value: 'marketName' },
      { name: '商场编码', value: 'marketCode' },
      { name: '门店', value: 'store' },
      { name: '收货齐套时间', value: 'srvCompleteTime' },
      { name: '工厂计划交期', value: 'expectDate' },
      { name: '设计师', value: 'designer' },
      { name: '导购', value: 'shoppingGuide' },
      { name: '是否遗留单', value: 'leavelFlag' },
      { name: '服务单合同总金额', value: 'contractTotalAmount' },
      { name: '服务单已收款', value: 'contractPayedAmount' },
      { name: '服务单待收款', value: 'contractPayingAmount' }
    ]
    twoTableHead = [
      { name: '二级品类', value: 'clsleve2Name' },
      { name: '订单是否齐套', value: 'isComplete' },
      { name: '库存数量', value: 'stockQuantity' },
      { name: '已出库数量', value: 'stockOut' },
      { name: '存放库位', value: 'stockPosition' },
      { name: '期望交期', value: 'expectDate' },
      { name: '是否过期', value: 'isExpired' },
      { name: '状态', value: 'status' },
      { name: '是否加入待调度列表', value: 'isDispatch' }
    ]

    // 获取信息全量表
    @moduleFullDose.Action getInfoList

    // 待确认送货安装清单新增接口
    @moduleOrderDispatchList.Action conflistAdd

    //  已添加的送货安装订单数查询接口
    @moduleOrderDispatchList.Action countList

    // 初始化数据
    initData (pageNum = 1) {
      pageNum === false ? this.params.pageNum = 1 : isNaN(pageNum) ? this.params.pageNum = 1 : this.params.pageNum = pageNum * 1
      if ((this.activeName === 'never' && !this.isShowNeverSearch) || (this.activeName === 'did' && !this.isShowDidSearch)) {
        let params = JSON.parse(JSON.stringify(this.ordinaryParams))
        params.pageNum = this.params.pageNum
        params.pageSize = this.params.pageSize
        params.isComplete = params.isComplete === true ? 2 : null
        params.serviceNoComplete = params.serviceNoComplete === true ? 2 : null
        params.localStore = params.localStore === true ? params.localStore * 1 : null
        params.isExpired = params.isExpired === true ? params.isExpired * 1 : null
        params.servicenoIsComplete = params.servicenoIsComplete === true ? params.servicenoIsComplete * 2 : null
        params.isBack = params.isBack === true ? params.isBack * 1 : null
        params.searchKeyword = this.params.searchKeyword
        if (this.activeName === 'did') {
          params.isController = 1
          params.isBack = ''
        } else {
          params.isController = 0
        }
        if (this.nDays.join('') * 1) {
          params.nDays = this.nDays.join('') * 1
        } else {
          params.nDays = ''
        }
        this.getAllList(params)
        return
      }
      // 合同交期时间
      if (this.neverExpectDate && this.activeName === 'never') {
        this.params.expectDateStart = this.neverExpectDate[0]
        this.params.expectDatEnd = this.neverExpectDate[1]
      } else if (this.didExpectDate && this.activeName === 'did') {
        this.params.expectDateStart = this.didExpectDate[0]
        this.params.expectDatEnd = this.didExpectDate[1]
      } else {
        this.params.expectDateStart = ''
        this.params.expectDatEnd = ''
      }
      // 工厂交期时间
      if (this.neverFactoryExpDate && this.activeName === 'never') {
        this.params.factoryExpDateStart = this.neverFactoryExpDate[0]
        this.params.factoryExpDatEnd = this.neverFactoryExpDate[1]
      } else if (this.didFactoryExpDate && this.activeName === 'did') {
        this.params.factoryExpDateStart = this.didFactoryExpDate[0]
        this.params.factoryExpDatEnd = this.didFactoryExpDate[1]
      } else {
        this.params.factoryExpDateStart = ''
        this.params.factoryExpDatEnd = ''
      }
      // 收货齐套时间
      if (this.neverSrvCompleteDate && this.activeName === 'never') {
        this.params.srvCompleteTimeStart = this.neverSrvCompleteDate[0]
        this.params.srvCompleteTimeEnd = this.neverSrvCompleteDate[1]
      } else if (this.didSrvCompleteDate && this.activeName === 'did') {
        this.params.srvCompleteTimeStart = this.didSrvCompleteDate[0]
        this.params.srvCompleteTimeEnd = this.didSrvCompleteDate[1]
      } else {
        this.params.srvCompleteTimeStart = ''
        this.params.srvCompleteTimeEnd = ''
      }
      // 预约送货时间
      if (this.didPlannedDeliverDate && this.params.hasOwnProperty('plannedTimeStart')) {
        let date = this.didPlannedDeliverDate
        this.params.plannedTimeStart = date[0]
        this.params.plannedTimeEnd = date[1]
      } else {
        this.params.plannedTimeStart = ''
        this.params.plannedTimeEnd = ''
      }
      // 预约安装时间啊
      if (this.didPlannedInstallationDate && this.params.hasOwnProperty('plannedInstallTimeStart')) {
        let date = this.didPlannedInstallationDate
        this.params.plannedInstallTimeStart = date[0]
        this.params.plannedInstallTimeEnd = date[1]
      } else {
        this.params.plannedInstallTimeStart = ''
        this.params.plannedInstallTimeEnd = ''
      }

      // 订单下单时间
      if (this.didOrderData && this.params.hasOwnProperty('orderTimeStart')) {
        let date = this.didOrderData
        this.params.orderTimeStart = date[0]
        this.params.orderTimEnd = date[1]
      } else {
        this.params.orderTimeStart = ''
        this.params.orderTimEnd = ''
      }
      // 查询维度时间
      if (this.dimDate && this.params.hasOwnProperty('dimTimeStart')) {
        this.params.dimTimeStart = this.dimDate[0]
        this.params.dimTimeEnd = this.dimDate[1]
      } else {
        this.params.dimTimeStart = ''
        this.params.dimTimeEnd = ''
      }
      this.loading = true
      this.getTotalNum()
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.neverServiceNoComplete.length >= 1 && this.activeName === 'never') {
        params.serviceNoComplete = this.neverServiceNoComplete.join('') * 1
      } else if (this.didServiceNoComplete.length >= 1 && this.activeName === 'did') {
        params.serviceNoComplete = this.didServiceNoComplete.join('') * 1
      }
      if (this.neverIsComplete.length >= 1 && this.activeName === 'never') {
        params.isComplete = this.neverIsComplete.join('') * 1
      } else if (this.didIsComplete.length >= 1 && this.activeName === 'did') {
        params.isComplete = this.didIsComplete.join('') * 1
      }
      if (this.params.hasOwnProperty('isPass')) {
        params.isPass = this.isPass.length === 0 ? '' : this.isPass.join('') * 1
      }
      if (this.dimOwner.length) {
        params.dimOwner = this.dimOwner[0].id
      } else {
        params.dimOwner = null
      }
      this.getAllList(params)
    }
    // 初始化数据
    getAllList (params) {
      this.loading = true
      this.getInfoList(params).then(res => {
        console.log('获取订单调度列表res', res)
        this.loading = false
        if (res.status && res.code === '200') {
          if (res.data.list.length) {
            this.tableData = JSON.parse(JSON.stringify(res.data.list))
            this.total = res.data.total
          } else {
            this.tableData = []
          }
        }
      }).catch(error => {
        this.total = 0
        console.log('获取订单调度列表error', error)
        this.loading = false
      })
    }
    // 维度选择改变
    dimChange (data) {
      if (data === '') {
        this.dimDate = []
        this.dimOwner = []
        // console.log(this.dimDate)
      }
    }
    // 维度责任人移除
    closeTag (data) {
      // console.log(data)
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

    // 获取已添加安装单总数
    getTotalNum () {
      this.countList().then(res => {
        if (res.status && res.code === '200') {
          this.totalNum = res.data
        }
      }).catch(() => {
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
    // 商场查询反写
    chooseStore (data) {
      console.log('商场查询反写', data)
      if (this.getstoreByid) {
        if (this.activeName === 'never') {
          this.neverCheckStoreArr = data
          this.checkStoreArr = data
        } else {
          this.didCheckStoreArr = data
          this.checkStoreArr = data
        }
      } else {
        if (this.activeName === 'never') {
          this.neverCheckMaketArr = data
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
      // console.log('this.checkStoreArr', this.checkStoreArr)
    }
    // 选择客户是否齐套
    chooseserviceNoComplete (data) {
      let arr = [...data]
      if (arr.length > 1 && this.activeName === 'never') {
        this.neverServiceNoComplete = []
        this.neverServiceNoComplete.push(arr[1])
        // console.log(this.neverServiceNoComplete)
      } else if (arr.length > 1 && this.activeName === 'did') {
        this.didServiceNoComplete = []
        this.didServiceNoComplete.push(arr[1])
        // console.log(this.didServiceNoComplete)
      }
    }
    // 选择订单是否齐套
    chooseisComplete (data) {
      let arr = [...data]
      if (arr.length > 1 && this.activeName === 'never') {
        this.neverIsComplete = []
        this.neverIsComplete.push(arr[1])
      } else if (arr.length > 1 && this.activeName === 'did') {
        this.didIsComplete = []
        this.didIsComplete.push(arr[1])
      }
    }
    // 验收是否通过
    chooseisPass (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.isPass = []
        this.isPass.push(arr[1])
      }
    }

    // 继续添加按钮
    continueJoin () {
      this.isShowBatchJoin = false
    }

    handleClick (tab, event) {
      this.tableData = []
      this.clearSearch()
      this.activeName === 'never' ? this.checkMaketArr = this.neverCheckMaketArr : this.checkMaketArr = this.didCheckMaketArr
      this.activeName === 'never' ? this.checkStoreArr = this.neverCheckStoreArr : this.checkStoreArr = this.didCheckStoreArr
      this.activeName === 'never' ? this.params = this.neverParams : this.params = this.didParams
      this.activeName === 'never' ? this.params.isController = 0 : this.params.isController = 1
      this.initData()
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

    // 清空搜索
    emptySearch () {
      this.params.marketId = ''
      this.params.store = ''
      this.params.marketName = ''
      this.params.marketNo = ''
      this.params.searchKeyword = ''
      this.dimOwner = []
      this.nDays = [] // 几天内到期
      this.checkMaketArr = []
      this.checkStoreArr = []
      this.isPass = [] // 是否过期
      this.dimDate = []
      if (this.activeName === 'never') {
        this.neverExpectDate = [] // 合同交期时间
        this.neverSrvCompleteDate = [] // 收货齐套时间
        this.neverFactoryExpDate = [] // 工厂交期
        this.neverServiceNoComplete = [] // 未调度客户是否齐套
        this.neverIsComplete = [] // 订单是否齐套
        this.neverParams.searchKeyword = '' // 搜索字段
        this.neverParams.nDays = '' // 几天内到期
        this.neverParams.brand = '' // 品牌
        this.neverParams.category = '' // 品类
        this.neverParams.contentment = '' // 满意度
        this.neverParams.deliveryInstallModel = '' // 是否送装一体
        this.neverParams.dispatch = '' // 送货员
        this.neverParams.owner = '' // 责任人
        this.neverParams.status = ''// 订单状态
      } else {
        this.didPlannedDeliverDate = [] // 已调度列表预约送货时间
        this.didPlannedInstallationDate = [] // 已调度列表预约安装时
        this.didExpectDate = [] // 合同交期时间
        this.didSrvCompleteDate = [] // 收货齐套时间
        this.didFactoryExpDate = [] // 工厂交期
        this.didServiceNoComplete = [] // 未调度客户是否齐套
        this.didIsComplete = [] // 订单是否齐套
        // this.didOrderData = [] // 订单下单时间
        this.didParams.searchKeyword = '' // 搜索字段
        this.didParams.brand = ''// 品牌
        this.didParams.category = '' // 品类
        this.didParams.contentment = '' // 满意度
        this.didParams.dispatch = '' // 送货员
        this.didParams.isPass = '' // 验收是否通过
        this.didParams.marketName = '' // 商场名称
        this.didParams.marketNo = '' // 商场编号
        this.didParams.owner = '' // 责任人
        this.didParams.status = '' // 订单状态
        this.didParams.store = '' // 门店
        this.didParams.dim = '' // 查询维度
        this.didParams.dimOwner = '' // 维度责任人
      }
    }

    // 批量加入送货安装列表
    batchJoin () {
      let checkData = this.$refs.undispatchedRef.getCheckedData()
      let checkArr = checkData.filter(list => { return list.checked })
      let custArr = checkData.filter(list => {
        return list.userChecked
      }).map(list => {
        return {
          custId: list.id,
          orders: []
        }
      })
      if (!custArr.length) {
        this.$message.warning('您还没有选择订单')
        return false
      }
      checkArr.forEach(list => {
        custArr.forEach(item => {
          if (list.id === item.custId) {
            let listObj = {
              orderId: list.orderId,
              leve2: list.clsleve2 ? list.clsleve2.filter(j => {
                return j.checked
              }).map(k => {
                return {
                  id: k.id
                }
              }) : []
            }
            item.orders.push(listObj)
          }
        })
      })
      this.loading = true
      if (custArr.length) {
        console.log('加入安装单数据', custArr)
        this.conflistAdd({ data: custArr }).then(res => {
          this.loading = false
          if (res.status && res.code === '200') {
            this.isShowBatchJoin = true
          } else {
            this.$message({
              message: res.message || '添加失败',
              type: 'error'
            })
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
        this.loading = false
        this.$message.warning('您还没有选择订单')
      }
    }

    // 打开已配置的送货安装订单
    showDeliveryOrder () {
      const self = this
      this.isShowBatchJoin = false
      setTimeout(function () {
        self.isShowDeliveryOrder = true
      }, 190)
    }

    // 子组件关闭送货安装订单
    close (data) {
      this.isShowDeliveryOrder = data
    }

    changeDeliveryOrder (flag = false) {
      this.isShowDeliveryOrder = flag
    }
    // 搜索
    receiptTicketSearch () {
      this.initData()
    }

    // 清除搜索条件
    clearSearch () {
      this.params.searchKeyword = ''
      this.params.localStore = false
      this.params.serviceNoComplete = false
      this.params.isComplete = false
      this.params.isExpired = false
      this.params.isBack = false
      this.nDays = []
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
        this.getTotalNum()
      }
    }
    created () {
      this.activeName = 'never'
      this.getTotalNum()
      this.checkMaketArr = this.neverCheckMaketArr
      this.checkStoreArr = this.neverCheckStoreArr
      this.params = this.neverParams
      this.params.isController = 0
      this.initData()
    }
  }
</script>

<style src="./style.scss"  lang="scss">

</style>
