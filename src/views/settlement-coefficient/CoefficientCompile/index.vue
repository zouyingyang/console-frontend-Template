<template>
  <div class="coefficientCompile">
    <Card>
      <div class="header" slot="head">
        <div class="header-toolbar buttomBoder">
          结算系数规则信息
        </div>
      </div>
      <div slot="content" >
        <el-col >
          <el-form v-loading="loading" class="coefficientRule" :inline="true" @submit.native.prevent>
            <el-row>
              <el-form-item label="规则名称" size="mini" >
                <el-input maxlength="40" size="mini" v-model="params.ruleName" placeholder="请输入规则名称" :disabled="openType === 'verify'"></el-input>
              </el-form-item>
              <el-form-item label="结算系数" size="mini">
                <el-input maxlength="6" size="mini" v-model="params.coefficient" placeholder="请输入结算系数" :disabled="openType === 'verify'"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="buttomBoder" style="margin-bottom: 20px;margin-left: 30px;margin-top:10px">
              商场属性
            </el-row>
            <el-row>
              <el-form-item label="品牌" size="mini">
                <el-select  @change="checkItem(params.brand,'brand')" v-model="params.brand" placeholder="请选择" :disabled="openType === 'verify' || option.brand.length===1" >
                  <el-option v-for="(item,index) in option.brand" :key="index" :label="item.brandName" :value="item.brandCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品类" size="mini">
                <el-select @change="checkItem(params.category,'category')" v-model="params.category" placeholder="请选择" :disabled="openType === 'verify' || option.category.length===1">
                  <el-option v-for="(item,index) in option.category" :key="index" :label="item.categoryName" :value="item.categoryCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-checkbox-group class="op-right" v-model="enjoyable" @change="chooseEnjoyable">
                  <el-form-item>
                    <el-checkbox label="can" :disabled="openType === 'verify'">可享受</el-checkbox>
                  </el-form-item>
                  <el-form-item label="" size="mini" v-if="enjoyable[0] === 'can'" class="checkItem">
                    <el-tag v-if="!checkCanEnjoy.length" class="checkTag" size="mini">暂未选择可享受商场</el-tag>
                    <el-tooltip v-else popper-class="checkMaketStr" class="item" effect="dark" :content="checkCanstr" placement="bottom">
                      <div class="op-left">
                        <el-tag v-if="index <= 2" v-for="(item,index) in checkCanEnjoy" :key="index" size="mini">{{item.name}}</el-tag>
                        <el-tag v-if="checkCanEnjoy.length > 3"  key="checkCanEnjoy" size="mini">. . .</el-tag>
                      </div>
                    </el-tooltip>
                    <el-button @click="showSearchStore" :disabled="openType === 'verify'" type="text">选择</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox class="" label="noCan" :disabled="openType === 'verify'">不可享受</el-checkbox>
                  </el-form-item>
                  <el-form-item label="" size="mini" v-if="enjoyable[0] === 'noCan'" class="checkItem">
                    <el-tag v-if="!checkNoCanEnjoy.length" class="checkTag" size="mini">暂未选择不可享受商场</el-tag>
                    <el-tooltip v-else popper-class="checkMaketStr" class="item" effect="dark" :content="checkNoCanstr" placement="bottom">
                      <div class="op-left">
                        <el-tag v-if="index <= 2" v-for="(item,index) in checkNoCanEnjoy" :key="index" size="mini">{{item.name}}</el-tag>
                        <el-tag v-if="checkNoCanEnjoy.length > 3"  key="checkNoCanEnjoy" size="mini">. . .</el-tag>
                      </div>
                    </el-tooltip>
                    <el-button @click="showSearchStore" :disabled="openType === 'verify'" type="text">选择</el-button>
                  </el-form-item>
                </el-checkbox-group>
              </el-form-item>
            </el-row>
            <el-row class="buttomBoder" style="margin-bottom: 20px;margin-left: 30px" v-show="params.category">
              订单属性-{{params.category|categoryFilter}}
            </el-row>
            <el-row class="order" v-show="params.category === 'category_chugui' || params.category === 'category_weiyu' || params.category === 'category_mumen'">
              <el-form-item v-show="params.category">
                <el-checkbox @change="checkChange(isLegacy,'isLegacy')" v-model="isLegacy" label="1" :disabled="openType === 'verify'">是否遗留</el-checkbox>
                <el-select v-if="isLegacy" v-model="params.isLegacy" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.isLegacy" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_weiyu'">
                <el-checkbox @change="checkChange(orderType,'orderType')" v-model="orderType" label="1" :disabled="openType === 'verify'">订单类型</el-checkbox>
                <el-select v-if="orderType" v-model="params.orderType" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.orderType" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.category === 'category_chugui'">
                <el-checkbox @change="checkChange(productType,'productType')" v-model="productType" label="1" :disabled="openType === 'verify'">产品类型</el-checkbox>
                <el-select v-if="productType" v-model="params.productType" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.productType" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_mumen'">
                <el-checkbox @change="checkChange(isIntegral,'isIntegral')" v-model="isIntegral" label="1" :disabled="openType === 'verify'">是否整装</el-checkbox>
                <el-select v-if="isIntegral" v-model="params.isIntegral" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.isIntegral" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_weiyu' || params.category === 'category_mumen'">
                <el-checkbox @change="checkChange(promotionType,'promotionType')" v-model="promotionType" label="1" :disabled="openType === 'verify'">促销类型</el-checkbox>
                <el-select v-if="promotionType" v-model="params.promotionType" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.promotionType" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="params.category === 'category_chugui'">
                <el-checkbox @change="checkChange(isAdditional,'isAdditional')" v-model="isAdditional" label="1" :disabled="openType === 'verify'">是否补单</el-checkbox>
                <el-select v-if="isAdditional" v-model="params.isAdditional" placeholder="请选择" style="margin-left: 10px" :disabled="openType === 'verify'">
                  <el-option v-for="item in option.isAdditional" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="24" class="remark">
                <el-form-item
                  style="margin-top: 5px"
                  label="备注">
                  <el-input
                    type="textarea"
                    maxlength="100"
                    :disabled="openType === 'verify'"
                    style="margin-top: 5px;width:700px"
                    v-model="params.remark" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" :offset="openType === 'compile'? 9 : 10">
                <el-form-item v-show="openType === 'compile'">
                  <el-button type="primary" size="mini" @click="save">保存</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="cancel">{{openType === 'compile'?'取消':'返回'}}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </div>
    </Card>
    <!--查询商场弹窗-->
    <el-dialog
      :visible.sync="isShowSearchStore"
      append-to-body
      title="查询商场"
      width="40%"
      top="3.4%"
      center
      :close-on-click-modal="false"
      class="SearchStore">
      <SearchStore key="getstoreByid1"
                   :checkMaketArr="enjoyable[0] === 'noCan' ? checkNoCanEnjoy: enjoyable[0] === 'can'? checkCanEnjoy : []"
                   @sumbitStore="sumbitStore"
                   :item = "params"
                   :isShow="isShowSearchStore"></SearchStore>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import { format, categoryFilter } from '@/utils/filter'
import { SaveAsFile } from '@/utils/lib'
// import storage from '@/utils/storage'
import SearchStore from '../CoefficientAdd/components/SearchStore'

const coefficientModule = namespace('settlement-coefficient/index')

  @Component({
    components: { Card, SearchStore },
    filters: { format, SaveAsFile, categoryFilter }
  })
export default class CoefficientAdd extends Vue {
    openType = 'verify'
    ruleId = ''
    userBrandList = ''
    loading = false
    totalSize = 0
    currentPage = 1
    searchKeyword=''
    dataType = ['order_type', 'product_category', 'activity_type']

    getstoreByid = false
    isShowSearchStore = false
    isLegacy = false // 是否遗留显示
    isIntegral = false // 是否整装
    isAdditional = false // 是否补单
    orderType = false // 订单类型显示
    productType = false // 产品类型显示
    promotionType = false // 促销类型显示

    enjoyable=[]// 是否可享受商场
    checkCanstr = '' // 可享受商场的拼接字符
    checkNoCanstr = '' // 不可享受商场的拼接字符
    checkCanEnjoy=[]// 可享受商场数组
    checkNoCanEnjoy=[]// 不可享受商场数组
    params = {
      brand: '',
      category: '',
      coefficient: '', // 结算系数
      delFlag: 0, // 是否删除（0否，1是）
      excludeAgentIds: '', // 不可享受的商场ids（用，拼接）
      includeAgentIds: '', // 可享受的商场ids（用，拼接）
      isAdditional: '', // 是否补单（0否，1是)
      isIntegral: '', // 是否整装（0否，1是）
      isLegacy: '', // 是否遗留单（0表示否，1表示是)
      orderType: '', // 订单类型MTDS字典值（普通单，样品单。。。）
      productType: '', // 产品类型MTDS字典值（普通订单，台面毛板。。。）
      promotionType: '', // 促销类型（网销，直销。。。）
      remark: '', // 备注
      ruleName: '' // 规则名称
    }
    option={
      brand: '',
      category: '',
      isLegacy: [
        { value: '0', label: '否' },
        { value: '1', label: '是' }],
      isIntegral: [
        { value: '0', label: '否' },
        { value: '1', label: '是' }],
      isAdditional: [
        { value: '0', label: '否' },
        { value: '1', label: '是' }],
      orderType: [],
      promotionType: [],
      productType: []
    }
    // 查看系数规则详情
    @coefficientModule.Action getRuleById
    // 编辑规则
    @coefficientModule.Action editRule
    // 根据字典编码获取下级字典列表
    @coefficientModule.Action getDictionaryCacheListByCode
    // Enjoyable选择 只能选一个
    chooseEnjoyable (data) {
      let arr = [...data]
      if (arr.length > 1) {
        this.enjoyable = []
        this.enjoyable.push(arr[1])
        if (this.enjoyable[0] === 'can') {
          this.checkNoCanEnjoy = []
        }
        if (this.enjoyable[0] === 'noCan') {
          this.checkCanEnjoy = []
        }
      }
      // this.initData()
    }
    checkChange (boolen, type) {
      if (!boolen) {
        this.params[type] = ''
      }
    }

    getRule () {
      this.loading = true
      this.getRuleById({ ruleId: this.ruleId }).then(res => {
        if (res.status && res.code === '200') {
          console.log('查看系数规则详情', res)
          this.params = JSON.parse(JSON.stringify(res.data))
          res.data.isLegacy === null ? this.params.isLegacy = '' : this.params.isLegacy = res.data.isLegacy + ''
          res.data.isAdditional === null ? this.params.isAdditional = '' : this.params.isAdditional = res.data.isAdditional + ''
          res.data.isIntegral === null ? this.params.isIntegral = '' : this.params.isIntegral = res.data.isIntegral + ''
          this.isLegacy = res.data.isLegacy !== null
          this.isAdditional = res.data.isAdditional !== null
          this.isIntegral = res.data.isIntegral !== null
          this.orderType = !!res.data.orderType
          this.productType = !!res.data.productType
          this.promotionType = !!res.data.promotionType
          this.option.brand = [{ brandCode: res.data.brand, brandName: this.brandFilter(res.data.brand) }]
          this.option.category = [{ categoryCode: res.data.category, categoryName: this.categoryFilter(res.data.category) }]
          this.params.brand = res.data.brand
          this.params.category = res.data.category
          this.enjoyable = []
          if (res.data.includeAgentList.length) {
            this.checkCanEnjoy = []
            this.enjoyable.push('can')
            res.data.includeAgentList.forEach((item) => {
              item.check = true
              this.checkCanEnjoy.push(item)
            })
          }
          if (res.data.excludeAgentList.length) {
            this.checkNoCanEnjoy = []
            this.enjoyable.push('noCan')
            res.data.excludeAgentList.forEach((item) => {
              item.check = true
              this.checkNoCanEnjoy.push(item)
            })
          }
          // this.loading = false
        }
      }).catch(error => {
        this.loading = false
        console.log('查看系数规则详情error', error)
        this.$message.warning('查看系数规则详情error')
      })
    }

    // 查询商场弹窗
    showSearchStore () {
      this.getstoreByid = false
      this.isShowSearchStore = true
    }
    // 商场确认
    sumbitStore (data) {
      console.log('商场确认', data)
      if (this.enjoyable[0] === 'noCan') {
        this.checkNoCanEnjoy = data// 不可享受商场数组
      } else if (this.enjoyable[0] === 'can') {
        this.checkCanEnjoy = data
      }
    }
    // 保存并关闭
    save () {
      if (this.openType === 'verify') {
        this.$router.push({
          name: 'coefficient'
        })
      } else {
        this.params.ruleName = this.params.ruleName.replace(/\s+/g, '')
        if (!!this.params.brand && !!this.params.category && !!this.params.coefficient && !!this.params.ruleName) {
          let params = {}
          let checkArr = []
          params.isLegacy = ''
          params.isIntegral = ''
          params.isAdditional = ''
          params.orderType = ''
          params.productType = ''
          params.promotionType = ''
          params.brand = this.params.brand
          params.category = this.params.category
          params.delFlag = this.params.delFlag
          params.excludeAgentIds = this.params.excludeAgentIds
          params.includeAgentIds = this.params.includeAgentIds
          params.remark = this.params.remark.replace(/\s+/g, '')
          params.ruleId = this.params.ruleId
          params.ruleName = this.params.ruleName
          params.coefficient = this.params.coefficient * 1
          params.coefficient = params.coefficient.toFixed(4)
          if (this.enjoyable.length) {
            if (this.enjoyable[0] === 'can') {
              params.includeAgentIds = ''
              if (this.checkCanEnjoy.length) {
                this.checkCanEnjoy.forEach((item) => {
                  checkArr.push(item.id)
                })
                params.includeAgentIds = checkArr.join(',')
              }
            } else if (this.enjoyable[0] === 'noCan') {
              params.excludeAgentIds = ''
              if (this.checkNoCanEnjoy.length) {
                this.checkNoCanEnjoy.forEach((item) => {
                  checkArr.push(item.id)
                })
                params.excludeAgentIds = checkArr.join(',')
              }
            }
          }
          if (/^(0\.(?!0+$)\d{1,4}|1(\.0{1,4})?)$/.test(params.coefficient)) {
            // isLegacy = false //是否遗留显示
            // isIntegral = false //是否整装
            // isAdditional = false //是否补单
            // orderType = false //订单类型显示
            // productType = false //产品类型显示
            // promotionType = false //促销类型显示
            if (this.params.category === 'category_chugui') {
              this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
              this.isIntegral ? params.isIntegral = this.params.isIntegral : params.isIntegral = ''
              this.isAdditional ? params.isAdditional = this.params.isAdditional : params.isAdditional = ''
              this.orderType ? params.orderType = this.params.orderType : params.orderType = ''
              this.productType ? params.productType = this.params.productType : params.productType = ''
              this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
              if (params.isLegacy || params.isIntegral || params.isAdditional || params.orderType || params.productType || params.promotionType) {
                this.saveFunction(params)
              } else {
                this.$message.warning('订单属性必须填写一个~')
              }
            }
            if (this.params.category === 'category_weiyu') {
              this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
              this.orderType ? params.orderType = this.params.orderType : params.orderType = ''
              this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
              if (params.isLegacy || params.orderType || params.promotionType) {
                this.saveFunction(params)
              } else {
                this.$message.warning('订单属性必须填写一个~')
              }
            }
            if (this.params.category === 'category_mumen') {
              this.isIntegral ? params.isIntegral = this.params.isIntegral : params.isIntegral = ''
              this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
              this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
              if (params.isLegacy || params.isIntegral || params.promotionType) {
                this.saveFunction(params)
              } else {
                this.$message.warning('订单属性必须填写一个~')
              }
            }
          } else {
            this.$message.warning('您必须输入一个0.0001~1.0000的结算系数~')
          }
        } else if (!this.params.ruleName) {
          this.$message.warning('请输入规则名称~')
        } else if (!this.params.coefficient) {
          this.$message.warning('请输入结算系数~')
        } else if (!this.params.brand) {
          this.$message.warning('请选择品牌~')
        } else if (!this.params.category) {
          this.$message.warning('请选择品类~')
        }
      }
    }

    // 保存函数
    saveFunction (params) {
      this.loading = true
      this.editRule(params).then(res => {
        if (res.status && res.code === '200') {
          this.$message.success('保存结算系数成功')
          this.loading = false
          this.$router.push({
            name: 'coefficient'
          })
        }
      }).catch(error => {
        this.loading = false
        console.log('保存结算系数error', error)
        this.$message.warning('保存结算系数error')
      })
    }
    // 清空选择
    clearCheck () {
      this.isLegacy = false // 是否遗留显示
      this.isIntegral = false // 是否整装
      this.isAdditional = false // 是否补单
      this.orderType = false // 订单类型显示
      this.productType = false // 产品类型显示
      this.promotionType = false // 促销类型显示
    }
    // 取消
    cancel () {
      this.$router.push({
        name: 'coefficient'
      })
    }
    // 处理翻页
    handleCurrentChange (val) {
      this.currentPage = val
    }
    // 品牌
    brandFilter (value) {
      switch (value) {
        case 'brand_oppein' : return '欧派'
        case 'brand_oboli' : return '欧铂丽'
        // case 'brand_oboni' : return '欧铂尼'
      }
    }

    // 品类
    categoryFilter (value) {
      switch (value) {
        case 'category_chugui' : return '橱柜'
        case 'category_weiyu' : return '卫浴'
        case 'category_yigui' : return '集成家居'
        case 'category_jinshumenchuang' : return '金属门窗'
        case 'category_mumen' : return '木门'
        // case 'category_yigui' : return '衣柜'
        case 'category_qiangshi' : return '软装'
        // case 'category_qiangshi' : return '墙饰'
        case 'category_bigFamily' : return '大家居'
      }
    }
    @Watch('checkCanEnjoy')
    watchEnjoyable (newVal) {
      let arr = []
      if (newVal.length) {
        this.checkCanEnjoy.forEach((item) => {
          arr.push(item.name)
        })
        this.checkCanstr = arr.join(',')
      }
    }

    @Watch('checkNoCanEnjoy')
    watchNoEnjoyable (newVal) {
      let arr = []
      if (newVal.length) {
        this.checkNoCanEnjoy.forEach((item) => {
          arr.push(item.name)
        })
        this.checkNoCanstr = arr.join(',')
      }
    }

    created () {
      this.openType = this.$route.query.type
      this.ruleId = this.$route.query.ruleId
      this.getRule()
      // ['order_type','product_category','activity_type']
      this.getDictionaryCacheListByCode({ code: this.dataType[0] }).then((res) => {
        this.option.orderType = res.data
        this.getDictionaryCacheListByCode({ code: this.dataType[1] }).then((res) => {
          this.option.productType = res.data
          this.option.productType = this.option.productType.filter((item) => {
            return item.code.indexOf(this.params.category.split('_')[1]) !== -1
          })
          this.getDictionaryCacheListByCode({ code: this.dataType[2] }).then((res) => {
            this.option.promotionType = res.data
            this.loading = false
          }).catch((error) => {
            this.$message.error(error)
            console.log('error', error)
          })
        }).catch((error) => {
          this.$message.error(error)
          console.log('error', error)
        })
      }).catch((error) => {
        this.$message.error(error)
        console.log('error', error)
      })
    }
    mounted () {
    }
  }
</script>

<style src="./style.scss" lang="scss"></style>
