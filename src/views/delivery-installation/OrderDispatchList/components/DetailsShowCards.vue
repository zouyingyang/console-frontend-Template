<template>
  <div v-loading="loading" class="op-details-show-cards">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>送货安装单信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">客户姓名: </span>
              <span v-text="serviceInfo.customerName || '暂无数据'">客户姓名</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">客户手机号: </span>
              <span v-text="serviceInfo.mobilePhone || '暂无数据'">客户手机号</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">客户地址: </span>
              <span v-text="serviceInfo.address || '暂无数据'">客户地址</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">送货安装单号: </span>
              <span v-text="orderInfo.installNo || '暂无数据'">送货安装单号</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">生成时间: </span>
              <span v-text="format(orderInfo .creatTime) || '暂无数据'">生成时间</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">生成人: </span>
              <span v-text="orderInfo.creatBy || '暂无数据'">生成人</span>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>订单信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">工厂合同自编号: </span>
              <span v-text="orderInfo.factoryContractNo || '暂无数据'">工厂合同自编号</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">订单编号: </span>
              <span v-text="orderInfo.orderNo || '暂无数据'">订单编号</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">品牌: </span>
              <span v-if="orderInfo.brand">{{orderInfo.brand | brandFilter}}</span>
              <span v-else>暂无数据</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">门店: </span>
              <span v-text="orderInfo.store || '暂无数据'">门店</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">导购: </span>
              <span v-text="orderInfo.salesMan || '暂无数据'">导购</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">设计师: </span>
              <span v-text="orderInfo.designer || '暂无数据'">设计师</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-table
              size="mini"
              :data="serveInfoTable"
              :span-method="mergeTableHanle"
              border
              style="width: 100%;margin-top: 20px;">
              <el-table-column
                v-for="(item,h) in serviceTemArr"
                :prop="item.value"
                :label="item.name"
                align="center"
                :key="h+'serveive'">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>出库信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-col :span="12" class="itemBox">
              <span class="itemLable">出库时间: </span>
              <span v-text="format(orderInfo.dispatchTime) || '暂无数据'">出库时间</span>
            </el-col>
            <el-col :span="12" class="itemBox">
              <span class="itemLable">出库人: </span>
              <span v-text="orderInfo.dispatchUserName || '暂无数据'">出库人</span>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>送货信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">预约送货时间: </span>
              <span v-text="format(orderInfo.bookDeliveryDate) || '暂无数据'">预约送货时间</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">实际送货时间: </span>
              <span v-text="format(orderInfo.deliveryTime) || '暂无数据'">实际送货时间</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">送货责任人: </span>
              <span v-text="orderInfo.deliveryOwner || '暂无数据'">送货责任人</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">送货车辆: </span>
              <span v-text="orderInfo.plateNum || '暂无数据'">送货车辆</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">司机: </span>
              <span v-text="orderInfo.driver || '暂无数据'">司机</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">送货协助人: </span>
              <span v-text="orderInfo.deliveryFacilitator || '暂无数据'">送货协助人</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="24" class="itemBox">
              <el-collapse :value="[0]">
                <el-collapse-item
                  v-for="(list,index) in orderInfo.deliveryRecords"
                  :key="index + 'deliveryRecords'"
                  :name="index">
                  <template slot="title">
                    送货记录{{(+index + 1) | toChinesNum}}&nbsp;&nbsp;&nbsp;&nbsp;{{format(list.createTime)}}&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color: #fead7e;">{{list.deliveryOwner ? list.deliveryOwner : '暂无数据'}}</span>
                    <span> / {{list.deliveryFacilitator ? list.deliveryFacilitator : '暂无数据'}}</span>
                  </template>
                  <el-col :span="12">
                    <el-col :span="24">
                      <span class="itemLable">现场图片: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'1').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'1').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'1')"></img-preview>
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <span class="itemLable">验收图片: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'10').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'10').length" :deleteRequired="false" :imgList='filterImg(list.attachmentInfoList ,"10")'></img-preview>
                      </span>
                    </el-col>
                  </el-col>
                  <el-col :span="12">
                    <div v-for="(positionList,index) in list.positionList" :key="index + 'positionList1'" class="position_item">
                      <i class="el-icon-location"></i>定位：
                      <span v-text="positionList.position"></span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span v-text="format(positionList.time)"></span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="8" class="itemBox">
                      <span class="itemLable">备注: </span>
                      <span v-text="list.remark || '暂无数据'">备注</span>
                    </el-col>
                  </el-col>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>安装信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">是否送装一体: </span>
              <span
                v-if="orderInfo.deliveryInstallModel">{{orderInfo.deliveryInstallModel | deliverySeparationFilter}}</span>
              <span v-else>暂无</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">预约安装时间: </span>
              <span v-text="format(orderInfo.plannedInstallationTime) || '暂无数据'">预约安装时间</span>
            </el-col>
            <!--<el-col :span="8" class="itemBox">-->
            <!--<span class="itemLable">实际安装开始时间: </span>-->
            <!--<span v-text="format(orderInfo.plannedInstallationTime) || '暂无数据'">实际安装开始时间</span>-->
            <!--&lt;!&ndash;todo 实际安装开始时间&ndash;&gt;-->
            <!--</el-col>-->
            <el-col :span="8" class="itemBox">
              <span class="itemLable">实际安装完成时间: </span>
              <span v-text="format(orderInfo.installTime) || '暂无数据'">实际安装完成时间</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-col :span="8" class="itemBox">
              <span class="itemLable">安装责任人: </span>
              <span v-text="orderInfo.installationOwner || '暂无数据'">安装责任人</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">安装协助人: </span>
              <span v-text="orderInfo.installationFacilitator || '暂无数据'">安装协助人</span>
            </el-col>
            <el-col :span="8" class="itemBox">
              <span class="itemLable">责任人手机号: </span>
              <span v-text="orderInfo.ownerPhone || '暂无数据'">责任人手机号</span>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-table
              size="mini"
              :data="installTable"
              border
              style="width: 100%;margin-top: 20px;">
              <el-table-column prop="clsleve2Name" label="二级品类" align="center"></el-table-column>
              <el-table-column prop="quanlity" label="件数" align="center"></el-table-column>
              <el-table-column prop="plannedInstallationTime" label="预约安装时间" width="150" align="center">
                <template slot-scope="props">
                  {{props.row.plannedInstallationTime | format('yyyy-MM-dd HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="installationTime" label="实际安装完成时间" width="150" align="center">
                <template slot-scope="props">
                  {{props.row.installationTime | format('yyyy-MM-dd HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="installationOwner" label="安装责任人" align="center"></el-table-column>
              <el-table-column prop="installationFacilitator" label="安装协助人" align="center"></el-table-column>
              <el-table-column prop="phone" label="责任手机号" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="props">
                  {{props.row.status | statusFilter}}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <!--<el-col :span="24">-->
            <!--&lt;!&ndash;todo 安装上传附件&ndash;&gt;-->
            <!--<el-col :span="24" class="itemBox">-->
              <!--<span class="itemLable">安装上传附件: </span>-->
              <!--<span style="margin-left:5px" class="op-inline-block op-vertical-top">-->
                <!--<div v-for="(eve,index) in (classifyAttachments?classifyAttachments.install:[])"-->
                     <!--:key="('del-att'+index)">-->
                  <!--<div class="op-image-msg">-->
                     <!--<span v-text="eve.uploadTime ? format(eve.uploadTime) : '0000:00:00'"></span>-->
                     <!--&nbsp;&nbsp;&nbsp;&nbsp;-->
                     <!--<span v-text="eve.userName ? eve.userName : '暂无上传人'"></span>-->
                   <!--</div>-->
                  <!--<br>-->
                  <!--<img-preview :deleteRequired="false" :imgList='filterImg(eve.list)'></img-preview>-->
                  <!--<br>-->
                 <!--<span>备注： {{eve.remark||'暂无数据'}}</span>-->
                <!--</div>-->
                <!--<span v-if='!classifyAttachments.install'>暂无</span>-->
              <!--</span>-->
            <!--</el-col>-->
          <!--</el-col>-->
          <el-col :span="24">
            <el-col :span="24" class="itemBox">
              <el-collapse :value="[0]">
                <el-collapse-item
                  v-for="(list,index) in orderInfo.installRecords"
                  :key="index + 'installRecords'"
                  :name="index">
                  <template slot="title">
                    安装记录{{(+index + 1) | toChinesNum}}&nbsp;&nbsp;&nbsp;&nbsp;{{format(list.createTime)}}&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color: #fead7e;">{{list.installationOwner ? list.installationOwner : '暂无数据'}}</span>
                    <span> / {{list.installationFacilitator ? list.installationFacilitator : '暂无数据'}}</span>
                  </template>
                  <el-col :span="12" v-if="orderInfo.category === 'category_yigui'">
                    <el-col :span="24">
                      <span class="itemLable">铺红毯: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'21').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'21').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'21')"></img-preview>
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <span class="itemLable">清纸皮: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'22').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'22').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'22')"></img-preview>
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <span class="itemLable">做防护: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'23').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'23').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'23')"></img-preview>
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <span class="itemLable">抓卫生: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'24').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'24').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'24')"></img-preview>
                      </span>
                    </el-col>
                    <el-col :span="24">
                      <span class="itemLable">客验收: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'25').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'25').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'25')"></img-preview>
                      </span>
                    </el-col>
                  </el-col>
                  <el-col :span="12" v-else>
                    <el-col :span="24">
                      <span class="itemLable">上传附件: </span>
                      <span v-if="!filterImg(list.attachmentInfoList ,'2').length">暂无数据</span>
                    </el-col>
                    <el-col :span="24">
                      <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                        <img-preview v-if="filterImg(list.attachmentInfoList ,'2').length" :deleteRequired="false" :imgList="filterImg(list.attachmentInfoList ,'2')"></img-preview>
                      </span>
                    </el-col>
                  </el-col>
                  <el-col :span="12">
                    <div v-for="(positionList,index) in list.positionList" :key="index + 'positionList2'" class="position_item">
                      <i class="el-icon-location"></i>定位：
                      <span v-text="positionList.position"></span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span v-text="format(positionList.time)"></span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="8" class="itemBox">
                      <span class="itemLable">备注: </span>
                      <span v-text="list.remark || '暂无数据'">备注</span>
                    </el-col>
                  </el-col>
                </el-collapse-item>
              </el-collapse>
            </el-col>
          </el-col>
          <el-col :span="24" class="itemBox">
            <span class="itemLable">厨电安装附件: </span>
            <span style="margin-left:5px" class="op-inline-block op-vertical-top">
              <div v-for="(eve,index) in (classifyAttachments?classifyAttachments.kitInfo:[])"
                   :key="('del-att'+index)">
                <div class="op-image-msg">
                    <span v-text="eve.uploadTime ? format(eve.uploadTime) : '0000:00:00'"></span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span v-text="eve.userName ? eve.userName : '暂无上传人'"></span>
                  </div>
                <br>
                <img-preview :deleteRequired="false" :imgList='filterImg(eve.list)'></img-preview>
                <br>
                <span>备注： {{eve.remark||'暂无数据'}}</span>
              </div>
              <span v-if='!classifyAttachments.kitInfo'>暂无</span>
            </span>
          </el-col>
          <el-col :span="24">
            <!-- @change="handleChange" -->
            <el-collapse v-model="collapseActiveNames">
              <el-collapse-item title="厨电安装记录" name="1">
                <el-table
                  size="mini"
                  :data="orderInfo.kitchenList"
                  border
                  style="width: 100%;margin-top: 20px;">
                  <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                  <el-table-column prop="productCode" label="产品型号" align="center"></el-table-column>
                  <el-table-column prop="barCode" label="产品编号" align="center"></el-table-column>
                  <el-table-column prop="creatTime" label="安装时间" width="150" align="center">
                    <template slot-scope="props">
                      {{props.row.creatTime | format('yyyy-MM-dd HH:mm:ss')}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="installationTime" label="实际安装完成时间" width="150" align="center">
                    <template slot-scope="props">
                      <!-- {{props.row.installationTime | format("yyyy-MM-dd HH:mm:ss")}} -->
                      {{format(orderInfo.installTime)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="installationOwner" label="安装责任人" align="center">
                    <template slot-scope="props">
                      {{orderInfo.installationOwner}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="installationFacilitator" label="安装协助人" align="center">
                    <template slot-scope="props">
                      {{orderInfo.installationFacilitator}}
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="安装挂起记录" name="2">
                <el-col :span="24">
                  <el-col :span="8" class="itemBox">
                    <span class="itemLable">安装挂起原因: </span>
                    <span v-text="orderInfo.sleepVo.uncompleteReason || '暂无数据'"></span>
                  </el-col>
                  <el-col :span="8" class="itemBox">
                    <span class="itemLable">挂起时间: </span>
                    <span v-text="format(orderInfo.sleepVo.createTime) || '暂无数据'"></span>
                  </el-col>
                  <el-col :span="8" class="itemBox">
                    <span class="itemLable">挂起人: </span>
                    <span v-text="orderInfo.sleepVo.createBy || '暂无数据'"></span>
                  </el-col>
                </el-col>
                <el-col :span="24">
                  <el-col :span="8" class="itemBox">
                    <span class="itemLable">备注: </span>
                    <span v-text="orderInfo.sleepVo.remark || '暂无数据'"></span>
                  </el-col>
                </el-col>
                <el-col :span="24" class="itemBox">
                  <span class="itemLable">附件: </span>
                  <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                    <div v-for="(eve,index) in (classifyAttachments?classifyAttachments.sleep:[])"
                         :key="('del-att'+index)">
                      <!-- <div class="op-image-msg">
                        <span v-text="eve.uploadTime ? format(eve.uploadTime) : '0000:00:00'"></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-text="eve.userName ? eve.userName : '暂无上传人'"></span>
                      </div>
                      <br> -->
                      <img-preview :deleteRequired="false" :imgList='filterImg(eve.list)'></img-preview>
                    </div>
                    <span v-if='!classifyAttachments.sleep'>暂无</span>
                  </span>
                </el-col>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>遗留单申报记录</span>
      </div>
      <div>
        <el-row>
          <el-col :span="24">
            <el-table
              size="mini"
              :data="orderInfo.leavelList"
              border
              style="width: 100%;margin-top: 20px;">
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="checkResidualDetail(scope.row)">查看</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="factoryContractNo" label="合同自编号" align="center"></el-table-column>
              <el-table-column prop="status" label="申请状态" align="center">
                <template slot-scope="scope">
                  {{scope.row.status}}
                </template>
              </el-table-column>
              <el-table-column prop="applySource" label="申报来源" align="center">
                <template slot-scope="scope">
                  {{scope.row.applySource | applySourceFilter}}
                </template>
              </el-table-column>
              <el-table-column prop="checkExplain" label="处理意见" align="center"></el-table-column>
              <el-table-column prop="createBy" label="申请人" align="center"></el-table-column>
              <el-table-column prop="createTime" label="申请时间" width="150" align="center">
                <template slot-scope="props">
                  {{props.row.createTime | format('yyyy-MM-dd HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="checkedBy" label="审批人" align="center"></el-table-column>
              <el-table-column prop="checkedTime" label="审批时间" width="150" align="center">
                <template slot-scope="props">
                  {{props.row.checkedTime | format('yyyy-MM-dd HH:mm:ss')}}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover" v-if="routerType==='search'||orderInfo.isPass">
      <div slot="header">
        <span>验收信息</span>
      </div>
      <div v-if="orderInfo.acceptanceRecords.length">
        <el-collapse :value="[0]">
          <el-collapse-item
            v-for="(list,index) in orderInfo.acceptanceRecords"
            :key="index + 'deliveryRecords'"
            :name="index">
            <template slot="title">
              验收记录{{(index + 1) | toChinesNum}}
            </template>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收时间: </span>
              <span v-if="list.createTime">{{list.createTime | format('yyyy-M-d HH:mm:s')}}</span>
              <span v-else>暂无数据</span>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收人: </span>
              <span>{{list.createBy ? list.createBy : '暂无数据'}}</span>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收项目: </span>
              <el-radio disabled v-model="list.acceptanceItem" label="process">过程验收</el-radio>
              <el-radio disabled v-model="list.acceptanceItem" label="quality">质量验收</el-radio>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收结果: </span>
              <el-radio disabled v-model="list.isPass" label="1">通过</el-radio>
              <el-radio disabled v-model="list.isPass" label="0">不通过</el-radio>
            </el-col>
            <el-col :span="24" class="acceptanceList">
              <span class="itemLable">上传附件: </span>
              <span v-if="!list.attachmentList || !list.attachmentList.length">暂无数据</span>
            </el-col>
            <el-col :span="24">
              <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                <img-preview
                  v-if="list.attachmentList && list.attachmentList.length"
                  :deleteRequired="false"
                  :imgList='filterImg(list.attachmentList)'>
                </img-preview>
              </span>
            </el-col>
            <el-col :span="24">
              <span class="itemLable">备注: </span>
              <span>{{list.remark ? list.remark : "暂无数据"}}</span>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <span>评价信息</span>
      </div>
      <div>
        <el-row>
          <el-col :span="8" class="itemBox">
            <span class="itemLable">评价时间: </span>
            <span v-text="format(orderInfo.returnVisit[0].commentDate) || '暂无数据'">评价时间</span>
          </el-col>
          <el-col :span="8" class="itemBox">
            <span class="itemLable">评价类型: </span>
            <span v-if="orderInfo.returnVisit[0].typeId">{{orderInfo.returnVisit[0].typeId+'' | returnTypeFilter}}</span>
            <span v-else>暂无数据</span>
          </el-col>
          <el-col :span="8" class="itemBox">
            <span class="itemLable">回访人: </span>
            <span v-text="orderInfo.returnVisit[0].userName || '暂无数据'">回访人</span>
          </el-col>
          <el-col :span="24">
              <span class="itemLable">评价结果: </span>
              <el-table header-align="center" :data="orderInfo.returnVisit[0].feedbacks" border style="width: 100%">
                <el-table-column align="center" prop="postType" label="岗位">
                  <template slot-scope="props">
                    {{props.row.postType | postTypeFilter}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentedName" label="姓名"></el-table-column>
                <el-table-column align="center" prop="commentScore" label="5分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" :label="5">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentScore" label="4分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" :label="4">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentScore" label="3分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" :label="3">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentScore" label="2分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" :label="2">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentScore" label="1分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" :label="1">&nbsp;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentScore" label="不评分">
                  <template slot-scope="props">
                    <el-radio disabled v-model="props.row.commentScore" label=""></el-radio>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commentType" label="评价类型"></el-table-column>
                <el-table-column align="center" prop="remark" label="客服表扬或意见" min-width="150px">
                  <template slot-scope="props">
                    <p v-text="props.row.remark"></p>
                  </template>
                </el-table-column>
              </el-table>
          </el-col>
          <el-col :span="24">
            <span class="itemLable">附件: </span>
              <img-preview
                v-if="orderInfo.returnVisit[0].salesAttachments && orderInfo.returnVisit[0].salesAttachments.length"
                :deleteRequired="false"
                :imgList='filterImg(orderInfo.returnVisit[0].salesAttachments)'>
              </img-preview>
          </el-col>
          <!--<el-col :span="24">-->
          <!--<el-col :span="8" class="itemBox">-->
          <!--<span class="itemLable">客户评价时间: </span>-->
          <!--<span v-text="format(orderInfo.custAppraisalTime) || '暂无数据'">客户评价时间</span>-->
          <!--</el-col>-->
          <!--</el-col>-->
          <!--<el-col :span="24">-->
          <!--<el-col :span="8" class="itemBox">-->
          <!--<span class="itemLable" style="float: left">客户评价结果: </span>-->
          <!--<el-rate v-model="orderInfo.custContentment" disabled style="float: left; padding-top:10px"></el-rate>-->
          <!--</el-col>-->
          <!--<el-col :span="8" class="itemBox">-->
          <!--&lt;!&ndash;todo 客户添加标签 custLabelName&ndash;&gt;-->
          <!--<span class="itemLable">客户添加标签: </span>-->
          <!--<el-tag v-for="(tag,index) in getTags(orderInfo.custLabelName)"-->
          <!--:key='index'-->
          <!--type="warning"-->
          <!--size="small"-->
          <!--class='itemTag'>-->
          <!--{{tag}}-->
          <!--</el-tag>-->
          <!--</el-col>-->
          <!--</el-col>-->
          <!--<el-col :span="24">-->
          <!--<el-col :span="20" class="itemBox">-->
          <!--<span class="itemLable">客户备注: </span>-->
          <!--<span v-text="orderInfo.custRemark || '暂无数据'">备注</span>-->
          <!--</el-col>-->
          <!--</el-col>-->
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import ImgPreview from '@/components/ImgPreview'
import { Prop, Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import CURRENT_ENV_PATH from '@/services/baseUrl'
import Upload from '@/components/UploadImg/index'
import { format, deliverySeparationFilter, statusFilter, brandFilter, toChinesNum, postTypeFilter, returnTypeFilter, applySourceFilter } from '@/utils/filter'

const orderDispatch = namespace('delivery-installation/order-dispatch-list')
const residual = namespace('delivery-installation/residual')
  @Component({
    components: { Upload, ImgPreview },
    filters: { deliverySeparationFilter, format, statusFilter, brandFilter, toChinesNum, postTypeFilter, returnTypeFilter, applySourceFilter }
  })
export default class DetailsShowCards extends Vue {
    // 服务号信息
    @Prop({
      type: Object,
      default: function () {
        return {}
      }
    }) serviceInfo
    // 服务单信息
    @Prop({
      type: Object,
      default: function () {
        return {}
      }
    }) orderInfo
    // 提交表单存放
    checkInstallForm = {
      creatTime: '', // 验收信息
      isPass: '', // 验收结果
      remark: '' // 备注
      // attachments: ''// 附件
    }
    loading = false
    rate = 0
    uploadImgList = [] // 附件信息单独存放
    residualTable = [] // 遗留单申请列表
    collapseActiveNames = [] // 手风琴当前激活的面板及其 change 参数
    // 定义一个用于表格排版的模板用于数据处理的格式参考,同时用于表头
    // 订单信息
    serviceTemArr = [
      { name: '二级品类', value: 'clsleve2Name' }, // 二级品类名称
      { name: '件数', value: 'quanlity' }, // 二级数量
      { name: '存放库位', value: 'stockPosition' }, // 库位
      { name: '三级品类', value: 'clsleve3Name' }, // 三级品类编码
      { name: '包条码', value: 'packageNo' }, // 包条码
      { name: '例放', value: 'caseFlag' }, // 例放
      { name: '包编号', value: 'barCode' } // 包编号
    ]
    routerType = 'check' // 页面模式由路由决定
    // 图片测试
    // imgArr=[
    //   { url: 'http://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/2018/9/30/1538272279813-97984144-81f8e880cc919606.jpg' },
    //   { url: 'http://pic.qiantucdn.com/58pic/28/88/69/auto_69958PICZe90d74ebbiwa_PIC2018.jpg!/fw/580/compress/true/clip/580x772a0a0/format/webp' },
    //   { url: 'http://pic.qiantucdn.com/58pic/28/90/27/auto_54U58PICB21f3150WTd28_PIC2018.jpg!/fw/580/compress/true/clip/580x772a0a0/format/webp' },
    //   { url: 'http://pic.qiantucdn.com/58pic/28/92/28/auto_81e58PICRuEXGF6Zrva3m_PIC2018.jpg!/fw/580/compress/true/clip/580x772a0a0/format/webp' }
    // ]
    filterImg (arr, type = '') { // 转换img
      if (Array.isArray(arr)) {
        let newArr = []
        for (const list of arr) {
          let picPath = list.picPath || list.path
          picPath = this.isURL(picPath) ? picPath : CURRENT_ENV_PATH.ossPath + picPath
          if (list.businessType === type || !type) {
            newArr.push({ url: picPath })
          }
        }
        return newArr
      }
      return []
    }

    filterRate (e) { // 评价数据过滤 严格要求为0-5之间的数字类型
      let result = 0
      if (Number(e)) {
        if (parseFloat(e) >= 5) {
          result = 5
        } else if (parseFloat(e) > 0 && parseFloat(e) < 5) {
          result = parseFloat(e)
        }
      }
      return result
    }

    format (timestamp, fmt) { // 过滤时间戳
      return format(timestamp, 'yyyy-M-d HH:mm:s')
    }

    // 将二级三级列表数据调整为组件需要一维数组的格式
    changeTableFormat (data, key1, key2, temArr) {
      let arr = []
      if (Array.isArray(data[key1]) && data[key1].length > 0) {
        data[key1].forEach((ele, i) => {
          let obj = {}
          // 根据表头数组的vue拿到表头每一项value对应在二级中的属性值
          temArr.forEach(i => {
            obj[i.value] = ele[i.value] || ''
          })
          // 在将二维列表转化为一维数组时已经在每一项添加了对应的index可以根据index和start做排序防止关系顺序被打乱
          obj.index = i
          if (Array.isArray(ele[key2]) && ele[key2].length > 0) {
            obj.len = ele[key2].length
            ele[key2].forEach((item, isIndex) => {
              // 在每一个三位第一个索引下的哪一项最一个标记一维数组不好判断合并的起点在哪里
              if (isIndex === 0) {
                obj.start = true
              } else {
                obj.start = false
              }
              arr.push(Object.assign({}, obj, item))
            })
          } else {
            obj.len = 1
            arr.push(obj)
          }
        })
      }
      return arr
    }

    // 调整层级跨行表格合并对应的行数
    mergeTableHanle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 3 && row.len > 1) { // 这里是只有前三列并且组长度大于1的那些单元格
        if (row.start) { // 每一组的第一项单元格合并同组兄弟单元格，这里只考虑纵轴合并
          return {
            rowspan: row.len,
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

    // 简单的验证自己做一个这里没有用到框架中的表单组件
    validateInstallRule (form) {
      let notice = {}
      if (!form.creatTime) {
        notice.content = '请选择验收时间'
        notice.status = false
      } else if (!String(form.isPass)) {
        notice.content = '请选择验收结果'
        notice.status = false
      } else {
        notice.status = true
      }
      return notice
    }

    // 提交验收表单
    @orderDispatch.Action mulAcceptance
    @residual.Action leaveDeclareList // 遗留单列表

    submitCheckForm () {
      let [self, ispass, param] = [this, {}, {}]
      if (self.orderInfo && self.orderInfo.id) {
        param.orderIds = self.orderInfo.id
        ispass = self.validateInstallRule(self.checkInstallForm)
      } else {
        ispass = { status: false, content: '订单id不可以为空' }
      }
      if (!ispass.status) {
        self.$message.warning(ispass.content)
        return false
      }
      param.attachments = self.uploadImgList.map((item) => {
        return { name: item.name, path: item.url }
      })
      self.loading = true
      self.mulAcceptance(Object.assign(param, self.checkInstallForm)).then(res => {
        self.loading = false
        if (res.status && res.code === '200') {
          self.$message.success('提交成功')
          setTimeout(_ => {
            self.$router.go(-1)
          }, 500)
        } else {
          self.$message.error(res.message)
        }
      }).catch(err => {
        self.loading = false
        console.log('提交验收err', err)
      })
    }

    // 处理标签名称，转化成需要的数组形式，后台传进的是一串用，号隔开的字符串
    getTags (name) {
      if (name && name.indexOf(',') > -1) {
        return name.split(',').filter(item => {
          return item
        })
      }
      return []
    }

    // 附件处理
    handleUpload (file, fileList) {
      this.uploadImgList = fileList
    }

    onRemoveHandle (file, fileList) {
      this.uploadImgList = fileList
    }

    // 判断是否为完整地址
    isURL (str) {
      return str.substr(0, 4).toLowerCase() === 'http'
      // return !!str.match('/^http(s)?:\\\\/\\\\/.+/')
    }

    checkResidualDetail (row) { // 查看遗留申报明细信息
      this.$router.push({
        path: '/delivery-installation/order-dispatch-list/order-details/residual-detail',
        query: {
          orderIdentifier: row.orderIdentifier
        }
      })
    }

    renderResidulaList (params = {}) {
      this.leaveDeclareList(Object.assign({ orderNo: this.$route.query.orderNum }, params)).then(res => {
        if (res.status && Array.isArray(res.data)) {
          // console.log(res)
          this.residualTable = res.data
        }
        // else {
        //   this.$message.success(`遗留单申报记录${res.message}`)
        // }
      })
    }

    created () {
      this.renderResidulaList()
      // deliveryFacilitator
      if (this.orderInfo) {
        if (this.orderInfo.custContentment) {
          this.orderInfo.custContentment = this.filterRate(this.orderInfo.custContentment)
        } else {
          this.orderInfo.custContentment = 0
        }
      }
    }

    mounted () {
      this.routerType = this.$route.query.type || 'check'
    }

    get serveInfoTable () { // 订单信息表格数据
      return this.changeTableFormat(this.orderInfo, 'leve2', 'leve3', this.serviceTemArr)
    }

    get installTable () { // 安装信息表格数据
      let self = this
      return this.orderInfo && Array.isArray(this.orderInfo.installList) && this.orderInfo.installList.length > 0
        ? this.orderInfo.installList.map(i => {
          i.installTime = self.format(i.installTime)
          return i
        }) : []
    }

    get classifyAttachments () { // 将所有附件的一维数组进行分类
      if (Array.isArray(this.orderInfo.installAnnex) && this.orderInfo.installAnnex.length > 0) {
        // return {
        //   delivery: this.orderInfo.installAnnex.filter(i => i.annexType === 'delivery'),
        //   install: this.orderInfo.installAnnex.filter(i => i.annexType === 'install'),
        //   check: this.orderInfo.installAnnex.filter(i => i.annexType === 'check'),
        //   sleep: this.orderInfo.installAnnex.filter(i => i.annexType === 'sleep')
        // }
        return this.orderInfo.installAnnex.reduce((prev, cur) => {
          if (!prev[cur.annexType]) prev[cur.annexType] = []
          prev[cur.annexType].push(cur)
          return prev
        }, {})
      } else {
        return false
      }
    }
  }
</script>
<style lang="scss">
  .op-details-show-cards {
    .box-card {
      font-size: 14px;
      margin-top: 10px;
      .itemBox {
        line-height: 40px;
        .item-box-text {
          display: inline-block;
          width: 500px;
        }
        .itemImage {
          width: 150px;
          height: 150px;
          margin-right: 30px;
          margin-top: 15px;
        }
        .itemTag {
          margin-right: 5px;
        }
        .itemLable {
          color: #555;
        }
      }
      .item-foot {
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }

    .require-icon {
      position: relative;
      &:before {
        content: '*';
        position: absolute;
        color: #f56c6c;
        left: -10px;
      }
    }
    .position_item{
      padding: 5px;
      i{
        color: #fc9153;
        font-size: 18px;
        vertical-align: top;
      }
    }
    .acceptanceList{
      margin-bottom: 10px;
    }
  }
</style>
