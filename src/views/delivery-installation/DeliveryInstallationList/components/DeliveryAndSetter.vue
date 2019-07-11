<template>
  <el-container>
    <el-main>
      <div>
        <div style="overflow: hidden;margin-bottom: 20px">
          <div style="float: right;">
            <el-input style="width: 72%; margin-right: 5px" v-model="params.searchKeyword"
                      @keyup.enter.native="submitSearch"
                      clearable
                      maxlength="50"
                      size="mini" :placeholder="choose?'请输入协助人名字':'请输入责任人名字'"></el-input>
            <el-button @click="submitSearch" size="mini" type="primary">搜索</el-button>
          </div>
        </div>
        <div class="mulCheck" style="margin-bottom: 20px" v-if="choose">
          已选择协助人:
          <el-tag v-for="(item,index) in multipleValues" :key="index" @close="assistantClose(item)"
                  closable size="mini">{{item.name}}
          </el-tag>
          <el-button @click="multipleChose" size="mini" type="primary" style="float: right; margin-right: 6px">确认
          </el-button>
        </div>
      </div>
      <template>
        <el-table
          class="deliveryAndSetter"
          v-loading="loading"
          size="mini"
          :data="tableData"
          style="width: 100%;"
          max-height="450"
          border>
          <!-- :max-height="fullHeight" -->
          <div v-for="list in tableHead" :key="list.name">
            <div v-if="list.name==='操作'">
              <el-table-column align="center" :label="list.name" v-if="list.name==='操作'">
                <div slot-scope="scope">
                  <el-button v-if="choose" type="text"
                             @click="multipleChoseDeliveryInstallStaff(scope.row)">选择
                  </el-button>
                  <el-button v-else type="text" @click="choseDeliveryInstallStaff(scope.row)">选择
                  </el-button>
                </div>
              </el-table-column>
            </div>
            <div v-else-if="list.name==='性别'">
              <el-table-column align="center" :label="list.name" v-if="list.name==='性别'">
                <div slot-scope="scope">
                  {{scope.row.sex | changeCN}}
                </div>
              </el-table-column>
            </div>

            <div v-else>
              <el-table-column align="center" :prop="list.value" :label="list.name"></el-table-column>
            </div>
          </div>

        </el-table>
      </template>

      <!-- 分页 -->
      <el-pagination
        class="busPagin"
        @current-change="changeCurrentPage"
        @size-change="handleSizeChange"
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>

    </el-main>
  </el-container>

</template>

<script>

/*
             type 请求数据类型
             type：Number 1-送货员 2-安装工
             说明：选择当前请求责任人或协助人类型

             choose：是否可以多选，
             type：Boolean true为多选，false为单选
             说明：当前调用组件是否需要多选

             changeState是否触发安装工初始化
             type：Boolean true/false
             可通过diolog 状态值传入

             dutyPreson 责任人id，
             type：String
             说明：传入责任人id，在选择协助人时防止选择与责任人相同

             multipleValues 协助人数组，可为空
             type：Array
             说明：choose时为true时必传multipleValues 多选值为[{name:**,id:**},{name:**,id:**},...]

             组件返回值：
               返回责任人确认函数函数choseDeliveryInstallStaff，返回所选行所有数据
               协助人返回函数multipleChose，返回所选协助人对象数组，包含协助人姓名和id
          */

// import {changeCN} from '@/util/filter';
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { changeCN } from '@/utils/filter'

const deliveryInstallationList = namespace('delivery-installation/deliveryInstallationList')
  @Component({
    components: {},
    filters: { changeCN }
  })
export default class deliveryAndSetter extends Vue {
    @Prop({ type: Number, default: 1 }) type
    @Prop({ type: Boolean, default: false }) choose
    @Prop({ type: Boolean, default: false }) changeState
    @Prop({ type: String, default: '' }) dutyPreson
    @Prop({ type: Array, default: () => { return [] } }) multipleValues
    @Prop({ type: Object, default: () => { return {} } }) paramsData // 接口参数

    loading = false
    total = 0
    params = {
      type: 1,
      pageNum: 1,
      pageSize: 20,
      searchKeyword: ''
    }
    tableHead = [
      {
        name: '操作',
        value: ''
      }, {
        name: '姓名',
        value: 'name'
      }, {
        name: '性别',
        value: 'sex'
      }, {
        name: '电话',
        value: 'mobile'
      }
    ]
    tableData = []

    // 获取送货安装工列表
    @deliveryInstallationList.Action deliveryInstallStaff

    // 选择安装工定义 choseDeliveryInstallStaff函数 返回数据
    choseDeliveryInstallStaff (row) {
      let repetition = false // 查询选择责任人是否和协助人重复
      if (this.multipleValues.length) {
        this.multipleValues.forEach((item) => {
          if (item.id === row.id) {
            repetition = true
          }
        })
      } else {
        this.$emit('choseDeliveryInstallStaff', row)
      }
      if (repetition) {
        this.$message.warning('选择责任人不能为协助人~')
      } else {
        this.$emit('choseDeliveryInstallStaff', row)
      }
    }

    // 选择协助人确认返回函数
    multipleChose () {
      console.log('选择协助人确认返回', this.multipleValues)
      this.$emit('multipleChoseDeliveryInstallStaff', this.multipleValues)
    }

    // 协助人多选事件
    multipleChoseDeliveryInstallStaff (row) {
      if (this.dutyPreson === row.id) {
        this.$message.warning('选择该协助人不能是责任人,请从新选择~')
      } else {
        let obj = {}
        obj.name = row.name
        obj.id = row.id
        if (this.multipleValues.length) {
          this.multipleValues.forEach((item, index) => {
            if (item.id === row.id) {
              this.multipleValues.splice(index, 1)
            }
          })
        }
        this.multipleValues.push(obj)
      }
    }

    // 换页控制
    changeCurrentPage (val) {
      this.params.pageNum = val
      this.initData()
    }

    // 一页展示多少条数据
    handleSizeChange (size) {
      this.params.pageSize = size
      this.initData()
    }

    // 协助人选择事件
    assistantClose (tag) {
      this.multipleValues.forEach((item, index) => {
        if (item.id === tag.id) {
          this.multipleValues.splice(index, 1)
        }
      })
    }

    // 提交搜索内容
    submitSearch () {
      this.initData()
    }

    // 初始化数据
    initData () {
      this.loading = true
      this.params.type = this.type
      this.tableData = []
      // console.log({ ...this.params })
      this.deliveryInstallStaff(Object.assign(this.params, this.paramsData)).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status && res.code === '200') {
          if (res.data) {
            this.total = res.data.total
            this.tableData = res.data.list
          }
        }
      }).catch(error => {
        this.total = 0
        this.loading = false
        console.log('获取人员列表error', error)
      })
    }

    // get fullHeight () {
    //   return document.documentElement.clientHeight * 0.45
    // }

    @Watch('choose')
    chooseChange (choose) {
      this.params.searchKeyword = ''
      this.choose = choose
      this.initData()
    }

    @Watch('type')
    typeChange (type) {
      this.params.searchKeyword = ''
      this.total = 0
      this.params.pageNum = 1
      this.type = type
      this.initData()
    }

    @Watch('changeState')
    changeStateChange (changeState) {
      if (changeState) {
        this.params.searchKeyword = ''
        this.total = 0
        this.params.pageNum = 1
        this.initData()
      }
    }
    created () {
      this.initData()
    }
  }
</script>

<style scoped src="./style.scss" lang="scss">

</style>
