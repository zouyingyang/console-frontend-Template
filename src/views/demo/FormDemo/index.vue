<template>
  <div>
    <div class="form-demo" v-show="!$route.meta.hidden">
      <Card v-loading="loading">
        <div slot="head">
          <el-col :span="24">
          <el-form :model="params" :inline="true" class="el-right" @submit.native.prevent>
            <el-form-item label="" class="op-left no-margin-bottom">
              <el-button size="mini" type="primary">导出</el-button>
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
            <el-form-item style="margin-right: 0" class="no-margin-bottom">
              <el-button size="mini" type="primary" @click="initData" v-show="!seniorSearchFlag">
                查询
              </el-button>
              <el-button type="primary" size="mini" @click="seniorSearchFlag = !seniorSearchFlag">
                {{seniorSearchFlag ? '收起高级搜索' : '展开高级搜索'}}
              </el-button>
            </el-form-item>
          </el-form>
          </el-col>
          <el-col :span="24" v-show="seniorSearchFlag" class="op-margin-top-10">
            <el-form :model="params" :inline="true">
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="客户是否齐套" size="mini">
                        <el-checkbox-group class="op-right">
                          <el-checkbox  label="2" name="serviceNoComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="serviceNoComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="serviceNoComplete">未收货</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="订单是否齐套" size="mini">
                        <el-checkbox-group class="op-right">
                          <el-checkbox  label="2" name="isComplete">已齐套</el-checkbox>
                          <el-checkbox  label="1" name="isComplete">部分齐套</el-checkbox>
                          <el-checkbox  label="0" name="isComplete">未收货</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="验收结果" size="mini">
                        <el-checkbox-group class="op-right">
                          <el-checkbox  label="1" name="isPass">通过</el-checkbox>
                          <el-checkbox  label="0" name="isPass">不通过</el-checkbox>
                        </el-checkbox-group>
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
                          size="mini"
                          style="width: 260px;"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="工厂交期" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          size="mini"
                          style="width: 260px;"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="收货齐套时间" size="mini">
                        <el-date-picker
                          value-format="timestamp"
                          size="mini"
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
                </el-col>
                <el-col :span="24">
                  <el-row style="margin-bottom:22px;float:right;">
                    <el-button type="primary" size="mini" @click="initData">高级查询</el-button>
                    <el-button type="primary" size="mini">清空所有条件</el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </div>
        <div slot="content">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="活动名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="即时配送">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="经销商线下活动" name="type"></el-checkbox>
                <el-checkbox label="点将活动" name="type"></el-checkbox>
                <el-checkbox label="年会活动" name="type"></el-checkbox>
                <el-checkbox label="品牌曝光" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
              <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="foot">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
        </div>
      </Card>

    </div>
    <router-view></router-view>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
// import { namespace } from 'vuex-class'
import Card from '@/components/Card'
// const moduleDemo = namespace('demo')

  @Component({
    components: { Card }
  })
class FormDemo extends Vue {
    loading = false
    seniorSearchFlag = false // 显示隐藏高级搜索
    params = {
      searchKeyword: '' // 搜索字段
    }
    form = {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    }

    initData () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
export default FormDemo
</script>

<style scoped src="./style.scss" lang="scss"></style>
